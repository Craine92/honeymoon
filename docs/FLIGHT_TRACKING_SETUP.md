# Manuellen Flugstatus einrichten

Our Honeymoon verwendet keine externe Flight-API. Der feste Flugplan liegt in der App; Philipp und Justine pflegen Status, Gate, erwartete Zeiten und einen öffentlichen Hinweis direkt als eingeloggte Owner.

## Supabase vorbereiten

1. Öffne im Supabase Dashboard den **SQL Editor**.
2. Führe ausschließlich `supabase/migrations/202608170004_manual_flight_status.sql` aus.
3. Öffne danach die Tabelle `public.flight_updates`.
4. Prüfe, dass RLS aktiv ist. Gäste besitzen nur `SELECT`; Änderungen sind ausschließlich über `public.is_owner()` erlaubt.

Die Migration entfernt den nicht mehr benötigten externen Provider-Cache und erstellt `flight_updates`. Es werden keine Reise-, Auth-, Medien- oder Riffdaten gelöscht. Es sind keine zusätzlichen Secrets und keine Edge Function erforderlich.

## Status pflegen

1. Öffne die App und melde dich unter **Mehr** als Owner an.
2. Öffne **Flüge**.
3. Tippe bei einem Flug auf **Status aktualisieren**.
4. Wähle den Status und ergänze optional Gate, erwartete Abflug-/Ankunftszeit und einen kurzen allgemeinen Hinweis.
5. Speichere. Die öffentliche Ansicht wird über Supabase Realtime aktualisiert.

Keine Buchungsnummern, PNRs, Ticketnummern, Sitzplätze oder persönlichen Emirates-Daten in das Hinweisfeld eintragen.
