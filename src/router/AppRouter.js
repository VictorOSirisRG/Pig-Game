import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import PasswordReset from "../components/PasswordReset/PasswordReset";
import Missing from "../components/NotFound/Missing";
import PrivateRoute from "./PrivateRoute";
import CentrosList from "../pages/List/CentrosList";
import VacunasList from "../pages/List/VacunasList";
import VacunadoresList from "../pages/List/VacunadoresList";
import UsuariosList from "../pages/List/UsuariosList";
import PacientesList from "../pages/List/PacientesList";
import VacunacionesList from "../pages/List/VacunacionesList";
import Perfil from "../pages/Perfil/Perfil";
import PublicRoute from "./PublicRoute";
import Logout from "../pages/Home/Logout";
import { ToastContainer } from "react-toastify";
import { getRole } from "../utils/common";
import "react-toastify/dist/ReactToastify.css";
export default function AppRouter() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/passwordReset" element={<PasswordReset />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route exact path="/" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/pacientes" element={<PacientesList />} />
          <Route path="/vacunaciones" element={<VacunacionesList />} />
          <Route path="/vacunadores" element={<VacunadoresList />} />
          <Route path="/logout" element={<Logout />} />
          {getRole() === "Admin" ? (
            <>
              <Route path="/usuarios" element={<UsuariosList />} />
              <Route path="/centros" element={<CentrosList />} />
              <Route path="/vacunas" element={<VacunasList />} />
            </>
          ) : (
            <Route path="*" element={<Missing />} />
          )}
        </Route>
        <Route path="*" element={<Missing />} />
      </Routes>
    </Router>
  );
}
