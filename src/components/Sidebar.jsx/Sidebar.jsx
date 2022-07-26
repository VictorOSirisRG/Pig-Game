import React from "react";
import "./Sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { Link } from "react-router-dom";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { getRole, getUser } from "../../utils/common";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">{"SysvacRD"}</span>
      </div>
      <hr />
      <span className="user">{getUser().nombreCompleto.toUpperCase()}</span>
      <br></br>
      <span className="role">{getRole().toUpperCase()}</span>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <Link to="/">
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <p className="title">ADMINISTRACION</p>
          {getRole() === "Admin" ? (
            <>
              <Link to="/usuarios" style={{ textDecoration: "none" }}>
                <li>
                  <PeopleAltIcon className="icon" />
                  <span>Usuarios</span>
                </li>
              </Link>
              <Link to="/centros" style={{ textDecoration: "none" }}>
                <li>
                  <StoreIcon className="icon" />
                  <span>Centros</span>
                </li>
              </Link>
              <Link to="/vacunas" style={{ textDecoration: "none" }}>
                <li>
                  <VaccinesIcon className="icon" />
                  <span>Vacunas</span>
                </li>
              </Link>
            </>
          ) : (
            " "
          )}
          <Link to="/pacientes" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Pacientes</span>
            </li>
          </Link>
          <Link to="/vacunadores" style={{ textDecoration: "none" }}>
            <li>
              <PeopleAltIcon className="icon" />
              <span>Vacunadores</span>
            </li>
          </Link>

          <Link to="/vacunaciones" style={{ textDecoration: "none" }}>
            <li>
              <PeopleAltIcon className="icon" />
              <span>Vacunaciones</span>
            </li>
          </Link>

          <p className="title">USUARIO</p>
          <Link to="/perfil" style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Perfil</span>
            </li>
          </Link>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Ajustes</span>
          </li>
          <hr />
          <Link to="/logout" style={{ textDecoration: "none" }}>
            <li>
              <ExitToAppIcon className="icon" cl />
              <span>Cerrar Sesion</span>
            </li>
          </Link>
          <hr />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
