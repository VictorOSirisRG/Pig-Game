import React from "react";
import Sidebar from "../../components/Sidebar.jsx/Sidebar";
import Navbar from "../../components/Navbar.jsx/Navbar";
import DataTableVacunadores from "../../components/Datatable/DataTableVacunadores";
import "./List.scss";

const VacunadoresList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <DataTableVacunadores />
      </div>
    </div>
  );
};

export default VacunadoresList;
