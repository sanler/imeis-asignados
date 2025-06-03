import React, { useState } from 'react';
import MensajeEstado from './MensajeEstado';
import './Pantalla.css';

const Pantalla = () => {
  const [mensajeCopia, setMensajeCopia] = useState('');
  const [estadoCopia, setEstadoCopia] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState('');
  const [resultados, setResultados] = useState([]);

  const [noEncontrados, setNoEncontrados] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [opcionElegida, setOpcionElegida] = useState('');
  const [numeroInicio, setNumeroInicio] = useState('');
  const [nombreArticulo, setNombreArticulo] = useState('');
  const [historial, setHistorial] = useState([]);

  const procesarTodo = async () => {
    setEstado('procesando');
    setMensaje('Buscando códigos en IMEIS.xlsx...');
    setHistorial([]);
    setOpcionElegida('');
    setNumeroInicio('');
    setNombreArticulo('');
    try {
      const responseCopia = await fetch('http://localhost:3001/copiaSeguridad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const dataCopia = await responseCopia.json();

      if (!dataCopia.estado) {
        setEstadoCopia('error');
        setMensajeCopia(dataCopia.mensaje || 'No se pudo crear la copia de seguridad.');
        return;
      }

      setEstadoCopia('success');
      setMensajeCopia(dataCopia.mensaje);

      const responseBuscar = await fetch('http://localhost:3001/buscarCodigos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const dataBuscar = await responseBuscar.json();

      if (!dataBuscar.estado) {
        setEstado('error');
        setMensaje(dataBuscar.mensaje || 'Error al buscar los códigos.');
        return;
      }

      setEstado('success');
      setMensaje(dataBuscar.mensaje);

      const resultadosArray = Array.isArray(dataBuscar.resultados) ? dataBuscar.resultados : [];
      setResultados(resultadosArray);

      const noEncontradosArray = resultadosArray.filter(r => !r.encontrado);
      setNoEncontrados(noEncontradosArray);
      setIndiceActual(0);
    } catch (error) {
      console.error('Error en fetch:', error);
      setEstado('error');
      setMensaje('Error al conectar con el servidor.');
    }
  };

  const manejarSeleccion = (e) => {
    e.preventDefault();
    const seleccion = e.target.opcion.value;
    setOpcionElegida(seleccion);
    if (seleccion === 'A') {
      setNumeroInicio(''); // Esperar input del usuario
    } else if (seleccion === 'B') {
      setNombreArticulo(''); // Esperar input del usuario
    }
  };

  const procesarOpcionA = async () => {
    const codigoActual = noEncontrados[indiceActual].codigo;
    const numeroInsertado = noEncontrados[indiceActual].numeroInsertado;
    const textoInsertado = noEncontrados[indiceActual].textoInsertado;

    if (!numeroInicio) return alert("Introduce el número de inicio.");

    try {
      const response = await fetch('http://localhost:3001/procesarA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigoActual, numeroInicio, numeroInsertado, textoInsertado })
      });

      const data = await response.json();
      console.log('Respuesta opción A:', data);
    } catch (error) {
      console.error('Error al procesar opción A:', error);
    }

    avanzarProceso('A', codigoActual, numeroInsertado);
  };

  const procesarOpcionB = async () => {
    const codigoActual = noEncontrados[indiceActual].codigo;
    const numeroInsertado = noEncontrados[indiceActual].numeroInsertado;
    const textoInsertado = noEncontrados[indiceActual].textoInsertado;
    
    if (!nombreArticulo) return alert("Introduce el nombre del artículo.");

    try {
      const response = await fetch('http://localhost:3001/procesarB', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigoActual, nombreArticulo, numeroInsertado, textoInsertado })
      });

      const data = await response.json();
      console.log('Respuesta opción B:', data);
    } catch (error) {
      console.error('Error al procesar opción B:', error);
    }

    avanzarProceso('B', codigoActual, numeroInsertado);
  };

  const avanzarProceso = (opcion, codigo, numeroInsertado) => {
    setHistorial((prev) => [...prev, { codigo, opcion, numeroInsertado }]);
    setTimeout(() => {
      setIndiceActual((prev) => prev + 1);
      setOpcionElegida('');
      setNumeroInicio('');
      setNombreArticulo('');
    }, 1000);
  };

  return (
    <div className="pantalla-contenedor">
      <h1>📁 Gestor de IMEIs</h1>

      <button
        onClick={procesarTodo}
        disabled={estado === 'procesando'}
        className={`boton ${estado === 'procesando' ? 'deshabilitado' : ''}`}
      >
        {estado === 'procesando' ? 'Procesando...' : 'Crear copia y buscar códigos'}
      </button>

      {mensajeCopia && <MensajeEstado mensaje={mensajeCopia} estado={estadoCopia} />}
      <MensajeEstado mensaje={mensaje} estado={estado} />

      {resultados.length > 0 && (
        <div className="resultados">
          <h2>🔍 Resultado de búsqueda en IMEIS.xlsx:</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Estado</th>
                <th>IMEIS</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r, i) => (
                <tr key={i}>
                  <td>{r.codigo}</td>
                  <td style={{ color: r.encontrado ? 'green' : 'red' }}>
                    {r.encontrado ? 'Encontrado ✅' : 'No encontrado ❌'}
                  </td>
                  <td>{r.imeisCreados.length} Imeis creados.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {noEncontrados.length > 0 && indiceActual < noEncontrados.length && (
        <div className="no-encontrados">
          <h2>🛠️ Gestión de IMEIS no encontrados</h2>
          <h3>Comprobar en aplicación IMEI</h3>
          <p><strong>Código:</strong> {noEncontrados[indiceActual].codigo}</p>

          {!opcionElegida && (
            <form onSubmit={manejarSeleccion}>
              <label>
                Selecciona una opción:
                <select name="opcion" required>
                  <option value="">--Selecciona--</option>
                  <option value="A">Opción A (rango conocido)</option>
                  <option value="B">Opción B (nuevo rango)</option>
                </select>
              </label>
              <button type="submit">Confirmar opción</button>
            </form>
          )}

          {opcionElegida === 'A' && (
            <form onSubmit={(e) => { e.preventDefault(); procesarOpcionA(); }}>
              <label>
                Introduce el número inicial del rango:
                <input
                  type="text"
                  value={numeroInicio}
                  onChange={(e) => setNumeroInicio(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Procesar opción A</button>
            </form>
          )}

          {opcionElegida === 'B' && (
            <p>Procesando opción B...</p>
          )}

          {opcionElegida === 'B' && (
            <form onSubmit={(e) => { e.preventDefault(); procesarOpcionB(); }}>
              <label>
                Introduce el nombre del artículo:
                <input
                  type="text"
                  value={nombreArticulo}
                  onChange={(e) => setNombreArticulo(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Procesar opción B</button>
            </form>
          )}

        </div>
      )}

      {indiceActual >= noEncontrados.length && noEncontrados.length > 0 && (
        <div className="finalizado">
          <h3>🎉 Has terminado de gestionar todos los códigos no encontrados.</h3>
        </div>
      )}

      {historial.length > 0 && (
        <div className="historial-elecciones">
          <h2>📝 Historial de opciones elegidas:</h2>
          <ul>
            {historial.map((el, index) => (
              <li key={index}>
                Código <strong>{el.codigo}</strong> → opción <strong>{el.opcion}</strong> {el.numeroInsertado} Imeis creados.
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Pantalla;
