const { jsPDF } = window.jspdf;

document.getElementById('emonth').value = moment().format("YYYY-MM");

document.getElementById('active').onchange = function() {
  document.getElementById('emonth').disabled = this.checked;
  document.getElementById('emonth').value = moment().format("YYYY-MM");
};

function downloadPDF() {
    // Read form inputs from the DOM
    const data = {
        pronoun:    document.getElementById('pronoun').value,
        fname:      document.getElementById('fname').value,
        lname:      document.getElementById('lname').value,
        street:     document.getElementById('street').value,
        zipCity:    document.getElementById('zipCity').value,
        bday:       document.getElementById('bday').value,
        smonth:     document.getElementById('smonth').value,
        active:     document.getElementById('active').checked,
        emonth:     document.getElementById('emonth').value,
        customText: document.getElementById('customText').value,
        signature:  document.getElementById('signature').value,
        examChair:  document.getElementById('examChair').value,
        examRole:   document.getElementById('examRole').value,
        repShow:    document.getElementById('repShow').checked,
        repRole:    document.getElementById('repRole').value,
        repName:    document.getElementById('repName').value
    };

    // Logo (browser: an <img> element that jsPDF.addImage accepts directly)
    const logo = new Image();
    logo.src = 'img/bioinf_fs_logo_lila.png';

    const doc = buildCertificate({ jsPDF, moment, data, logo });
    doc.save("bescheinigung_fachschaft_bioinformatik.pdf");
}
