# Live-Flugstatus einrichten

Der statische Flugplan funktioniert ohne diese Einrichtung. Der externe API-Key wird ausschließlich in der Supabase Edge Function gelesen und gelangt weder in GitHub Pages noch in das React-Bundle.

## 1. AeroDataBox-Konto erstellen

Öffne die [offizielle AeroDataBox-Dokumentation](https://doc.aerodatabox.com/) und wähle die RapidAPI-Variante. Erstelle dort ein Konto und abonniere einen Tarif, der den Flight-Status-Endpunkt für ein konkretes Datum unterstützt.

## 2. API-Key erzeugen

Kopiere im RapidAPI-Dashboard den persönlichen AeroDataBox-Key. Speichere ihn nicht in `.env`, im Frontend oder in GitHub Actions.

## 3. Neue Migration ausführen

Öffne im Supabase Dashboard den SQL Editor und führe ausschließlich `supabase/migrations/202608170003_media_and_flights.sql` aus. Sie ergänzt das Medienmodell, aktualisiert den privaten Storage-Bucket und erstellt den nicht öffentlich lesbaren Cache.

## 4. Supabase CLI verbinden

```bash
npx supabase login
npx supabase link --project-ref DEINE_PROJECT_REF
```

Alternativ kann die Function im Dashboard unter Edge Functions angelegt werden. Der Inhalt liegt in `supabase/functions/flight-status/index.ts`.

## 5. API-Key als Supabase Secret hinterlegen

```bash
npx supabase secrets set FLIGHT_API_KEY=DEIN_AERODATABOX_KEY
```

Optional kann die serverseitige Basis-URL gesetzt werden:

```bash
npx supabase secrets set FLIGHT_API_BASE_URL=https://aerodatabox.p.rapidapi.com
```

`SUPABASE_URL` und der serverseitige Supabase-Key werden von der gehosteten Edge-Function-Umgebung bereitgestellt. Niemals einen Secret-/Service-Role-Key ins Frontend oder nach GitHub kopieren.

## 6. Edge Function deployen

```bash
npx supabase functions deploy flight-status --no-verify-jwt
```

Die Function ist öffentlich aufrufbar, akzeptiert aber ausschließlich die vier fest hinterlegten Flugnummer-/Datums-Kombinationen. Der Provider-Key bleibt serverseitig; Cache und Refresh-Lock begrenzen externe Requests.

## 7. Testrequest ausführen

Zuerst nur die Konfiguration prüfen:

```bash
curl -X POST "https://DEINE_PROJECT_REF.supabase.co/functions/v1/flight-status" \
  -H "Content-Type: application/json" \
  -d '{"mode":"capabilities"}'
```

Die Antwort soll `"configured":true` enthalten. Dabei wird AeroDataBox noch nicht aufgerufen.

## 8. EK060 und App testen

```bash
curl -X POST "https://DEINE_PROJECT_REF.supabase.co/functions/v1/flight-status" \
  -H "Content-Type: application/json" \
  -d '{"flightNumber":"EK060","flightDate":"2026-08-30"}'
```

Öffne danach `/#/flights`. Der statische Plan muss immer sichtbar sein. Innerhalb von 24 Stunden vor dem relevanten Flug lädt die App Live-Daten. Bei einem Providerfehler wird ein vorhandener Cache als letzter bekannter Status angezeigt; ohne Cache erscheint keine erfundene Position oder Verspätung.
