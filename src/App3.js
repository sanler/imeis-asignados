import React, { useState, useEffect } from "react";

function App() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Aquí podemos disparar la petición de procesamiento directamente cuando el componente cargue
    async function procesarDatos() {
      try {
        const response = await fetch("http://localhost:3001/procesar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            opcion: "A", // Opción por defecto, se puede cambiar si es necesario
            primerNumero: "123456", // Ejemplo de primer número para opción A, puedes obtenerlo de otro modo
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setMensaje(data.mensaje);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Hubo un problema al procesar los datos.");
      }
    }

    procesarDatos();
  }, []);

  return (
    <div className="App">
      <h1>Procesar IMEIs</h1>
      {mensaje && <p>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
