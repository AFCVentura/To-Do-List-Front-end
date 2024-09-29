import { createContext, useReducer, useState } from "react";

// O context em si para armazenar o token
export const TokenContext = createContext();

// O provedor desse context
export const TokenContextProvider = ({ children }) => {
  // Função que verifica o que deve ser feito.
  const tokenReducer = (state, action) => {
    // switch-case
    switch (action.type) {
      case "ADD":
        return (state = action.token);
      case "DELETE":
        return (state = "");
      case "GET":
        return state;
    }
  };

  const [token, dispatchToken] = useReducer(tokenReducer, "");

  return (
    <TokenContext.Provider value={{ token, dispatchToken }}>
      {children}
    </TokenContext.Provider>
  );
};
