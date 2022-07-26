import React from "react";
import Sidebar from "../../components/Sidebar.jsx/Sidebar";
import Navbar from "../../components/Navbar.jsx/Navbar";
import Usuarios from "../../components/Datatable/DataTableUsuarios";
import "./List.scss";

const UsuariosList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <Usuarios />
      </div>
    </div>
  );
};

export default UsuariosList;
