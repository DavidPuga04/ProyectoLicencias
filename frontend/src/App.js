import React, { useState, useEffect } from 'react';
import Login from './Login'; // Importamos el componente que creaste

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [paso, setPaso] = useState(1);
  const [archivo, setArchivo] = useState(null);

  // Al cargar la app, revisamos si el usuario ya estaba logueado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    setPaso(1); // Reiniciamos al paso 1 por seguridad
  };

  // Funciones de tu CRUD original
  const handleSubirArchivo = (e) => setArchivo(e.target.files[0]);
  const handleEliminarArchivo = () => setArchivo(null);

  // SI NO ESTÁ AUTENTICADO: Mostrar pantalla de Login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // SI ESTÁ AUTENTICADO: Mostrar tu interfaz de pasos
  return (
    <div className="container" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Sistema de Licencias ANT</h1>
        <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>
      
      <hr />

      {/* Paso 1: Carga de Documentos (Tu lógica original) */}
      {paso === 1 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Paso 1: Sube tu Cédula Escaneada (PDF)</h2>
          <input type="file" accept="application/pdf" onChange={handleSubirArchivo} />
          
          {archivo && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
              <p>📄 Archivo listo para enviar: <strong>{archivo.name}</strong></p>
              <button onClick={handleEliminarArchivo} style={{ color: 'red' }}>Eliminar Archivo</button>
            </div>
          )}
        </div>
      )}

      {/* Aquí puedes añadir el Paso 2, 3, etc. */}
      {paso === 2 && (
        <div>
          <h2>Paso 2: Revisión de datos</h2>
          <p>Aquí se mostrará la previsualización del trámite.</p>
        </div>
      )}

      {/* Botones de Navegación */}
      <div className="navigation" style={{ marginTop: '30px' }}>
        <button 
          onClick={() => setPaso(paso - 1)} 
          disabled={paso === 1}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Anterior
        </button>
        <button 
          onClick={() => setPaso(paso + 1)}
          style={{ padding: '10px 20px' }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default App;