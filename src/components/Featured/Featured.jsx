import "./Featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { Container } from "react-bootstrap";
import API from "../../utils/api";

const Featured = () => {
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

  const data = [
    { name: "Pacientes", value: data1.length + 1 },
    { name: "Centros", value: data2.length + 1 },
    { name: "Vacunadores", value: data3.length + 1 },
    { name: "Vacunaciones", value: data4.length + 1 },
  ];
  console.log(data1.length + 1);
  const COLORS = ["#e54160", "#e3bb57", "#72b972", "#9a339a"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Tipos de Vacunas</h1>
      </div>
      <div className="colores">
        <h8 className="Cangrena">Cangrena</h8>
        <br></br>
        <h8>Viruela</h8>
        <br></br>
        <h8>Hepatitis A</h8>
        <br></br>
        <h8>Hepatitis B</h8>
      </div>
      <Container>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </Container>
    </div>
  );
};

export default Featured;
