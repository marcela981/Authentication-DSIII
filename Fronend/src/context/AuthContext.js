import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../firebase/firebaseConfig';

const AuthContext = createContext();

// Hook para acceder al contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) { // Proveedor de autenticación
  const [currentUser, setCurrentUser] = useState(null); // Estado para el usuario actual
  const [loading, setLoading] = useState(true); // Estado para el manejo de carga

  useEffect(() => { // Efecto para manejar el cambio de usuario
    const auth = getAuth(app); // Inicializa la autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => { // Maneja el cambio de usuario
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser };

  return (
    <AuthContext.Provider value={value}> // Proveedor de contexto de autenticación
      {!loading && children} // Renderiza los hijos si no hay carga
    </AuthContext.Provider>
  );
}
