import React from "react";
import Sidebar from "../../components/Sidebar.jsx/Sidebar";
import Navbar from "../../components/Navbar.jsx/Navbar";
import DataTableVacunaciones from "../../components/Datatable/DatatableVacunaciones";
import "./List.scss";

const VacunacionesList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <DataTableVacunaciones />
      </div>
    </div>
  );
};

export default VacunacionesList;
