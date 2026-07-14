// Environment-agnostic certificate builder.
// Shared by the browser (js/script.js) and the Node debug script (generate.js).
//
// Dependencies are injected so this file touches neither the DOM nor Node APIs:
//   jsPDF  - the jsPDF constructor
//   moment - the moment library (locale should already be set up by the caller)
//   data   - a plain object with all form values (see fields below)
//   logo   - anything jsPDF.addImage accepts (an <img> element in the browser,
//            or a base64 / data-URL string in Node)

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();          // Node / CommonJS
  } else {
    root.buildCertificate = factory();   // Browser global
  }
})(typeof self !== 'undefined' ? self : this, function () {

  function buildCertificate({ jsPDF, moment, data, logo }) {
    moment.locale('de-DE');

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });
    doc.setFont('Helvetica');

    const docWidth = doc.internal.pageSize.getWidth();

    const {
      pronoun, fname, lname, street, zipCity,
      bday, smonth, active, emonth, customText, signature, examChair
    } = data;

    // Role label under the signature line (defaults to the committee chair)
    const examRole = data.examRole || "Prüfungsausschussvorsitzende/r des gemeinsamen Prüfungsausschusses B.Sc. und M.Sc. Bioinformatik";

    // Fachschaft representative signature (left side), optional via checkbox
    const repShow = data.repShow !== false;           // default: shown
    const repRole = data.repRole || "Fachschaftsvertretung";
    const repName = data.repName || "";

    // Input-based phrases
    let introduction = `hiermit bestätigen wir, dass ${fname} ${lname}, geb. am ${moment(bday).format("L")}, sich `;
    let conclusion = `Wir danken ${fname} für ${pronoun == "sie" ? 'ihr' : 'sein'} Engagement und `;
    if (active) {
      introduction += `seit ${moment(smonth).format("MMMM YYYY")} ehrenamtlich in der Fachschaft des Studiengangs Bioinformatik an der Goethe-Universität Frankfurt am Main engagiert.`;
      conclusion += `freuen uns auf die weitere Zusammenarbeit!`;
    } else {
      introduction += `von ${moment(smonth).format("MMMM YYYY")} bis ${moment(emonth).format("MMMM YYYY")} ehrenamtlich in der Fachschaft des Studiengangs Bioinformatik an der Goethe-Universität Frankfurt am Main engagiert hat.`;
      conclusion += `wünschen ${pronoun == "sie" ? 'ihr' : 'ihm'} für ${pronoun == "sie" ? 'ihre' : 'seine'} Zukunft auch weiterhin alles Gute!`;
    }

    // Logo
    doc.addImage(logo, "PNG", docWidth - 45, 15, 30, 30);

    // Adress field
    doc.setFontSize(6);
    doc.text("Fachschaft Bioinformatik · Robert-Mayer-Straße 11-15 · 60325 Frankfurt am Main", 25, 39.7, { maxWidth: 85 });

    doc.setFontSize(11);
    doc.text([fname + " " + lname,
              street,
              zipCity],
             25, 44.7, { maxWidth: 85 });

    // Info block
    doc.setFontSize(11);
    doc.text(moment().format("L"),
             docWidth - 40, 72);

    // Folding marks
    doc.setLineWidth(0.1);
    doc.line(5, 87, 10, 87);
    doc.line(5, 192, 10, 192);

    // Title
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text("Bescheinigung über das ehrenamtliches Engagement im Rahmen der Fachschaft", 25, 100);

    // Membership period (uses today's date as end when still active)
    const startDate = moment(smonth);
    const endDate = active ? moment() : moment(emonth);
    const startFmt = startDate.format("MMMM YYYY");
    const endFmt = endDate.format("MMMM YYYY");
    const months = endDate.diff(startDate, 'months') + 1; // inkl. Start- und Endmonat
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Zeitraum: ${startFmt} – ${endFmt} (${months} ${months === 1 ? 'Monat' : 'Monate'})`, 25, 105);

    // Haupttext
    const orgDescription =
      "Die Fachschaft Bioinformatik ist eine Interessengemeinschaft und Organisation der studentischen Selbstverwaltung, die sich speziell an die Studierenden der Bioinformatik richtet und sich für deren Belange einsetzt.\n" +
      "Ihre Mitglieder engagieren sich hochschulpolitisch in verschiedenen Gremien und stehen im regen Austausch mit Dozierenden, der Administration, studentischen Gremien und weiteren Hochschulstellen. Ziel ist es, die Studienbedingungen zu verbessern, den Studierenden als Ansprechpartner zur Seite zu stehen und sie bei Problemen zu unterstützen.\n" +
      "Darüber hinaus organisiert die Fachschaft Veranstaltungen, um die Vernetzung unter den Studierenden sowie zwischen Studierenden und Dozierenden zu fördern und den Studiengang inhaltlich wie strukturell kontinuierlich weiterzuentwickeln.";

    doc.setFont('Helvetica', 'normal');
    doc.text(["",
              "Sehr geehrte Damen und Herren,",
              "",
              introduction,
              "",
              orgDescription,
              "",
              // customText + Leerzeile nur, wenn ein individueller Absatz vorhanden ist
              ...(customText.trim() ? [customText, ""] : []),
              conclusion,
              "",
              "Mit freundlichen Grüßen",
              signature],
             25, 108.92, { maxWidth: docWidth - 45 });

    // Signature blocks at the bottom: Fachschaft (left) and committee chair (right)
    const sigLineY = 255;
    const sigBlockWidth = 65;            // width of each signature line in mm
    doc.setLineWidth(0.2);
    doc.setFontSize(9);

    // Draws a signature line with the (wrapped) role above an optional name.
    // align "left"  -> text anchored at the left end of the line
    // align "right" -> text anchored at the right end of the line
    function drawSignatureBlock(lineStartX, align, role, name) {
      doc.line(lineStartX, sigLineY, lineStartX + sigBlockWidth, sigLineY);
      const anchorX = align === "right" ? lineStartX + sigBlockWidth : lineStartX;
      const lines = doc.splitTextToSize(role, sigBlockWidth + 10);
      if (name) lines.push(name);
      doc.text(lines, anchorX, sigLineY + 4, { align });
    }

    // Right: examination committee chair (always shown)
    drawSignatureBlock(docWidth - 25 - sigBlockWidth, "right", examRole, examChair);

    // Left: Fachschaft representative (optional)
    if (repShow) {
      drawSignatureBlock(25, "left", repRole, repName);
    }

    return doc;
  }

  return buildCertificate;
});
