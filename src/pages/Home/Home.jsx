import React from "react";
import Sidebar from "../../components/Sidebar.jsx/Sidebar";
import "./Home.scss";
// import Navbar from "../../components/Navbar.jsx/Navbar";
import Widget from "../../components/Widgets/Widget";
import Featured from "../../components/Featured/Featured";
import Grafica from "../../components/Chart/Grafica.jsx";
import Table from "../../components/Table/Table";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        {/* <Navbar /> */}
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Grafica title="Progreso ultimos 6 meses" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Últimas Vacunaciónes</div>
          <Table />
        </div>
      </div>
    </div>
  );
};
export default Home;
