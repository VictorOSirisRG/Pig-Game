import React, { useState, useEffect } from "react";
import "./Widget.scss";
import API from "../../utils/api";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Link } from "react-router-dom";
import { getRole } from "../../utils/common";

const Widget = ({ type }) => {
  let data;
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);

  const peticionGet1 = () => {
    API.getData("Centros/listCentros").then((response) => {
      setData1(response.data.data);
    });
  };
  const peticionGet2 = () => {
    API.getData("Vacunadores/listVacunadores").then((response) => {
      setData2(response.data.data);
    });
  };

  const peticionGet3 = () => {
    API.getData("Pacientes/listPacientes").then((response) => {
      setData3(response.data.data);
    });
  };
  const peticionGet4 = () => {
    API.getData("Vacunaciones/listVacunaciones").then((response) => {
      setData4(response.data.data);
    });
  };

  useEffect(() => {
    peticionGet1();
    peticionGet2();
    peticionGet3();
    peticionGet4();
  }, []);

  switch (type) {
    case "user":
      data = {
        title: "PACIENTES",
        isMoney: false,
        link: (
          <Link to="/pacientes" style={{ textDecoration: "none" }}>
            <li>
              <span>Ver listado de pacientes</span>
            </li>
          </Link>
        ),
        count: data1.length === 0 ? "N/A" : data3.length,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "CENTROS",
        isMoney: false,
        link: (
          <Link to="/centros" style={{ textDecoration: "none" }}>
            <li>
              <span>Ver listado de centros</span>
            </li>
          </Link>
        ),
        count: data3.length === 0 ? "N/A" : data3.length,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "VACUNADORES",
        isMoney: true,
        link: (
          <Link to="/vacunadores" style={{ textDecoration: "none" }}>
            <li>
              <span>Ver listado de vacunadores</span>
            </li>
          </Link>
        ),
        count: data2.length === 0 ? "N/A" : data2.length,
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "VACUNACIONES",
        isMoney: false,
        link: (
          <Link to="/vacunaciones" style={{ textDecoration: "none" }}>
            <li>
              <span>Ver listado de vacunaciones</span>
            </li>
          </Link>
        ),
        count: data4.length === 0 ? "N/A" : data4.length,
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.count}</span>
        {getRole() === "Admin" ? (
          <span className="link">{data.link}</span>
        ) : (
          <span className="link"></span>
        )}
      </div>
      <div className="right">{data.icon}</div>
    </div>
  );
};

export default Widget;
