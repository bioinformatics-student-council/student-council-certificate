// Headless-Debugskript: erzeugt die Bescheinigung ohne Browser.
//
//   npm install          # einmalig, installiert jspdf + moment
//   node generate.js     # schreibt bescheinigung_debug.pdf
//
// Beispielwerte einfach unten in `data` anpassen.

const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const moment = require('moment');
require('moment/locale/de');            // deutsche Lokalisierung für Node laden

const buildCertificate = require('./js/certificate.js');

// --- Auto-ausgefüllte Testdaten -------------------------------------------
const data = {
  pronoun:    'er',                     // 'er' oder 'sie'
  fname:      'Maxi',
  lname:      'Mustermann',
  street:     'Musterstraße 1',
  zipCity:    '60325 Frankfurt am Main',
  bday:       '2000-01-15',             // YYYY-MM-DD
  smonth:     '2022-10-01',             // Beitrittsdatum
  active:     true,                     // weiterhin aktiv? -> emonth wird ignoriert
  emonth:     '2024-07-01',             // Enddatum (nur wenn active === false)
  customText: '',
  signature:  'Fachschaft Bioinformatik',
  examRole:   '',                       // leer lassen -> Default greift
  examChair:  'Marcel Schulz',          // optional; leer lassen für nur die Linie
  repShow:    true,                     // linke Unterschrift (Fachschaft) anzeigen?
  repRole:    '',                       // leer lassen -> Default "Fachschaftsvertretung"
  repName:    ''                        // optional; leer lassen für nur die Linie
};
// --------------------------------------------------------------------------

// Logo als Base64-Data-URL einlesen (jsPDF.addImage akzeptiert das in Node)
const logoPath = path.join(__dirname, 'img', 'bioinf_fs_logo_lila.png');
const logo = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');

const doc = buildCertificate({ jsPDF, moment, data, logo });

const outPath = path.join(__dirname, 'bescheinigung_debug.pdf');
fs.writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')));
console.log('PDF geschrieben:', outPath);
