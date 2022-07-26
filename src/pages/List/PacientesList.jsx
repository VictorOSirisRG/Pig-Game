import React from "react";
import Sidebar from "../../components/Sidebar.jsx/Sidebar";
import Navbar from "../../components/Navbar.jsx/Navbar";
import DataTablePacientes from "../../components/Datatable/DataTablePacientes";
import "./List.scss";

const PacientesList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
      <div className="top">
          <h1>LISTADO DE PACIENTES REGISTRADOS</h1>
        </div>
        <div className="top">
          <DataTablePacientes />
        </div>
      </div>
    </div>
  );
};

export default PacientesList;
