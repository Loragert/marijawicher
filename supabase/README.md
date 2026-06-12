# Supabase setup

## Env variables

Create `.env` locally from `.env.example` and fill:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database and storage

Run `supabase/products_schema.sql` in the Supabase SQL Editor. The script creates:

- `products`
- `product_images`
- `products` Storage bucket
- public read policies
- admin write policies

Admin write access is based on this JWT app metadata:

```json
{
  "role": "admin"
}
```

## Connection test

Use `testSupabaseConnection` from `src/lib/supabaseConnectionTest.js` after env variables and SQL are configured.
