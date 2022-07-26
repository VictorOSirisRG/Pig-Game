import React from "react";
import Sidebar from "../../components/Sidebar.jsx/Sidebar";
import Navbar from "../../components/Navbar.jsx/Navbar";
import DataTableVacunas from "../../components/Datatable/DataTableVacunas";
import "./List.scss";

const VacunasList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <DataTableVacunas />
      </div>
    </div>
  );
};

export default VacunasList;
