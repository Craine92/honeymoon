# Supabase-Einrichtung für Our Honeymoon

## 1. Projekt erstellen

1. Auf [supabase.com](https://supabase.com) anmelden und **New project** wählen.
2. Organisation auswählen, einen Projektnamen wie `our-honeymoon` vergeben und ein starkes Datenbankpasswort erzeugen.
3. Eine europäische Region wählen und warten, bis das Projekt bereit ist.

## 2. URL und öffentlichen Schlüssel kopieren

1. Im Projekt **Settings → API** beziehungsweise **Project Settings → Data API** öffnen.
2. **Project URL** kopieren.
3. Den **anon public** beziehungsweise **Publishable key** kopieren. Keinen `service_role`-Schlüssel verwenden.

## 3. Lokale `.env` anlegen

Im Projektordner `.env.example` nach `.env` kopieren und einsetzen:

```env
VITE_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
VITE_SUPABASE_ANON_KEY=DEIN_ANON_KEY
```

`.env` wird durch `.gitignore` ausgeschlossen. Anschließend den Vite-Dev-Server neu starten.

## 4. Migration ausführen

1. In Supabase **SQL Editor → New query** öffnen.
2. Bei einer neuen Installation zuerst den gesamten Inhalt von `supabase/migrations/202608170001_initial_schema.sql` einfügen und ausführen.
3. Danach `supabase/migrations/202608170002_public_trip_content.sql` in eine neue Query kopieren und **Run** klicken. Bei einem bestehenden v0.2-Projekt nur diese zweite Migration ausführen.
4. Unter **Table Editor** prüfen, dass `profiles`, `trip_days`, `activities`, `reef_sightings`, `memories`, `highlights`, `packing_items` und `expenses` existieren.
5. In `trip_days` müssen zwölf Zeilen vom 30.08.2026 bis 10.09.2026 stehen.

Die Migration aktiviert RLS für jede Tabelle, legt Policies, Indizes, Zeitstempel-Trigger und den privaten Storage-Bucket an.

## 5. Storage prüfen

1. **Storage** öffnen.
2. Der Bucket `memories` wurde durch die Migration bereits angelegt.
3. Prüfen: **Public bucket** muss deaktiviert sein, Dateigröße maximal 8 MB.
4. Den Bucket nicht manuell öffentlich schalten. Öffentliche Bilder werden über eine RLS-geprüfte, zeitlich begrenzte Signed URL angezeigt.

## 6. Philipp anlegen

1. **Authentication → Users → Add user → Create new user** öffnen.
2. Philipps E-Mail und ein initiales starkes Passwort eintragen.
3. **Auto Confirm User** aktivieren, falls keine Bestätigungs-E-Mail verwendet werden soll.
4. User erstellen und die angezeigte **User UID** kopieren.

## 7. Justine anlegen

Die gleichen Schritte mit Justines eigener E-Mail und eigenem Passwort durchführen und ihre **User UID** kopieren. Es gibt bewusst keine Registrierung in der App.

## 8. Profile auf Owner setzen

1. `supabase/OWNER_SETUP.sql` öffnen.
2. `PHILIPP_AUTH_USER_UUID` und `JUSTINE_AUTH_USER_UUID` durch die kopierten UUIDs ersetzen.
3. Das Skript im Supabase **SQL Editor** ausführen.
4. Das abschließende `select` muss beide Profile mit `role = owner` zeigen.

Die App entscheidet ausschließlich über `profiles.role`, niemals über eine hardcodierte E-Mail-Adresse.

## 9. Lokal testen

```bash
npm install
npm run dev
```

1. Die Startseite in einem privaten Browserfenster als Gast öffnen.
2. Prüfen, dass keine Bearbeitungsaktionen, Packliste oder Ausgaben sichtbar sind.
3. Unter **Mehr → Login** als Philipp oder Justine anmelden.
4. Eine private Sichtung speichern und prüfen, dass sie nach Neuladen für den Owner vorhanden, im privaten Browserfenster aber unsichtbar ist.
5. Danach öffentlich schalten und die Gastansicht erneut laden.
6. Eine Erinnerung mit Foto testen und anschließend löschen.

## 10. Production-Variablen setzen

Bei Vercel oder Netlify in den Projekteinstellungen unter **Environment Variables** dieselben beiden Variablen eintragen:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Für Production, Preview und gewünschte lokale Deploy-Umgebungen aktivieren. Niemals `SUPABASE_SERVICE_ROLE_KEY` im Frontend-Deployment hinterlegen.

## 11. Auth-URLs konfigurieren

Unter **Authentication → URL Configuration**:

1. **Site URL** auf die öffentliche Production-URL setzen.
2. Lokale und Preview-URLs nur bei Bedarf unter **Redirect URLs** ergänzen.
3. Da nur E-Mail/Passwort ohne OAuth verwendet wird, benötigt der normale Login keine Weiterleitung.

## 12. Deployment prüfen

1. Neu deployen und die Production-URL ohne Login öffnen.
2. Guest-Abfragen, Login, CRUD, Foto-Upload und Logout testen.
3. Im Browser-Netzwerk prüfen, dass keine `expenses`, `packing_items` oder privaten Records als Gast zurückgegeben werden.
4. Offline-Modus über die Browser-DevTools testen: App-Shell startet; Schreibaktionen werden verständlich blockiert.

## Sicherheitsmodell

- `anon`: alle Reiseinhalte und zugehörigen Erinnerungsbilder lesbar; keine Schreibrechte.
- `authenticated owner`: Zugriff nur, wenn das eigene Profil `role = owner` besitzt.
- Expenses und Packliste: ausschließlich Owner-Policies, niemals öffentliche Select-Policy.
- Profile: nur das eigene Profil oder durch einen Owner lesbar; keine Client-Policy zum Erzeugen von Rollen.
- Fotos: privater Bucket; Gäste erhalten Zugriff nur, wenn ein öffentliches Memory auf den Objektpfad verweist.
