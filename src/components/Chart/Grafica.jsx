import "./Chart.scss";
import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API from "../../utils/api";

const Chart = ({ aspect, title }) => {
  const [data1, setData1] = useState([]);

  const peticionGet = () => {
    API.getData("Pacientes/listPacientes").then((response) => {
      setData1(response.data.data);
    });
  };
  useEffect(() => {
    peticionGet();
  }, []);

  let data = [
    { name: "Actual", Total: data1.length },
    { name: "Esperado", Total: 10 },
  ];

  return (
    <div className="chart">
      <div className="title">Meta Anual de pacientes </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3ec1c9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
