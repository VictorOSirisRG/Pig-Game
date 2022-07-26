import "./Table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const List = () => {
  const rows = [
    {
      id: 1143155,
      product: "Pedro mario",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Agusto Herrera",
      date: "11/3/2022",
      amount: "Villajuana",
      method: "Cangrena",
      status: "Approved",
    },
    {
      id: 2235235,
      product: "Pedro Antonio",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Agusto Herrera",
      date: "11/3/2022",
      amount: "Villajuana",
      method: "Cangrena",
      status: "Pending",
    },
    {
      id: 2342353,
      product: "Pedro Antonio",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Agusto Herrera",
      date: "11/3/2022",
      amount: "Villajuana",
      method: "Cangrena",
      status: "Pending",
    },
    {
      id: 2357741,
      product: "Pedro Antonio",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Agusto Herrera",
      date: "11/3/2022",
      amount: "Villajuana",
      method: "Cangrena",
      status: "Approved",
    },
    {
      id: 2342355,
      product: "Pedro Antonio",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Agusto Herrera",
      date: "11/3/2022",
      amount: "Villajuana",
      method: "Cangrena",
      status: "Pending",
    },
  ];
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">ID</TableCell>
            <TableCell className="tableCell">Nombre</TableCell>
            <TableCell className="tableCell">Apellido</TableCell>
            <TableCell className="tableCell">Fecha</TableCell>
            <TableCell className="tableCell">Centro</TableCell>
            <TableCell className="tableCell">Vacuna</TableCell>
            <TableCell className="tableCell">Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  {/* <img src={row.img} alt="" className="image" /> */}
                  {row.product}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.customer}</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
              <TableCell className="tableCell">{row.amount}</TableCell>
              <TableCell className="tableCell">{row.method}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
