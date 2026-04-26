import React, { useState, useEffect } from 'react';
import Login from './Login';
import axios from 'axios'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sedesMonitoreo, setSedesMonitoreo] = useState([]); // Nuevo estado para la tabla
  
  const [tramiteId, setTramiteId] = useState(null);
  const [archivos, setArchivos] = useState({
    cedula: null,
    sangre: null,
    psico: null
  });

  const [recomendacion, setRecomendacion] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  // Cargar sedes reales cuando se llega al Paso 4
  useEffect(() => {
    if (paso === 4) {
      axios.get('http://127.0.0.1:8000/api/tramites/listar_monitoreo/')
        .then(res => setSedesMonitoreo(res.data))
        .catch(err => console.error("Error al cargar sedes:", err));
    }
  }, [paso]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setPaso(1);
  };

  const subirArchivoAlBack = async (tipo) => {
    setLoading(true);
    const formData = new FormData();
    if (tipo === 'cedula') formData.append('archivo_cedula', archivos.cedula);
    if (tipo === 'sangre') formData.append('archivo_sangre', archivos.sangre);
    if (tipo === 'psico') formData.append('archivo_psico', archivos.psico);
    
    formData.append('cedula_numero', '1733332332'); 
    formData.append('paso_actual', paso + 1);

    try {
      const url = tramiteId 
        ? `http://127.0.0.1:8000/api/tramites/${tramiteId}/` 
        : `http://127.0.0.1:8000/api/tramites/`;
      const method = tramiteId ? 'patch' : 'post';
      
      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setTramiteId(response.data.id);
      setPaso(paso + 1);
    } catch (error) {
      alert("Error al subir archivo.");
    } finally {
      setLoading(false);
    }
  };

  const obtenerRecomendacionInteligente = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tramites/${tramiteId}/recomendar_sucursal/`);
      setRecomendacion(response.data);
      setPaso(5);
    } catch (error) {
      alert("Error en el CORE.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;

  return (
    <div className="container" style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Segoe UI' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee' }}>
        <h2>ANT - Gestión de Licencias</h2>
        <button onClick={handleLogout} style={{ color: 'red', cursor: 'pointer' }}>Cerrar Sesión</button>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ color: paso >= i ? '#007bff' : '#ccc', fontWeight: 'bold' }}>
            {i === 5 ? '🎯' : `Paso ${i}`}
          </div>
        ))}
      </div>

      <main style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', minHeight: '300px' }}>
        
        {paso <= 3 && (
          <div>
            <h3>Paso {paso}: Subir {paso === 1 ? 'Escaneo de Cédula' : paso === 2 ? 'Escaneo del Certificado Sangre' : 'Examen Psicosensométrico'}</h3>
            <input type="file" onChange={(e) => {
              const file = e.target.files[0];
              if (paso === 1) setArchivos({...archivos, cedula: file});
              if (paso === 2) setArchivos({...archivos, sangre: file});
              if (paso === 3) setArchivos({...archivos, psico: file});
            }} />
            <button onClick={() => subirArchivoAlBack(paso === 1 ? 'cedula' : paso === 2 ? 'sangre' : 'psico')} disabled={loading}>
              {loading ? 'Subiendo...' : 'Siguiente'}
            </button>
          </div>
        )}

        {paso === 4 && (
          <div style={{ textAlign: 'center' }}>
            <h3>Paso 4: Pago y Procesamiento Inteligente</h3>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
              <p style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Documentación validada.</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '8px' }}>Sucursal</th>
                    <th style={{ padding: '8px' }}>Estado</th>
                    <th style={{ padding: '8px' }}>Espera</th>
                  </tr>
                </thead>
                <tbody>
                  {sedesMonitoreo.map((s, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}>{s.nombre}</td>
                      <td style={{ padding: '8px', color: s.estado === 'BAJA' ? 'green' : 'red', fontWeight: 'bold' }}>{s.estado}</td>
                      <td style={{ padding: '8px' }}>{s.espera}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button style={{ padding: '15px', background: 'green', color: 'white', borderRadius: '5px', cursor: 'pointer' }} onClick={obtenerRecomendacionInteligente}>
              Pagar y Ver Recomendación
            </button>
          </div>
        )}

        {paso === 5 && recomendacion && (
          <div style={{ padding: '20px', border: '2px solid #007bff', background: '#fff', borderRadius: '10px', textAlign: 'center' }}>
            <h2 style={{ color: '#007bff' }}>🎫 Ticket Inteligente</h2>
            <p>Te recomendamos asistir a la sucursal de:</p>
            <div style={{ fontSize: '1.4em', margin: '20px 0', background: '#e7f3ff', padding: '15px' }}>
              📍 <strong>{recomendacion.sucursal}</strong><br />
              🕒 Espera: <strong>{recomendacion.tiempo_espera} min</strong>
            </div>
            <p style={{ color: 'green', fontWeight: 'bold' }}>✨ ¡Ahorraste {recomendacion.ahorro_estimado} min!</p>
            <button onClick={() => window.print()}>Imprimir</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;