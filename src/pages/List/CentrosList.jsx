import React from "react";
import Sidebar from "../../components/Sidebar.jsx/Sidebar";
import Navbar from "../../components/Navbar.jsx/Navbar";
import DataTableCentros from "../../components/Datatable/DataTableCentros";
import "./List.scss";

const CentrosList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <div className="top">
          <h1>LISTADO DE CENTROS DE VACUNACION REGISTRADOS</h1>
        </div>
        <div className="top">
          <DataTableCentros />
        </div>
      </div>
    </div>
  );
};

export default CentrosList;
