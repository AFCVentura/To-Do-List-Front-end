import { useContext } from "react";
import { TokenContext } from "../contexts/TokenContext";

const useTokenContext = () => {
  const tokenContext = useContext(TokenContext);

  if (!tokenContext) {
    console.log("Nenhum token encontrado");
  }

  return context;

};

export default useTokenContext;
