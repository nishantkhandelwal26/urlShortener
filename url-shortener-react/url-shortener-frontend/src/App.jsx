import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./AppRouter";
import { StoreProvider } from "./contextApi/ContextApi";
import "./App.css";

function App() {
  return (
    <StoreProvider>
      <Router>
        <div className="App">
          <AppRouter />
        </div>
      </Router>
    </StoreProvider>
  );
}

export default App;
