import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CatalogoLibros.css";

function CatalogoLibros({ onAgregar }) {
  const navigate = useNavigate();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  // 🎨 Colores según categoría
  const coloresCategorias = {
    "📖 Clásicos": "#e63946",
    "👦 Literatura infantil": "#007bff",
    "🧛‍♀️ Juvenil / Fantasía": "#ffd700",
  };

  // 📚 Libros organizados por categoría
  const categorias = [
    {
      nombre: "📖 Clásicos",
      slug: "cat-clasicos",
      libros: [
        { id: 1, titulo: "Don Quijote de la Mancha", precio: 90, imagen: "/img/libros/donquijotedelamancha.jpg" },
        { id: 3, titulo: "La Odisea", precio: 150, imagen: "/img/libros/laodisea.jpg" },
        { id: 7, titulo: "El Diario de Ana Frank", precio: 140, imagen: "/img/libros/eldiariodeanafrank.jpg" },
      ],
    },
    {
      nombre: "👦 Literatura infantil",
      slug: "cat-infantil",
      libros: [
        { id: 2, titulo: "El Principito", precio: 70, imagen: "/img/libros/elprincipito.jpg" },
        { id: 4, titulo: "Matilda", precio: 180, imagen: "/img/libros/matilda.jpg" },
        { id: 5, titulo: "Hansel y Gretel", precio: 110, imagen: "/img/libros/hanselygretel.jpg" },
        { id: 6, titulo: "Caperucita Roja", precio: 85, imagen: "/img/libros/caperucitaroja.jpg" },
        { id: 8, titulo: "El Patito Feo", precio: 60, imagen: "/img/libros/elpatitofeo.jpg" },
        { id: 9, titulo: "Pinocho", precio: 90, imagen: "/img/libros/pinocho.jpg" },
      ],
    },
    {
      nombre: "🧛‍♀️ Juvenil / Fantasía",
      slug: "cat-juvenil",
      libros: [
        { id: 10, titulo: "Crepúsculo", precio: 120, imagen: "/img/libros/crepusculo.jpg" },
      ],
    },
  ];

  // 🔍 Filtro dinámico
  const categoriasDisponibles = ["Todas", ...categorias.map((cat) => cat.nombre)];
  const categoriasFiltradas =
    categoriaSeleccionada === "Todas"
      ? categorias
      : categorias.filter((cat) => cat.nombre === categoriaSeleccionada);

  return (
    <div className="catalogo-container">
      {/* === FILTRO === */}
      <div className="filtro-categorias">
        <label htmlFor="filtroCat">Filtrar por categoría: </label>
        <select
          id="filtroCat"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          {categoriasDisponibles.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      {/* === CATÁLOGO === */}
      {categoriasFiltradas.map((categoria) => (
        <div key={categoria.slug} className={`bloque-categoria ${categoria.slug}`}>
          <h2>{categoria.nombre}</h2>

          <div className="catalogo-grid">
            {categoria.libros.map((libro) => (
              <div
                key={libro.id}
                className="libro-card"
                onClick={() => setLibroSeleccionado(libro.id)}
                style={{
                  border:
                    libroSeleccionado === libro.id
                      ? `4px solid ${coloresCategorias[categoria.nombre]}`
                      : "3px solid transparent",
                }}
              >
                <img src={libro.imagen} alt={libro.titulo} />
                <h3>{libro.titulo}</h3>
                <p>Precio: Q{libro.precio}</p>
                <button onClick={() => onAgregar(libro)}>🛒 Agregar</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Botón de pedidos */}
      <div className="ver-pedidos-container">
        <button className="btn-pedidos" onClick={() => navigate("/pedidos")}>
          📋 Ver Detalle de Pedidos
        </button>
      </div>
    </div>
  );
}

export default CatalogoLibros;
