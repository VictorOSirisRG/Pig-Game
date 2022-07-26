import React, { useState, useEffect } from "react";
import "./DataTable.css";
import { useForm } from "react-hook-form";
import MaterialTable from "@material-table/core";
import { Modal, TextField, Button, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Delete, Edit } from "@material-ui/icons";
import PrintIcon from "@material-ui/icons/Print";
import API from "../../utils/api";
import { toast } from "react-toastify";
import { FormControl } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const columns = [
  { title: "Nombre", field: "nombre" },
  { title: "Dirección", field: "direccion" },
  { title: "Estado", field: "estado" },
  { title: "Fecha de Creación", field: "creacion" },
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
  botonInsertarCentro: {
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

function DataTable() {
  const [data, setData] = useState([]);
  const styles = useStyles();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  // const [formErrors, setFomErrors] = useState({});
  // const [isSubmit, setIsSubmit] = useState(false);
  const [centroSeleccionado, setCentroSeleccionado] = useState({
    nombre: "",
    direccion: "",
    id: "",
    estado: "",
    creacion: "",
  });

  //EXPORT PDF
  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Centros de Vacunación", 60, 10);
    doc.autoTable({
      columns: columns.map((col) => ({ ...col, datakey: col.field })),
      body: data.map(({ nombre, direccion, estado, creacion }) => {
        return [nombre, direccion, estado, creacion];
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
    doc.save(`Reporte de centros ${date.toLocaleDateString()}.pdf`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCentroSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    //  console.log(centroSeleccionado)
  };
  const onSubmit = (data) => {
    peticionPost(data);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setFomErrors(validate(centroSeleccionado));
  //   setIsSubmit(true)
  //   if (Object.keys(formErrors).length === 0 && isSubmit) {
  //     peticionPost()
  //   }
  // }

  // const validate = (values) => {
  //   const errors = {}
  //   if (!values.nombre) {
  //     errors.nombre = "Este campo es requerido"
  //   }
  //   else if (values.nombre.length < 4) {
  //     errors.nombre = "Nombre debe ser mayor a 4 caracteres"
  //   }
  //   return errors;
  // }

  useEffect(() => {
    peticionGet();
  }, []);

  const limpiarCampos = function () {
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
  };
  const peticionGet = () => {
    API.getData("Centros/listCentros")
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPost = (data) => {
    API.postData("Centros/createCentro", data)
      .then((response) => {
        limpiarCampos();
        if (response.status === 200) {
          setModalInsertar(!modalInsertar);
          toast.success("¡Se ha creado un nuevo centro!", {
            position: "top-right",
          });
          peticionGet();
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          toast.warning(`¡${error.response.data.Message}!`, {
            position: "top-right",
          });
        } else {
          toast.error("¡ERROR! No se pudo crear el centro", {
            position: "top-right",
          });
        }
      });
  };

  const peticionPut = () => {
    API.putData(
      "Centros/updateCentro/" + centroSeleccionado.id,
      centroSeleccionado
    )
      .then((res) => {
        if (res.status === 200) {
          setModalEditar(!modalEditar);
          toast.info(
            `¡Se ha actualizado el centro ${centroSeleccionado.id} !`,
            {
              position: "top-right",
            }
          );
          peticionGet();
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
        toast.error(
          `¡ERROR! No se pudo actualizar el centro ${centroSeleccionado.id}`,
          {
            position: "top-right",
          }
        );
      });
  };

  const peticionDelete = async () => {
    await API.deleteData("Centros/deleteCentro/" + centroSeleccionado.id)
      .then((res) => {
        if (res.status === 200) {
          setModalEliminar(!modalEliminar);
          setData(data.filter((centro) => centro.id !== centroSeleccionado.id));
          toast.warning(
            `¡Se ha eliminado el centro ${centroSeleccionado.id}!`,
            {
              position: "top-right",
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          `¡ERROR! No se pudo eliminar el centro ${centroSeleccionado.id}`,
          { position: "top-right" }
        );
      });
  };

  const seleccionarCentro = (centro, caso) => {
    setCentroSeleccionado(centro);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    reset();
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };
  const bodyInsertar = (
    // <form onSubmit={handleSubmit}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.modal}>
        <h3>Nuevo Centro</h3>
        <div className="bottom">
          <div className="right"></div>
        </div>
        <TextField
          id="standard-basic"
          className={styles.inputMaterial}
          label="Nombre"
          width="100px"
          name="nombre"
          onChange={handleChange}
          {...register("nombre", {
            required: "Campo requerido",
            pattern: {
              value: /^[a-zA-Z\s]*$/,
              message: "Nombre no valido",
            },
          })}
          error={!!errors?.nombre}
          helperText={errors?.nombre ? errors.nombre.message : null}
        />
        <br />
        <TextField
          className={styles.inputMaterial}
          label="Dirección"
          name="direccion"
          onChange={handleChange}
          {...register("direccion", {
            required: "Campo requerido",
          })}
          error={!!errors?.direccion}
          helperText={errors?.direccion ? errors.direccion.message : null}
        />
        <br />
        <FormControl sx={{ minWidth: 200 }}>
          <TextField
            select
            defaultValue={""}
            fullWidth
            id="demo-simple-select-helper"
            name="estado"
            label="Seleccione un estado"
            onChange={handleChange}
            {...register("estado", {
              required: "Campo requerido",
            })}
            error={!!errors?.estado}
            helperText={errors?.estado ? errors.estado.message : null}
          >
            <MenuItem value={""}>Seleccione un estado</MenuItem>
            <MenuItem value={0}>Activo</MenuItem>
            <MenuItem value={1}>Inactivo</MenuItem>
          </TextField>
        </FormControl>

        {/* <TextField
          id="standard-basic"
          className={styles.inputMaterial}
          label="Nombre"
          width="100px"
          name="nombre"
          value={centroSeleccionado.nombre}
          onChange={handleChange}
          required={true}
          error={!!formErrors?.nombre}
        />
        <p>{formErrors.nombre}</p>
        <br />
        <TextField
          className={styles.inputMaterial}
          label="Direccion"
          name="direccion"
          onChange={handleChange}
        />
        <br />
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
          >
          <MenuItem value={0}>Activo</MenuItem>
            <MenuItem value={1}>Inactivo</MenuItem>
            </Select>
          </FormControl> */}
        <br />
        <br />
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
      <h2>Editar Centro</h2>
      <div className={styles.inputMaterial}>
        <div className="details">
          <h1 className="itemTitle">
            {centroSeleccionado && centroSeleccionado.id}
          </h1>
          <div className="detailItem">
            <span className="itemKey">Nombre: </span>
            <span className="itemValue">
              {centroSeleccionado && centroSeleccionado.nombre}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Direccion: </span>
            <span className="itemValue">
              {centroSeleccionado && centroSeleccionado.direccion}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Estado:</span>
            <span className="itemValue">
              {" "}
              {centroSeleccionado && centroSeleccionado.estado === 0
                ? "Activo"
                : "Inactivo"}
            </span>
          </div>
          <br />
        </div>
      </div>
      <TextField
        className={styles.inputMaterial}
        label="Nombre"
        name="nombre"
        onChange={handleChange}
        value={centroSeleccionado && centroSeleccionado.nombre}
      />
      <br />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="Direccion"
        name="direccion"
        onChange={handleChange}
        value={centroSeleccionado && centroSeleccionado.direccion}
      />
      <br />
      <br />
      <FormControl sx={{ minWidth: 200 }}>
        <TextField
          defaultValue={""}
          select
          fullWidth
          id="demo-simple-select-helper"
          name="estado"
          label="Seleccione un estado"
          onChange={handleChange}
          value={
            centroSeleccionado && centroSeleccionado.estado === "Activo" ? 0 : 1
          }
        >
          <MenuItem value={0}>Activo</MenuItem>
          <MenuItem value={1}>Inactivo</MenuItem>
        </TextField>
      </FormControl>
      <br />
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
        Estás seguro que deseas eliminar al centro{" "}
        <b>{centroSeleccionado && centroSeleccionado.nombre}</b>?{" "}
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
        id="botonInsertarCentro"
        variant="contained"
        className={styles.botonInsertarCentro}
        onClick={() => abrirCerrarModalInsertar()}
      >
        Agregar Nuevo Centro
      </Button>

      <br />
      <br />
      <MaterialTable
        columns={columns}
        data={data}
        title="Centros de Vacunación"
        actions={[
          {
            icon: () => <PrintIcon />,
            tooltip: "Export to Pdf",
            onClick: () => exportToPdf(),
            isFreeAction: true,
          },

          {
            icon: Edit,
            tooltip: "Editar Centro",
            onClick: (event, rowData) => seleccionarCentro(rowData, "Editar"),
          },
          {
            icon: Delete,
            tooltip: "Eliminar Centro",
            onClick: (event, rowData) => seleccionarCentro(rowData, "Eliminar"),
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

export default DataTable;
