const { Document, Export } = require("../models");

async function exportPdf(req, res) {
  try {
    const { documentId } = req.body;
    const doc = await Document.findByPk(documentId);
    if (!doc || doc.userId !== req.user.id) {
      return res.status(403).send({ success: false, message: "Unauthorized" });
    }

    // TODO: Integrate Puppeteer or PDF generation library
    const fileUrl = `http://localhost:4000/exports/doc_${documentId}.pdf`;
    
    // Save record to DB
    const exportRecord = await Export.create({
      documentId,
      format: "pdf",
      fileUrl
    });

    res.send({ success: true, message: "PDF Exported", export: exportRecord });
  } catch (error) {
    console.log("error exporting pdf:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

module.exports = { exportPdf };