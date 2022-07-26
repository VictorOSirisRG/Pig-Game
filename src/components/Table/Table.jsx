import "./Table.scss";
import { useState, useEffect } from "react";
import API from "../../utils/api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


const List = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    peticionGet();
  }, []);

  const peticionGet = () => {
    API.getData("Vacunaciones/listVacunaciones")
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">ID</TableCell>
            <TableCell className="tableCell">Fecha de Vacunación</TableCell>
            <TableCell className="tableCell">Cédula</TableCell>
            <TableCell className="tableCell">Paciente</TableCell>
            <TableCell className="tableCell">Centro</TableCell>
            <TableCell className="tableCell">Vacunador</TableCell>
            <TableCell className="tableCell">Vacuna</TableCell>
            <TableCell className="tableCell">Lote</TableCell>
            <TableCell className="tableCell">Dosis</TableCell>
            <TableCell className="tableCell">Fecha Proxima</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  {/* <img src={row.img} alt="" className="image" /> */}
                  {row.product}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.fechaVacunacion}</TableCell>
              <TableCell className="tableCell">{row.cedula}</TableCell>
              <TableCell className="tableCell">{row.paciente}</TableCell>
              <TableCell className="tableCell">{row.centro}</TableCell>
              <TableCell className="tableCell">{row.vacunador}</TableCell>
              <TableCell className="tableCell">{row.vacuna}</TableCell>
              <TableCell className="tableCell">{row.lote}</TableCell>
              <TableCell className="tableCell">{row.dosis}</TableCell>
              <TableCell className="tableCell">{row.fechaProxima}</TableCell>
              {/* <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
