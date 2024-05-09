import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/layout.css";
import { ChakraProvider } from "@chakra-ui/react";
import ContextContainer from "./components/ReactContexts/contextContainer.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <ContextContainer>
        <App />
      </ContextContainer>
    </ChakraProvider>
  </React.StrictMode>
);
