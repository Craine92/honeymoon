# GitHub Pages aktivieren

1. Öffne im Repository **Settings → Secrets and variables → Actions → Variables**.
2. Lege `VITE_SUPABASE_URL` mit der öffentlichen Supabase-Projekt-URL an.
3. Lege `VITE_SUPABASE_ANON_KEY` mit dem öffentlichen `sb_publishable_…`- oder Legacy-Anon-Key an. Keinen Secret-/Service-Role-Key verwenden.
4. Öffne **Settings → Pages** und wähle unter **Build and deployment → Source** den Eintrag **GitHub Actions**.
5. Starte bei Bedarf unter **Actions → Deploy GitHub Pages → Run workflow** den Workflow manuell.

Der Workflow prüft beide Werte, führt `npm ci`, Lint und Build aus und veröffentlicht `dist`. Die App verwendet `/honeymoon/` als Produktions-Basispfad und Hash-Routing, sodass direkte Unterseiten wie `https://craine92.github.io/honeymoon/#/flights` ohne Server-Fallback funktionieren.
