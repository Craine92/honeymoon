# Our Honeymoon — Malediven 2026

Eine installierbare, mobile Reise-App für die Flitterwochen von Philipp und Justine im Sun Siyam Iru Veli. Familie und Freunde öffnen direkt die öffentliche, redaktionell gestaltete Reiseansicht. Philipp und Justine pflegen Inhalte nach einem dezenten Login direkt in derselben Oberfläche.

## Funktionen

- Automatische Reisephase und Countdown bis zum Abflug am 30. August 2026 um 15:30 Uhr
- Exakt zwölf Reisetage vom 30.08. bis einschließlich 10.09.2026
- Vollständig öffentlicher Reiseplan, Riff-Tagebuch, Erinnerungen, Highlights und berechnete Statistiken
- Live-Wetter und Meeresdaten von Open-Meteo mit 20-Minuten-/Offline-Cache
- Dynamischer Feed „Neu bei uns“ und automatisch erkannter aktueller Reisetag
- Owner-Login mit E-Mail und Passwort, ohne öffentliche Registrierung
- Eingebettetes CRUD für Reisetage, Aktivitäten, Sichtungen, Erinnerungen und Highlights
- Privater Storage-Bucket für Bilder und Videos, Bildverkleinerung, Video-Poster und Vorschau vor dem Upload
- Vollständiger statischer Flugplan mit zeitzonensicheren lokalen Zeiten und manuellem Live-Status durch Philipp und Justine
- Minutenaktuelle Ortszeit für Iru Veli auf Wetterkarte und Wetterdetailseite
- Ausschließlich private Packliste und Ausgaben
- Installierbare PWA mit Offline-App-Shell und klar blockierten Offline-Schreibaktionen
- Mobile Bottom Navigation und Desktop-Sidebar

## Technischer Aufbau

React, TypeScript strict, Vite, Tailwind CSS, React Router, Lucide, date-fns, Supabase und `vite-plugin-pwa`. Die zentralen Reisedaten stehen in `src/config/trip.ts`. Reine Kalendertage werden ohne UTC-Konvertierung verarbeitet, um Off-by-one-Fehler zu vermeiden.

## Lokale Entwicklung

```bash
npm install
copy .env.example .env
npm run dev
```

In `.env` werden ausschließlich die öffentliche Supabase-URL und der öffentliche Anon-Key eingetragen. Ohne konfigurierte Variablen startet die App weiterhin als öffentliche Vorschau mit korrektem Reisezeitraum und leeren Inhaltsbereichen; Login und Cloud-Daten sind dann nicht verfügbar.

```bash
npm run lint
npm run build
npm run preview
```

## Supabase

Die Migrationen unter `supabase/migrations/` erzeugen PostgreSQL-Tabellen, zwölf Reisetage, Trigger, Indizes, Storage und sämtliche RLS-Policies. v0.5 ergänzt ausschließlich `202608170004_manual_flight_status.sql`: Sie entfernt den alten Provider-Cache und erstellt öffentliche, nur durch Owner veränderbare Flugupdates. Die vollständige Klick-für-Klick-Einrichtung steht in [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md); die Statuspflege in [docs/FLIGHT_TRACKING_SETUP.md](docs/FLIGHT_TRACKING_SETUP.md). Owner-Profile werden nach Erstellung der Auth-Nutzer mit [supabase/OWNER_SETUP.sql](supabase/OWNER_SETUP.sql) angelegt.

## Gastansicht und Sicherheitsmodell

Gäste benötigen kein Login. RLS erlaubt ihnen das Lesen sämtlicher Reisetage, Aktivitäten, Sichtungen, Erinnerungen, Bilder und Highlights. Sie besitzen keinerlei Schreibrechte. Owner-Rechte werden zentral über `profiles.role = 'owner'` ermittelt; E-Mail-Adressen sind nicht hardcodiert.

Expenses und Packliste besitzen keine öffentliche Select-Policy. Private Memories, Sichtungen, Aktivitäten und Highlights werden bereits von PostgreSQL herausgefiltert. Der Bucket `memories` ist privat; öffentliche Bilder werden nur über RLS-geprüfte Signed URLs bereitgestellt. Ein Frontend-Hide ersetzt keine Sicherheit – die Datenbank ist die verbindliche Schutzschicht.

Es dürfen weder Service-Role-Keys noch Passwörter, Buchungsnummern, Passdaten, Gesundheitsdaten oder Zahlungsinformationen im Repository gespeichert werden.

## PWA und Offline-Verhalten

Der Production-Build erzeugt Manifest und Workbox-Service-Worker. App-Shell, Skripte, Styles, Icons und Hero-Bild werden vorgecached. Lesbare Inhalte können aus dem Browsercache erscheinen; Supabase-Schreibvorgänge werden offline mit einer deutschen Meldung blockiert und niemals als erfolgreich dargestellt.

## Deployment

- **Vercel:** Vite-Preset, Build `npm run build`, Output `dist`; anschließend beide `VITE_SUPABASE_*`-Variablen setzen.
- **Netlify:** `netlify.toml` enthält Build und SPA-Fallback; Variablen in Site configuration ergänzen.
- **GitHub Pages:** Der Workflow `.github/workflows/deploy-pages.yml`, der Basispfad `/honeymoon/` und Hash-Routing sind vorbereitet. Die nötigen Repository-Variablen und Dashboard-Schritte stehen in [docs/GITHUB_PAGES_SETUP.md](docs/GITHUB_PAGES_SETUP.md).

Nach dem Deployment die Production-URL in Supabase unter **Authentication → URL Configuration** als Site URL hinterlegen und Guest-/Owner-Flows erneut prüfen.
