import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.usuario));
      navigate("/pedidos");
    } catch {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div style={styles.container}>
      {/* COLUMNA DE BRANDING */}
      <div style={styles.leftSide}>
        <div style={styles.brandBox}>
          <h1 style={styles.brand}>Librería Asistente Virtual</h1>
          <p style={styles.slogan}>
            Sistema de gestión de pedidos y mensajería
          </p>
        </div>
      </div>

      {/* COLUMNA DEL FORM */}
      <div style={styles.rightSide}>
        <div style={styles.card}>
          <h2 style={styles.title}>Bienvenido</h2>
          <p style={styles.subtitle}>Inicia sesión con tus credenciales</p>

          {error && <div style={styles.error}>{error}</div>}

          <form style={styles.form} onSubmit={iniciarSesion}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            <button style={styles.button}>Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 🎨 ESTILOS SUPER PROFESIONALES
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    background: "#f0f4f5",
  },

  /* LEFT SIDE */
  leftSide: {
    flex: 1.1,
    background: "linear-gradient(135deg, #A3D2D5 0%, #6AA5A9 50%, #3F7856 100%)",
    display: "flex",
    alignItems: "center",
    paddingLeft: "80px",
    color: "white",
  },

  brandBox: {
    width: "80%",
    maxWidth: 450,
  },

  brand: {
    fontSize: "48px",
    fontWeight: 800,
    lineHeight: "1.1",
    marginBottom: "14px",
    letterSpacing: "1px",
  },

  slogan: {
    fontSize: "20px",
    opacity: 0.85,
  },

  /* RIGHT SIDE */
  rightSide: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "420px",
    padding: "45px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.32)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 15px 45px rgba(0,0,0,0.18)",
    animation: "fadeIn 0.7s ease",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "4px",
    color: "#1f2d36",
  },

  subtitle: {
    fontSize: "14px",
    color: "#3b4a52",
    marginBottom: "25px",
  },

  error: {
    background: "rgba(199,0,0,0.25)",
    padding: "12px",
    borderRadius: "10px",
    color: "#610000",
    marginBottom: "15px",
    fontSize: "14px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "14px",
    color: "#2e3a40",
    fontWeight: "600",
  },

  input: {
    padding: "14px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.65)",
    fontSize: "15px",
    transition: "0.2s ease",
  },

  button: {
    marginTop: "10px",
    padding: "14px",
    background: "#3F7856",
    borderRadius: "12px",
    border: "none",
    color: "white",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.25s",
  },
};

export default Login;
