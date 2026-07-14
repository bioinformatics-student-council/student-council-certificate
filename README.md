# Bescheinigungsgenerator Fachschaft Bioinformatik

Erzeugt Mitarbeits-Bescheinigungen als PDF – direkt im Browser, ohne Server.

**Live:** https://bioinformatics-student-council.github.io/student-council-certificate/

## PDF zum Debuggen generieren (ohne Browser)

Für schnelles Testen der PDF-Erzeugung gibt es ein Headless-Skript
([generate.js](generate.js)), das dieselbe Logik wie die Website nutzt
([js/certificate.js](js/certificate.js)) und das PDF direkt als Datei schreibt.

```bash
npm install        # einmalig: installiert jspdf + moment
node generate.js   # schreibt bescheinigung_debug.pdf
```

Danach `bescheinigung_debug.pdf` öffnen und das Ergebnis prüfen.

**Testdaten anpassen:** Die Werte für das PDF stehen im `data`-Objekt oben in
[generate.js](generate.js). Einfach dort ändern und `node generate.js` erneut
ausführen.

## Deployment

Die Seite wird über **GitHub Pages** aus dem `master`-Branch ausgeliefert.
Ein `git push` genügt – GitHub baut die Seite automatisch neu.

## Credits

- Ursprüngliche Version von **Adrian Romberg**
  ([aromberg/student-council-certificate](https://github.com/aromberg/student-council-certificate)).

Lizenz: siehe [LICENSE](LICENSE).
