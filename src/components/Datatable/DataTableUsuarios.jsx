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
import { FormControl } from "@mui/material";
import { Box } from "@material-ui/core";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PrintIcon from "@material-ui/icons/Print";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";

//NOTE: Usuarioss

const columns = [
  { title: "Nombre", field: "nombre" },
  { title: "Apellido", field: "apellido" },
  { title: "Rol", field: "rol" },
  { title: "Estado", field: "estado" },
  { title: "Email", field: "email" },
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
  botonInsertarUsuarios: {
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

function Usuarios() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Funciona", data);
    peticionPost(data);
  };
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [usuarioSeleccionado, setusuarioSeleccionado] = useState({
    id: "",
    nombre: "",
    apellido: "",
    rol: 0,
    estado: 0,
    email: "",
    confirmPassword: "",
    password: "",
  });

  //Export to PDF
  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text("Reporte de usuarios del sistema", 60, 10);
    doc.autoTable({
      columns: columns.map((col) => ({ ...col, datakey: col.field })),
      body: data.map(({ nombre, apellido, rol, estado, email }) => {
        return [nombre, apellido, rol,estado, email];
      }),
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
    doc.save(`Reporte de usuarios ${date.toLocaleDateString()}.pdf`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setusuarioSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const peticionGet = async () => {
    API.getData("Usuarios/listUsers")
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    peticionGet();
  }, [data]);

  const peticionPost = (data) => {
    API.postData("Usuarios/register", data)
      .then((response) => {
        // window.setTimeout(function() {
        // }, 1000);

        setModalInsertar(!modalInsertar);
        setData(...(data + response.data.Usuarios));
        toast.success("¡Se ha creado un nuevo usuario!", {
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log(error);
        console.log("Hola", usuarioSeleccionado);
        if (usuarioSeleccionado.email === " ") {
          toast.warning("¡Todos los campos deben ser llenados!", {
            position: "top-right",
          });
        } else {
          toast.error("¡ERROR! No se pudo crear el usuario", {
            position: "top-right",
          });
        }
      });
  };

  const peticionPut = () => {
    API.putData(
      "Usuarios/updateUser/" + usuarioSeleccionado.id,
      usuarioSeleccionado
    )
      .then((res) => {
        if (res.status === 200) {
          setModalEditar(!modalEditar);
          toast.info(
            `¡Se ha actualizado el usuario ${usuarioSeleccionado.id} !`,
            {
              position: "top-right",
            }
          );
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
        console.log("NO funciona", usuarioSeleccionado);
        toast.error(
          `¡ERROR! No se pudo actualizar el usuario ${usuarioSeleccionado.id}`,
          {
            position: "top-right",
          }
        );
      });
  };

  //Function for sending

  const peticionDelete = async () => {
    API.deleteData("Usuarios/deleteUser/" + usuarioSeleccionado.id)
      .then((response) => {
        setModalEliminar(!modalEliminar);
        setData(
          data.filter((Usuarios) => Usuarios.id !== usuarioSeleccionado.id)
        );
        toast.warning(
          `¡Se ha eliminado el usuario ${usuarioSeleccionado.id}!`,
          {
            position: "top-right",
          }
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          `¡ERROR! No se pudo eliminar el usuario ${usuarioSeleccionado.id}`,
          {
            position: "top-right",
          }
        );
      });
  };

  const seleccionarUsuarios = (Usuarios, caso) => {
    setusuarioSeleccionado(Usuarios);
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
        <h3>Nuevo Usuario</h3>
        <div className="bottom">
          <div className="right"></div>
        </div>
        <Box mb={8}>
          <TextField
            id="standard-basic"
            className={styles.inputMaterial}
            label="Nombre"
            width="100px"
            name="nombre"
            onChange={handleChange}
            {...register("nombre", {
              required: "Campo Requerido",
              pattern: {
                value: /^[a-zA-Z\s]*$/,
                message: "Nombre invalido",
              },
            })}
            error={!!errors?.nombre}
            helperText={errors?.nombre ? errors.nombre.message : null}
          />
          <br />
          <TextField
            className={styles.inputMaterial}
            label="Apellido"
            name="apellido"
            onChange={handleChange}
            {...register("apellido", {
              required: "Campo requerido",
              pattern: {
                value: /^[a-zA-Z\s]*$/,
                message: "Apellido invalido",
              },
            })}
            error={!!errors?.apellido}
            helperText={errors?.apellido ? errors.apellido.message : null}
          />
          <br />
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="demo-simple-select-helper-label">Rol</InputLabel>
            <Select
              defaultValue={""}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              name="rol"
              label="Rol"
              onChange={handleChange}
              {...register("rol", {
                required: "Campo requerido",
              })}
            >
              <MenuItem value={0}>Admin</MenuItem>
              <MenuItem value={1}>Moderador</MenuItem>
            </Select>
          </FormControl>
          <br />
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="demo-simple-select-helper-label">Estado</InputLabel>
            <Select
              defaultValue={""}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              name="estado"
              label="Estado"
              onChange={handleChange}
              {...register("estado", {
                required: "Campo requerido",
              })}
            >
              <MenuItem value={0}>Activo</MenuItem>
              <MenuItem value={1}>Inactivo</MenuItem>
            </Select>
          </FormControl>
          <br/>
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
          <br />
          <TextField
            className={styles.inputMaterial}
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="off"
            onChange={handleChange}
            {...register("password", {
              required: "Campo requerido",
              pattern: {
                value: /^[A-Za-z0-9]{8,50}$/i,
                message: "Invalid password ",
              },
            })}
            error={!!errors?.password}
            helperText={errors?.password ? errors.password.message : null}
          />
          <br />
          <TextField
            className={styles.inputMaterial}
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            autoComplete="off"
            onChange={handleChange}
            {...register("confirmPassword", {
              required: "Campo requerido",
              pattern: {
                value: /^[A-Za-z0-9]{8,50}$/,
                message: "Invalid confirmPassword ",
              },
            })}
            error={!!errors?.confirmPassword}
            helperText={
              errors?.confirmPassword ? errors.confirmPassword.message : null
            }
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
      <h2>Editar Usuario</h2>
      <div className={styles.inputMaterial}>
        <div className="details">
          <h1 className="itemTitle">
            {usuarioSeleccionado && usuarioSeleccionado.id}
          </h1>
          <div className="detailItem">
            <span className="itemKey">Nombre: </span>
            <span className="itemValue">
              {usuarioSeleccionado && usuarioSeleccionado.nombre}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Apellido: </span>
            <span className="itemValue">
              {usuarioSeleccionado && usuarioSeleccionado.apellido}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Rol:</span>
            <span className="itemValue">
              {" "}
              {usuarioSeleccionado && usuarioSeleccionado.rol}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Estado:</span>
            <span className="itemValue">
              {" "}
              {usuarioSeleccionado && usuarioSeleccionado.estado}
            </span>
          </div>

          <div className="detailItem">
            <span className="itemKey">Email:</span>
            <span className="itemValue">
              {" "}
              {usuarioSeleccionado && usuarioSeleccionado.email}
            </span>
          </div>
          <br />
        </div>
      </div>
      <TextField
        id="standard-basic"
        className={styles.inputMaterial}
        label="Nombre"
        width="100px"
        name="nombre"
        onChange={handleChange}
        value={usuarioSeleccionado && usuarioSeleccionado.nombre}
      />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="Apellido"
        name="apellido"
        onChange={handleChange}
        value={usuarioSeleccionado && usuarioSeleccionado.apellido}
      />
      <br />
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="demo-simple-select-helper-label">rol</InputLabel>
        <Select
          defaultValue={""}
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          name="rol"
          label="rol"
          onChange={handleChange}
        >
          <MenuItem value={0}>Administrador</MenuItem>
          <MenuItem value={1}>Moderador</MenuItem>
        </Select>
      </FormControl>
      <br />
      <TextField
        className={styles.inputMaterial}
        label="Email"
        name="email"
        value={usuarioSeleccionado && usuarioSeleccionado.email}
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
        Estás seguro que deseas eliminar al Usuario{" "}
        <b>{usuarioSeleccionado && usuarioSeleccionado.nombre}</b>?{" "}
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
        id="botonInsertarUsuarios"
        variant="contained"
        className={styles.botonInsertarUsuarios}
        onClick={() => abrirCerrarModalInsertar()}
      >
        Agregar Nuevo Usuario
      </Button>

      <br />
      <br />
      <MaterialTable
        columns={columns}
        data={data}
        title="Usuarios Registrados"
        actions={[
          {
            icon: () => <PrintIcon />,
            tooltip: "Export to Pdf",
            onClick: () => exportToPdf(),
            isFreeAction: true,
          },
          {
            icon: Edit,
            tooltip: "Editar Usuarios",
            onClick: (event, rowData) => seleccionarUsuarios(rowData, "Editar"),
          },
          {
            icon: Delete,
            tooltip: "Eliminar Usuarios",
            onClick: (event, rowData) =>
              seleccionarUsuarios(rowData, "Eliminar"),
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

export default Usuarios;
