import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./DataTable.css";
import API from "../../utils/api";
import MaterialTable from "@material-table/core";
import {
  Modal,
  TextField,
  Button,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Delete, Edit, ErrorSharp } from "@material-ui/icons";
import { FormControl } from "@mui/material";
import { Box } from "@material-ui/core";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PrintIcon from "@material-ui/icons/Print";

//NOTE: Pacientess

const columns = [
  { title: "Nombres", field: "nombres" },
  { title: "Apellidos", field: "apellidos" },
  { title: "Cédula", field: "cedula" },
  // { title: "Fecha de Nacimiento", field: "fechaNacimiento1" },
  { title: "Sexo", field: "sexo" },
  // { title: "Dirrección", field: "direccion" },
  { title: "Télefono", field: "telefono" },
  { title: "Email", field: "email" },
  { title: "Creación", field: "creacion" },
];


const columns1 = [
  { title: "Nombres", field: "nombres" },
  { title: "Apellidos", field: "apellidos" },
  { title: "Cédula", field: "cedula" },
  { title: "Fecha de Nacimiento", field: "fechaNacimiento1" },
  { title: "Sexo", field: "sexo" },
  { title: "Dirrección", field: "direccion" },
  { title: "Télefono", field: "telefono" },
  { title: "Email", field: "email" },
  { title: "Creación", field: "creacion" },
];

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    width: 500,
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
  botonInsertarPacientes: {
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

function DataTablePacientes() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [PacientesSeleccionado, setPacientesSeleccionado] = useState({
    nombres: "",
    apellidos: "",
    id: "",
    cedula: "",
    telefono: "",
    email: "",
    fechaNacimiento: "",
    sexo: "",
    direccion: "",
  });
  //Export PDF
  const exportToPdf = () => {
    const doc = new jsPDF('p', 'mm', [300, 300]);
    doc.text("Reporte de Pacientes Registrados", 110, 10);
    doc.autoTable({
      columns: columns1.map((col) => ({ ...col, datakey: col.field })),
      body: data.map(
        ({
          nombres,
          apellidos,
          cedula,
          fechaNacimiento1,
          sexo,
          direccion,
          telefono,
          email,
          creacion,
        }) => {
          return [
            nombres,
            apellidos,
            cedula,
            fechaNacimiento1,
            sexo,
            direccion,
            telefono,
            email,
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
    doc.save(`Reporte de pacientes ${date.toLocaleDateString()}.pdf`);
  };

  const onSubmit = (data) => {
    peticionPost(data);
    console.log(data)
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setPacientesSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    peticionGet();
  }, []);

  const peticionGet = async () => {
    await API.getData("Pacientes/listPacientes")
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const peticionPost = (data) => {
    API.postData("Pacientes/createPaciente", data)
      .then(() => {
        setModalInsertar(!modalInsertar);
        toast.success("¡Se ha creado un nuevo paciente!", {
          position: "top-right",
        });
        peticionGet();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          toast.warning(`¡${error.response.data.Message}!`, {
            position: "top-right",
          });
        } else {
          toast.error("¡ERROR! No se pudo crear el paciente", {
            position: "top-right",
          });
        }
      });
  };

  const peticionPut = () => {
    API.putData(
      "Pacientes/updatePaciente/" + PacientesSeleccionado.id,
      PacientesSeleccionado
    )
      .then((res) => {
        if (res.status === 200) {
          setModalEditar(!modalEditar);

          toast.info(
            `¡Se ha actualizado el paciente ${PacientesSeleccionado.id} !`,
            {
              position: "top-right",
            }
          );
          peticionGet();
        }
      })
      .catch((err) => {
        console.error("Error de conexion " + err);
        toast.error(
          `¡ERROR! No se pudo actualizar el paciente ${PacientesSeleccionado.id}`,
          {
            position: "top-right",
          }
        );
      });
  };

  //Function for sending
  const peticionDelete = async () => {
    API.deleteData("Pacientes/deletePaciente/" + PacientesSeleccionado.id)
      .then(() => {
        setModalEliminar(!modalEliminar);
        setData(
          data.filter((Pacientes) => Pacientes.id !== PacientesSeleccionado.id)
        );
        toast.warning(
          `¡Se ha eliminado el paciente ${PacientesSeleccionado.id}!`,
          {
            position: "top-right",
          }
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          `¡ERROR! No se pudo eliminar el paciente ${PacientesSeleccionado.id}`,
          {
            position: "top-right",
          }
        );
      });
  };

  const seleccionarPacientes = (Pacientes, caso) => {
    setPacientesSeleccionado(Pacientes);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    reset()
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
        <h3>Nuevo Paciente</h3>
        <div className="bottom">
          <div className="right"></div>
        </div>
        <TextField
          id="standard-basic"
          className={styles.inputMaterial}
          label="Nombres"
          width="100px"
          name="nombres"
          onChange={handleChange}
          {...register("nombres", {
            required: "Campo requerido",
            pattern: {
              value: /^[a-zA-Z\s]*$/,
              message: "Nombre invalido",
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
        <div>
          <FormControl sx={{ minWidth: 216 }}>
            <TextField
              label="Cédula"
              name="cedula"
              onChange={handleChange}
              {...register("cedula", {
                required: "Campo Requerido",
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Cédula invalida",
                },
              })}
              error={!!errors?.cedula}
              helperText={errors?.cedula ? errors.cedula.message : null}
            />
          </FormControl>
          {"  "}
          <FormControl sx={{ minWidth: 210 }}>
            <TextField
              label="Teléfono"
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
          </FormControl>
        </div>
        <TextField
          className={styles.inputMaterial}
          label="Email"
          name="email"
          onChange={handleChange}
          {...register("email", {
            required: "Campo requerido",
            pattern: {
              value: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g,
              message: "Email invalido",
            },
          })}
          error={!!errors?.email}
          helperText={errors?.email ? errors.email.message : null}
        />
        <br />
        <br />
        <div>
          <FormControl sx={{ minWidth: 216 }}>
            <TextField
              type="date"
              label="Fecha de nacimiento"
              name="fechaNacimiento"
              fullWidth
              onChange={handleChange}
              {...register("fechaNacimiento", {
                required: "Campo requerido",
                pattern: {
                  message: "Fecha invalida",
                },
              })}
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors?.fechaNacimiento}
              helperText={errors?.fechaNacimiento ? errors.fechaNacimiento.message : null
              }
            />
          </FormControl>
          {" "}
          <FormControl sx={{ minWidth: 210 }}>
            <TextField
              select
              defaultValue={""}
              fullWidth
              id="demo-simple-select-helper"
              name="sexo"
              label="Sexo"
              onChange={handleChange}
              {...register("sexo", {
                required: "Campo requerido",
              })}
              error={!!errors?.sexo}
              helperText={errors?.sexo ? errors.sexo.message : null}
            >
              <MenuItem value={""} disabled>Seleccione el sexo</MenuItem>
              <MenuItem value={"M"}>Masculino</MenuItem>
              <MenuItem value={"F"}>Femenino</MenuItem>
            </TextField>
          </FormControl>
        </div>
        <TextField
          className={styles.inputMaterial}
          label="Dirección"
          name="direccion"
          onChange={handleChange}
          {...register("direccion", {
            required: "Campo requerido"
          })}
          error={!!errors?.direccion}
          helperText={errors?.direccion ? errors.direccion.message : null}
        />
        <br />
        <div align="right">
          <Button color="primary" type="submit">
            Insertar
          </Button>
          <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    </form >
  );

  const bodyEditar = (
    <div className={styles.modal}>
      <h2>Editar Paciente{" #"}
        {PacientesSeleccionado && PacientesSeleccionado.id}
      </h2>
      <TextField
        id="standard-basic"
        className={styles.inputMaterial}
        label="Nombres"
        width="100px"
        name="nombres"
        value={PacientesSeleccionado && PacientesSeleccionado.nombres}
        onChange={handleChange}
      />
      <TextField
        className={styles.inputMaterial}
        label="Apellidos"
        name="apellidos"
        onChange={handleChange}
        value={PacientesSeleccionado && PacientesSeleccionado.apellidos}
      />
      <div>
        <FormControl sx={{ minWidth: 216 }}>
          <TextField
            label="Cédula"
            name="cedula"
            value={PacientesSeleccionado && PacientesSeleccionado.cedula}
            onChange={handleChange}
          />
        </FormControl>
        {" "}
        <FormControl sx={{ minWidth: 210 }}>
          <TextField
            className={styles.inputMaterial}
            label="Teléfono"
            name="telefono"
            value={PacientesSeleccionado && PacientesSeleccionado.telefono}
            onChange={handleChange}
          />
        </FormControl>
      </div>
      <TextField
        className={styles.inputMaterial}
        label="Email"
        name="email"
        value={PacientesSeleccionado && PacientesSeleccionado.email}
        onChange={handleChange}
      />
      <br />
      <div>
        <FormControl sx={{ minWidth: 216 }}>
          <TextField
            type="date"
            label="Fecha de nacimiento"
            name="fechaNacimiento"
            fullWidth
            value={PacientesSeleccionado && PacientesSeleccionado.fechaNacimiento}
            onChange={handleChange}
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        {" "}
        <FormControl sx={{ minWidth: 200 }}>
          <TextField
            select
            defaultValue={""}
            fullWidth
            id="demo-simple-select-helper"
            name="sexo"
            label="Sexo"
            onChange={handleChange}
          // {...register("sexo", {
          //   required: "Campo requerido",
          // })}
          // error={!!errors?.sexo}
          // helperText={errors?.sexo ? errors.sexo.message : null}
          >
            <MenuItem value={""} disabled>Seleccione un sexo</MenuItem>
            <MenuItem value={"M"}>Masculino</MenuItem>
            <MenuItem value={"F"}>Femenino</MenuItem>
          </TextField>
        </FormControl>
      </div>
      <br />
      <TextField
        className={styles.inputMaterial}
        label="Dirección"
        name="direccion"
        value={PacientesSeleccionado && PacientesSeleccionado.direccion}
        onChange={handleChange}
      />
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
        Estás seguro que deseas eliminar al Paciente{" "}
        <b>{PacientesSeleccionado && PacientesSeleccionado.nombres}</b>?{" "}
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
        id="botonInsertarPacientes"
        variant="contained"
        className={styles.botonInsertarPacientes}
        onClick={() => abrirCerrarModalInsertar()}
      >
        Agregar Nuevo Paciente
      </Button>

      <br />
      <br />
      <MaterialTable
        columns={columns}
        data={data}
        title="Pacientes Registrados"
        actions={[
          {
            icon: () => <PrintIcon />,
            tooltip: "Export to Pdf",
            onClick: () => exportToPdf(),
            isFreeAction: true,
          },
          {
            icon: Edit,
            tooltip: "Editar Pacientes",
            onClick: (event, rowData) =>
              seleccionarPacientes(rowData, "Editar"),
          },
          {
            icon: Delete,
            tooltip: "Eliminar Pacientes",
            onClick: (event, rowData) =>
              seleccionarPacientes(rowData, "Eliminar"),
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

export default DataTablePacientes;
