import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./DataTable.css";
import API from "../../utils/api";
import MaterialTable from "@material-table/core";
import {
  Modal,
  TextField,
  Button,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Delete, Edit, ErrorSharp } from "@material-ui/icons";
import { ShowAlertMessage } from "../../utils/commonFunctions";
import { FormControl } from "@mui/material";
import { Box } from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";

//NOTE: vacunadoress

const columns = [
  { title: "Nombres", field: "nombres" },
  { title: "Apellidos", field: "apellidos" },
  { title: "Cedula", field: "cedula" },
  { title: "Telefono", field: "telefono" },
  { title: "Email", field: "email" },
  { title: "GraduadoEn", field: "graduadoEn" },
  { title: "Dirreccion", field: "direccion" },
];

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
  botonInsertarvacunadores: {
    backgroundColor: "#44c1c9",
    top: "50%",
    left: "0%",
  },
  imagenEditarPerfil: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
  },
}));

function DataTableVacunadores() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    peticionPost(data);
    console.log(data);
  };
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [vacunadoresSeleccionado, setvacunadoresSeleccionado] = useState({
    nombres: "",
    apellidos: "",
    id: "",
    cedula: "",
    telefono: "",
    email: "",
    graduadoEn: "",
    direccion: "",
  });

  //EXport PDF
  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Vacunadores", 75, 10);
    doc.autoTable({
      columns: columns.map((col) => ({ ...col, datakey: col.field })),
      body: data.map(
        ({
          nombres,
          apellidos,
          cedula,
          telefono,
          email,
          direccion,
          graduadoEn,
          creacion,
        }) => {
          return [
            nombres,
            apellidos,
            cedula,
            telefono,
            email,
            direccion,
            graduadoEn,
            creacion,
          ];
        }
      ),
    });
    doc.setTextColor(150);
    doc.text(10, doc.internal.pageSize.height - 10, "SysvacRD");
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.text(
        "Page " + String(i) + " of " + String(pageCount),
        210 - 20,
        297 - 30,
        null,
        null,
        "right"
      );
    }
    let date = new Date();
    doc.save(`Reporte de vacunadores ${date.toLocaleDateString()}.pdf`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setvacunadoresSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const peticionGet = async () => {
    API.getData("Vacunadores/listVacunadores")
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    peticionGet();
  }, []);

  const peticionPost = (data) => {
    API.postData("Vacunadores/createVacunador", data)
      .then((response) => {
        setModalInsertar(!modalInsertar);
        setData(...(data + response.data.vacunadores));
        toast.success("¡Se ha creado un nuevo vacunadores!", {
          position: "top-right",
        });
      })
      .catch((error) => {
        if (vacunadoresSeleccionado.direccion === "") {
          toast.warning("¡Todos los campos deben ser llenados!", {
            position: "top-right",
          });
        } else {
          toast.error("¡ERROR! No se pudo crear el vacunadores", {
            position: "top-right",
          });
        }
        console.log(error);
      });
  };

  const peticionPut = () => {
    API.putData(
      "Vacunadores/updateVacunador/" + vacunadoresSeleccionado.id,
      vacunadoresSeleccionado
    )
      .then((res) => {
        if (res.status === 200) {
          setModalEditar(!modalEditar);
          toast.info(
            `¡Se ha actualizado el vacunadores ${vacunadoresSeleccionado.id} !`,
            {
              position: "top-right",
            }
          );
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
        toast.error(
          `¡ERROR! No se pudo actualizar el vacunadores ${vacunadoresSeleccionado.id}`,
          {
            position: "top-right",
          }
        );
      });
  };

  //Function for sending

  const peticionDelete = async () => {
    API.deleteData("Vacunadores/deleteVacunador/" + vacunadoresSeleccionado.id)
      .then((response) => {
        setModalEliminar(!modalEliminar);
        setData(
          data.filter(
            (vacunadores) => vacunadores.id !== vacunadoresSeleccionado.id
          )
        );
        toast.warning(
          `¡Se ha eliminado el vacunadores ${vacunadoresSeleccionado.id}!`,
          {
            position: "top-right",
          }
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          `¡ERROR! No se pudo eliminar el vacunadores ${vacunadoresSeleccionado.id}`,
          {
            position: "top-right",
          }
        );
      });
  };

  const seleccionarvacunadores = (vacunadores, caso) => {
    setvacunadoresSeleccionado(vacunadores);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  const abrirCerrarModalInsertar = () => {
    reset()
    setModalInsertar(!modalInsertar );
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  const bodyInsertar = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.modal}>
        <h3>Nuevo vacunador</h3>
        <div className="bottom">
          <div className="right"></div>
        </div>
        <Box mb={7}>
          <TextField
            id="standard-basic"
            className={styles.inputMaterial}
            label="Nombre"
            width="100px"
            name="nombres"
            onChange={handleChange}
            {...register("nombres", {
              required: "Campo requerido",
              pattern: {
                value: /^[a-zA-Z\s]*$/,
                message: "Nombre Invalido",
              },
            })}
            error={!!errors?.nombres}
            helperText={errors?.nombres ? errors.nombres.message : null}
          />
          <TextField
            className={styles.inputMaterial}
            label="Apellidos"
            name="apellidos"
            onChange={handleChange}
            {...register("apellidos", {
              required: "Campo requerido",
              pattern: {
                value: /^[a-zA-Z\s]*$/,
                message: "Apellido invalido",
              },
            })}
            error={!!errors?.apellidos}
            helperText={errors?.apellidos ? errors.apellidos.message : null}
          />
          <TextField
            className={styles.inputMaterial}
            label="Cedula"
            name="cedula"
            onChange={handleChange}
            {...register("cedula", {
              required: "Campo requerido",
              pattern: {
                value: /^[0-9]*$/,
                message: "Cédula invalida",
              },
            })}
            error={!!errors?.cedula}
            helperText={errors?.cedula ? errors.cedula.message : null}
          />
          <TextField
            className={styles.inputMaterial}
            label="Telefono"
            name="telefono"
            onChange={handleChange}
            {...register("telefono", {
              required: "Campo requerido",
              pattern: {
                value: /^[0-9]*$/,
                message: "Teléfono invalido",
              },
            })}
            error={!!errors?.telefono}
            helperText={errors?.telefono ? errors.telefono.message : null}
          />
          <TextField
            className={styles.inputMaterial}
            label="Email"
            name="email"
            onChange={handleChange}
            {...register("email", {
              required: "Campo requerido",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                message: "Email invalido",
              },
            })}
            error={!!errors?.email}
            helperText={errors?.email ? errors.email.message : null}
          />
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="demo-simple-select-helper-label">
              graduadoEn
            </InputLabel>
            <Select
              defaultValue={""}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              name="graduadoEn"
              label="graduadoEn"
              onChange={handleChange}
              {...register("graduadoEn", {
                required: "Campo requerido",
              })}
            >
              <MenuItem value={0}>Medico</MenuItem>
              <MenuItem value={1}>Especialista</MenuItem>
              <MenuItem value={2}>Enfermera</MenuItem>
              <MenuItem value={3}>Bioanalista</MenuItem>
              <MenuItem value={4}>Otros</MenuItem>
            </Select>
          </FormControl>
          <TextField
            className={styles.inputMaterial}
            label="Direccion"
            name="direccion"
            onChange={handleChange}
            {...register("direccion", {
              required: "Campo requerido",
              pattern: {
                value: /^[a-z\d\-_\s]+$/i,
                message: "Dirección invalida ",
              },
            })}
            error={!!errors?.direccion}
            helperText={errors?.direccion ? errors.direccion.message : null}
          />
          <br />
        </Box>
        <div align="right">
          <Button color="primary" type="submit">
            Insertar
          </Button>
          <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    </form>
  );

  const bodyEditar = (
    <div className={styles.modal}>
      <h2>Editar vacunador</h2>
      <div className={styles.inputMaterial}>
        <div className="details">
          <h1 className="itemTitle">
            {vacunadoresSeleccionado && vacunadoresSeleccionado.id}
          </h1>
          <div className="detailItem">
            <span className="itemKey">Nombres: </span>
            <span className="itemValue">
              {vacunadoresSeleccionado && vacunadoresSeleccionado.nombres}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Apellidos: </span>
            <span className="itemValue">
              {vacunadoresSeleccionado && vacunadoresSeleccionado.apellidos}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Cédula:</span>
            <span className="itemValue">
              {" "}
              {vacunadoresSeleccionado && vacunadoresSeleccionado.cedula}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Teléfono:</span>
            <span className="itemValue">
              {" "}
              {vacunadoresSeleccionado && vacunadoresSeleccionado.telefono}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Email:</span>
            <span className="itemValue">
              {" "}
              {vacunadoresSeleccionado && vacunadoresSeleccionado.email}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Graduado en:</span>
            <span className="itemValue">
              {" "}
              {vacunadoresSeleccionado && vacunadoresSeleccionado.graduadoEn}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Dirrección:</span>
            <span className="itemValue">
              {" "}
              {vacunadoresSeleccionado && vacunadoresSeleccionado.direccion}
            </span>
          </div>
        </div>
      </div>

      <TextField
        id="standard-basic"
        className={styles.inputMaterial}
        label="Nombre"
        width="100px"
        name="nombres"
        value={vacunadoresSeleccionado && vacunadoresSeleccionado.nombres}
        onChange={handleChange}
      />
      <TextField
        className={styles.inputMaterial}
        label="Apellidos"
        name="apellidos"
        onChange={handleChange}
        value={vacunadoresSeleccionado && vacunadoresSeleccionado.apellidos}
      />
      <TextField
        className={styles.inputMaterial}
        label="Cedula"
        name="cedula"
        value={vacunadoresSeleccionado && vacunadoresSeleccionado.cedula}
        onChange={handleChange}
      />
      <TextField
        className={styles.inputMaterial}
        label="Telefono"
        name="telefono"
        value={vacunadoresSeleccionado && vacunadoresSeleccionado.telefono}
        onChange={handleChange}
      />
      <TextField
        className={styles.inputMaterial}
        label="Email"
        name="email"
        value={vacunadoresSeleccionado && vacunadoresSeleccionado.email}
        onChange={handleChange}
      />
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="demo-simple-select-helper-label">graduadoEn</InputLabel>
        <Select
          defaultValue={""}
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          name="graduadoEn"
          label="graduadoEn"
          onChange={handleChange}
        >
          <MenuItem value={0}>Medico</MenuItem>
          <MenuItem value={1}>Especialista</MenuItem>
          <MenuItem value={2}>Enfermera</MenuItem>
          <MenuItem value={3}>Bioanalista</MenuItem>
          <MenuItem value={4}>Otros</MenuItem>
        </Select>
      </FormControl>
      <TextField
        className={styles.inputMaterial}
        label="Direccion"
        name="direccion"
        value={vacunadoresSeleccionado && vacunadoresSeleccionado.direccion}
        onChange={handleChange}
      />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => peticionPut()}>
          Editar
        </Button>
        <Button onClick={() => abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  );

  const bodyEliminar = (
    <div className={styles.modal}>
      <p align="center">
        Estás seguro que deseas eliminar al vacunador{" "}
        <b>{vacunadoresSeleccionado && vacunadoresSeleccionado.nombres}</b>?{" "}
      </p>
      <div align="center">
        <Button color="secondary" onClick={() => peticionDelete()}>
          Sí
        </Button>
        <Button onClick={() => abrirCerrarModalEliminar()}>No</Button>
      </div>
    </div>
  );
  return (
    <div className="DataTable">
      <br />
      <Button
        id="botonInsertarvacunadores"
        variant="contained"
        className={styles.botonInsertarvacunadores}
        onClick={() => abrirCerrarModalInsertar()}
      >
        Agregar Nuevo vacunadores
      </Button>

      <br />
      <br />
      <MaterialTable
        columns={columns}
        data={data}
        title="Personal de Vacunadores"
        actions={[
          {
            icon: () => <PrintIcon />,
            tooltip: "Export to Pdf",
            onClick: () => exportToPdf(),
            isFreeAction: true,
          },
          {
            icon: Edit,
            tooltip: "Editar vacunadores",
            onClick: (event, rowData) =>
              seleccionarvacunadores(rowData, "Editar"),
          },
          {
            icon: Delete,
            tooltip: "Eliminar vacunadores",
            onClick: (event, rowData) =>
              seleccionarvacunadores(rowData, "Eliminar"),
          },
        ]}
        options={{
          actionsColumnIndex: -1,
        }}
        localization={{
          header: {
            actions: "Acción",
          },
        }}
      />

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>

      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>

      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div>
  );
}

export default DataTableVacunadores;
