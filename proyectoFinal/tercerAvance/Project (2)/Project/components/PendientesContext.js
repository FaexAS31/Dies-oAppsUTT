/** @format */

// PendientesContext.js

import React, { createContext, useState, useContext } from "react";

const PendientesContext = createContext();

export const PendientesProvider = ({ children }) => {
  const [totalPendientes, setTotalPendientes] = useState(0);

  return (
    <PendientesContext.Provider value={{ totalPendientes, setTotalPendientes }}>
      {children}
    </PendientesContext.Provider>
  );
};

export const usePendientes = () => useContext(PendientesContext);
