const allowedStatuses = new Set(["new", "in_progress", "answered"]);

function createJsonResponse(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  };
}

function normalizeText(value) {
  return String(value || "").trim();
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    createJsonResponse(response, 405, { success: false, error: "Method not allowed" });
    return;
  }

  const { url, key } = getSupabaseConfig();

  if (!url || !key) {
    createJsonResponse(response, 500, { success: false, error: "Missing Supabase configuration" });
    return;
  }

  const body =
    typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};

  const payload = {
    name: normalizeText(body.name),
    email: normalizeText(body.email),
    phone: normalizeText(body.phone),
    subject: normalizeText(body.subject),
    message: normalizeText(body.message),
    status: allowedStatuses.has(body.status) ? body.status : "new",
  };

  if (!payload.name || !payload.email || !payload.subject || !payload.message) {
    createJsonResponse(response, 400, { success: false, error: "Missing required fields" });
    return;
  }

  const supabaseResponse = await fetch(
    `${url.replace(/\/$/, "")}/rest/v1/contact_messages`,
    {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!supabaseResponse.ok) {
    const error = await supabaseResponse.text();
    createJsonResponse(response, supabaseResponse.status, { success: false, error });
    return;
  }

  createJsonResponse(response, 200, { success: true });
}
