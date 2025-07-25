const express = require("express");
const router = express.Router();
const axios = require("axios");

// Mostrar formulario de agregar
router.get("/photos/add", (req, res) => {
  res.render("fotos_formulario", { title: "Agregar Foto" });
});

// Guardar nueva foto
router.post("/photos/save", async (req, res) => {
  const { title, description, rate } = req.body;
  const data = { titulo: title, descripcion: description, calificacion: rate, ruta: "" };

  try {
    const response = await axios.post("http://localhost:4444/rest/fotos/save", data);
    if (response.status === 201) {
      res.redirect("/photos");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error al guardar:", error.message);
    res.redirect("/");
  }
});

// Mostrar todas las fotos
router.get("/photos", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:4444/rest/fotos/findAll/json");
    res.render("fotos_lista", { title: "Listado de Fotos", arrFotos: response.data });
  } catch (error) {
    console.error(error.message);
    res.render("error", { message: "No se pudieron cargar las fotos" });
  }
});

// Mostrar detalle por ID
router.get("/photos/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.get(`http://localhost:4444/rest/fotos/findById/json/${id}`);
    res.render("foto_detalle", { title: "Detalle de Foto", foto: response.data });
  } catch (error) {
    console.error(error.message);
    res.redirect("/photos");
  }
});

// Mostrar formulario de ediciÃ³n
router.get("/photos/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.get(`http://localhost:4444/rest/fotos/findById/json/${id}`);
    res.render("fotos_editar", { title: "Editar Foto", foto: response.data });
  } catch (error) {
    console.error(error.message);
    res.redirect("/photos");
  }
});

// Actualizar foto
router.post("/photos/update", async (req, res) => {
  const { id, title, description, rate } = req.body;
  const data = { id, titulo: title, descripcion: description, calificacion: rate, ruta: "" };

  try {
    await axios.put("http://localhost:4444/rest/fotos/update", data);
    res.redirect("/photos");
  } catch (error) {
    console.error(error.message);
    res.redirect("/photos");
  }
});

// Eliminar foto
router.get("/photos/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await axios.delete(`http://localhost:4444/rest/fotos/delete/${id}`);
    res.redirect("/photos");
  } catch (error) {
    console.error(error.message);
    res.redirect("/photos");
  }
});

module.exports = router;