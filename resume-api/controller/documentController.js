const { Document } = require("../models");

async function list(req, res) {
  try {
    const documents = await Document.findAll({ where: { userId: req.user.id } });
    res.send({
      success: true,
      message: "Retrieved the list of documents.",
      documents: documents,
    });
  } catch (error) {
    console.log("error in list", error);
    res.status(500).send({
      success: false,
      message: "Failed to retrieve the list of documents.",
    });
  }
}

async function create(req, res) {
  try {
    const document = req.body;
    // Force the document to belong to the logged-in user
    document.userId = req.user.id;
    const created = await Document.create(document);
    res.status(201).send({
      success: true,
      message: "Document created.",
      document: created,
    });
  } catch (error) {
    console.log("error in create", error);
    res.status(500).send({
      success: false,
      message: "Failed to create document.",
    });
  }
}

async function findOne(req, res) {
  try {
    const id = req.params.id;
    const document = await Document.findOne({ where: { id: id, userId: req.user.id } });
    if (!document) {
      return res.status(404).send({
        success: false,
        message: "Document not found.",
      });
    }
    res.send({
      success: true,
      message: "Retrieved the document.",
      document,
    });
  } catch (error) {
    console.log("error in findOne", error);
    res.status(500).send({
      success: false,
      message: "Failed to retrieve the document.",
    });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const document = await Document.findOne({ where: { id: id, userId: req.user.id } });
    if (!document) {
      return res.status(404).send({
        success: false,
        message: "Document not found.",
      });
    }
    await document.update(req.body);
    res.send({
      success: true,
      message: "Document updated.",
      document,
    });
  } catch (error) {
    console.log("error in update", error);
    res.status(500).send({
      success: false,
      message: "Failed to update document.",
    });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    const document = await Document.findOne({ where: { id: id, userId: req.user.id } });
    if (!document) {
      return res.status(404).send({
        success: false,
        message: "Document not found.",
      });
    }
    await document.destroy();
    res.status(204).send();
  } catch (error) {
    console.log("error in remove", error);
    res.status(500).send({
      success: false,
      message: "Failed to remove document.",
    });
  }
}

async function duplicate(req, res) {
  try {
    const id = req.params.id;
    const document = await Document.findOne({ where: { id: id, userId: req.user.id } });
    if (!document) {
      return res.status(404).send({
        success: false,
        message: "Document not found.",
      });
    }
    const copy = {
      title: document.title + " (Copy)",
      type: document.type,
      userId: req.user.id,
      templateId: document.templateId,
    };
    const createdCopy = await Document.create(copy);
    res.status(201).send({
      success: true,
      message: "Document duplicated.",
      document: createdCopy,
    });
  } catch (error) {
    console.log("error in duplicate", error);
    res.status(500).send({
      success: false,
      message: "Failed to duplicate document.",
    });
  }
}

async function importDocument(req, res) {
  try {
    const document = req.body;
    const created = await Document.create(document);
    res.status(201).send({
      success: true,
      message: "Document imported.",
      document: created,
    });
  } catch (error) {
    console.log("error in importDocument", error);
    res.status(500).send({
      success: false,
      message: "Failed to import document.",
    });
  }
}

module.exports = {
  list,
  create,
  findOne,
  update,
  remove,
  duplicate,
  importDocument,
};