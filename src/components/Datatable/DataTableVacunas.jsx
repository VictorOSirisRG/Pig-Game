import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./DataTable.css";
import API from "../../utils/api";
import MaterialTable from "@material-table/core";
import {
  Modal,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Delete, Edit} from "@material-ui/icons";
import { Box } from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";

const columns = [
  { title: "Nombre", field: "nombre" },
  { title: "Descripción", field: "descripcion" },
  { title: "Laboratorio", field: "laboratorio" },
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
  botonInsertarvacuna: {
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

function DataTableVacunas() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    peticionPost(data);
  };

  const styles = useStyles();
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [vacunaSeleccionado, setvacunaSeleccionado] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    laboratorio: "",
  });

  //EXport PDF
  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Vacunas registradas", 60, 10);
    doc.autoTable({
      columns: columns.map((col) => ({ ...col, datakey: col.field })),
      body: data.map(({ nombre, descripcion, laboratorio }) => {
        return [nombre, descripcion, laboratorio];
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
    doc.save(`Reporte de Vacunas ${date.toLocaleDateString()}.pdf`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setvacunaSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    peticionGet();
  }, []);

  const peticionGet = async () => {
    API.getData("Vacunas/listVacunas")
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPost = (data) => {
    API.postData("Vacunas/createVacuna", data)
      .then(() => {
        setModalInsertar(!modalInsertar);
        toast.success("¡Se ha creado una nueva vacuna!", {
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
          toast.error("¡ERROR! No se pudo crear la vacuna", {
            position: "top-right",
          });
        }
      });
  };

  const peticionPut = () => {
    API.putData(
      "Vacunas/updateVacuna/" + vacunaSeleccionado.id,
      vacunaSeleccionado
    )
      .then((res) => {
        if (res.status === 200) {
          setModalEditar(!modalEditar);
          toast.info(
            `¡Se ha actualizado la vacuna ${vacunaSeleccionado.id}!`,
            {
              position: "top-right",
            }
          );
          peticionGet();
        }
      })
      .catch(function (err) {
        console.log(vacunaSeleccionado);
        console.error("Error de conexion " + err);
        toast.error(
          `¡ERROR! No se pudo actualizar la vacunas ${vacunaSeleccionado.id}`,
          {
            position: "top-right",
          }
        );
      });
  };

  //Function for sending

  const peticionDelete = async () => {
    API.deleteData("Vacunas/deleteVacuna/" + vacunaSeleccionado.id)
      .then(() => {
        setModalEliminar(!modalEliminar);
        setData(data.filter((vacuna) => vacuna.id !== vacunaSeleccionado.id));
        toast.warning(`¡Se ha eliminado la vacuna ${vacunaSeleccionado.id}!`, {
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          `¡ERROR! No se pudo eliminar la vacuna ${vacunaSeleccionado.id}`,
          {
            position: "top-right",
          }
        );
      });
  };

  const seleccionarVacuna = (vacuna, caso) => {
    setvacunaSeleccionado(vacuna);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  const abrirCerrarModalInsertar = () => {
    reset();
    setModalInsertar(!modalInsertar);
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
        <h3>Nueva vacuna</h3>
        <div className="bottom">
          <div className="right"></div>
        </div>
        <Box mb={3}>
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
                message: "Formato Invalido de nombre ",
              },
            })}
            error={!!errors?.nombre}
            helperText={errors?.nombre ? errors.nombre.message : null}
          />
          <br />

          <TextField
            className={styles.inputMaterial}
            label="Laboratorio"
            name="laboratorio"
            onChange={handleChange}
            {...register("laboratorio", {
              required: "Campo Requerido",
              pattern: {
                value: /^[a-zA-Z\s]*$/,
                message: "Formato Invalido de laboratorio ",
              },
            })}
            error={!!errors?.laboratorio}
            helperText={errors?.laboratorio ? errors.laboratorio.message : null}
          />
          <br />

          <TextField
            className={styles.inputMaterial}
            label="Descripcion"
            name="descripcion"
            onChange={handleChange}
            {...register("descripcion", {
              required: "Campo Requerido",
              pattern: {
                value: /^[a-zA-Z\s]*$/,
                message: "Formato Invalido de Descripcion ",
              },
            })}
            error={!!errors?.descripcion}
            helperText={errors?.descripcion ? errors.descripcion.message : null}
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
      <h2>Editar Vacuna</h2>
      <div className={styles.inputMaterial}>
        <div className="details">
          <h1 className="itemTitle">
            {vacunaSeleccionado && vacunaSeleccionado.id}
          </h1>
          <div className="detailItem">
            <span className="itemKey">Nombre: </span>
            <span className="itemValue">
              {vacunaSeleccionado && vacunaSeleccionado.nombre}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Laboratorio: </span>
            <span className="itemValue">
              {vacunaSeleccionado && vacunaSeleccionado.laboratorio}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Descripcion: </span>
            <span className="itemValue">
              {vacunaSeleccionado && vacunaSeleccionado.descripcion}
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
        value={vacunaSeleccionado && vacunaSeleccionado.nombre}
      />
      <br />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="laboratorio"
        name="laboratorio"
        onChange={handleChange}
        defaultValue={vacunaSeleccionado && vacunaSeleccionado.laboratorio}
      />
      <br />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="Descripcion"
        name="descripcion"
        onChange={handleChange}
        value={vacunaSeleccionado && vacunaSeleccionado.descripcion}
      />
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
        Estás seguro que deseas eliminar la vacuna{" "}
        <b>{vacunaSeleccionado && vacunaSeleccionado.nombre}</b>?{" "}
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
        id="botonInsertarvacuna"
        variant="contained"
        className={styles.botonInsertarvacuna}
        onClick={() => abrirCerrarModalInsertar()}
      >
        Agregar Nueva Vacuna
      </Button>

      <br />
      <br />
      <MaterialTable
        columns={columns}
        data={data}
        title="Vacunas Registradas"
        actions={[
          {
            icon: () => <PrintIcon />,
            tooltip: "Export to Pdf",
            onClick: () => exportToPdf(),
            isFreeAction: true,
          },
          {
            icon: Edit,
            tooltip: "Editar vacuna",
            onClick: (event, rowData) => seleccionarVacuna(rowData, "Editar"),
          },
          {
            icon: Delete,
            tooltip: "Eliminar vacuna",
            onClick: (event, rowData) => seleccionarVacuna(rowData, "Eliminar"),
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

export default DataTableVacunas;
