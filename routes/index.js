const express = require("express");
const router = express.Router();
const axios = require("axios");

const config = {
  proxy: {
    host: "localhost",
    port: 4444,
  },
};

// Mostrar formulario de agregar
router.get("/photos/add", (req, res) => {
  res.render("fotos_formulario", { title: "Agregar Foto" });
});

// Guardar nueva foto

router.post("/photos/save", async function (req, res, next) {
  const { title, description, rate } = req.body;
  const URL = "http://localhost:4444/rest/fotos/save";
  const data = {
    titulo: title,
    descripcion: description,
    calificacion: rate,
    ruta: "",
  };

  const response = await axios.post(URL, data, config);
  if (response.status == "201" && response.statusText == "Created") {
    res.redirect("/photos");
  } else {
    res.redirect("/");
  }
});

// Mostrar todas las fotos
router.get("/photos", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:4444/rest/fotos/findAll/json"
    );
    res.render("vista_fotos", {
      title: "Listado de Fotos",
      arrFotos: response.data,
    });
  } catch (error) {
    console.error(error.message);
    res.render("error", { message: "No se pudieron cargar las fotos" });
  }
});

// Mostrar formulario de ediciion
router.get("/photos/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.get(
      `http://localhost:4444/rest/fotos/findById/${id}/json`
    );
    res.render("fotos_editar", { title: "Editar Foto", foto: response.data });
  } catch (error) {
    console.error(error.message);
    res.redirect("/photos");
  }
});

// Actualizar foto
router.post("/photos/update", async (req, res) => {
  const { id, title, description, rate } = req.body;
  const data = {
    id,
    titulo: title,
    descripcion: description,
    calificacion: rate,
    ruta: "",
  };

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
