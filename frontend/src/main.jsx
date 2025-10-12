import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StationsProvider } from "./context/StationsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StationsProvider>
    <App />
  </StationsProvider>
);
