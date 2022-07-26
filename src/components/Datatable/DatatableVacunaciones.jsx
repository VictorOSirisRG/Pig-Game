import React, { useState, useEffect } from "react";
import "./DataTable.css";
import { useForm } from "react-hook-form";
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
import { Delete, Edit } from "@material-ui/icons";
import PrintIcon from "@material-ui/icons/Print";
import { toast } from "react-toastify";
import { FormControl } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const columns = [
  { title: "centroID", field: "centroID" },
  { title: "VacunadorID", field: "VacunadorID" },
  { title: "vacunaID", field: "vacunaID" },
  { title: "lote", field: "lote" },
  { title: "dosis", field: "dosis" },
];
const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    wIDth: 600,
    backgroundColor: theme.palette.background.paper,
    border: "2px solID #000",
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
    wIDth: "100%",
  },
  botonInsertarvacunacion: {
    backgroundColor: "#44c1c9",
    top: "50%",
    left: "0%",
  },
  imagenEditarPerfil: {
    wIDth: "120px",
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
  const [vacunacionSeleccionado, setvacunacionSeleccionado] = useState({
    centroID: "",
    vacunadorID: "",
    ID: "",
    vacunaID: "",
    pacienteID: "",
    lote: "",
    dosis: "",
  });

  //EXPORT PDF
  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text("Reporte de vacunacions de Vacunación", 60, 10);
    doc.autoTable({
      columns: columns.map((col) => ({ ...col, datakey: col.field })),
      body: data.map(
        ({ centroID, vacunadorID, vacunaID, pacienteID, lote, dosis }) => {
          return [centroID, vacunadorID, vacunaID, pacienteID, lote, dosis];
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
    doc.save(`Reporte de vacunacions ${date.toLocaleDateString()}.pdf`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setvacunacionSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    //  console.log(vacunacionSeleccionado)
  };
  const onSubmit = (data) => {
    console.log(data);
    peticionPost(data);
    reset();
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setFomErrors(valIDate(vacunacionSeleccionado));
  //   setIsSubmit(true)
  //   if (Object.keys(formErrors).length === 0 && isSubmit) {
  //     peticionPost()
  //   }
  // }

  // const valIDate = (values) => {
  //   const errors = {}
  //   if (!values.centroID) {
  //     errors.centroID = "Este campo es requerIDo"
  //   }
  //   else if (values.centroID.length < 4) {
  //     errors.centroID = "centroID debe ser mayor a 4 caracteres"
  //   }
  //   return errors;
  // }

  //NOTE Creando select consuming centros
  const [result, centroList] = useState([]);
  useEffect(() => {
    fetch("https://sysvacrd.azurewebsites.net/api/Centros/listCentros", {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((resp) => centroList(resp));
  }, []);

  useEffect(() => {
    peticionGet();
  });

  // result.map((x) => {
  //   return console.log(x.nombre);
  // });

  const peticionGet = () => {
    API.getData("Vacunaciones/listVacunaciones")
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPost = (data) => {
    API.postData("Vacunaciones/Vacunaciones/createVacunacion", data)
      .then((response) => {
        setModalInsertar(!modalInsertar);
        setData(...(data + response.data.vacunacion));
        toast.success("¡Se ha creado un nuevo vacunacion!", {
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log(error);
        if (vacunacionSeleccionado.vacunadorID === "") {
          toast.warning("¡Todos los campos deben ser llenados!", {
            position: "top-right",
          });
        } else {
          toast.error("¡ERROR! No se pudo crear el vacunacion", {
            position: "top-right",
          });
        }
      });
  };

  const peticionPut = () => {
    API.putData(
      "Vacunaciones/Vacunaciones/updateVacunacion/" + vacunacionSeleccionado.ID,
      vacunacionSeleccionado
    )
      .then((res) => {
        if (res.status === 200) {
          setModalEditar(!modalEditar);
          toast.info(
            `¡Se ha actualizado el vacunacion ${vacunacionSeleccionado.ID} !`,
            {
              position: "top-right",
            }
          );
        }
      })
      .catch(function (err) {
        console.error("Error de conexion " + err);
        toast.error(
          `¡ERROR! No se pudo actualizar el vacunacion ${vacunacionSeleccionado.ID}`,
          {
            position: "top-right",
          }
        );
      });
  };

  const peticionDelete = async () => {
    API.deleteData("Vacunaciones/deleteVacunacion/" + vacunacionSeleccionado.ID)
      .then((response) => {
        setModalEliminar(!modalEliminar);
        setData(
          data.filter(
            (vacunacion) => vacunacion.ID !== vacunacionSeleccionado.ID
          )
        );
        toast.warning(
          `¡Se ha eliminado el vacunacion ${vacunacionSeleccionado.ID}!`,
          {
            position: "top-right",
          }
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          `¡ERROR! No se pudo eliminar el vacunacion ${vacunacionSeleccionado.ID}`,
          {
            position: "top-right",
          }
        );
      });
  };

  const seleccionarvacunacion = (vacunacion, caso) => {
    setvacunacionSeleccionado(vacunacion);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    setvacunacionSeleccionado("");
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
        <h3>Nueva vacunacion</h3>
        <div className="bottom">
          <div className="right"></div>
        </div>
        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="demo-simple-select-helper-label">centroID</InputLabel>
          <Select
            defaultValue={""}
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            name="centroID"
            label="centroID"
            onChange={handleChange}
            {...register("centroID", {
              required: "Campo requerido",
            })}
          >
            <MenuItem value={0}>Activo</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="demo-simple-select-helper-label">
            vacunadorID
          </InputLabel>
          <Select
            defaultValue={""}
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            name="vacunadorID"
            label="vacunadorID"
            onChange={handleChange}
            {...register("vacunadorID", {
              required: "Campo requerido",
            })}
          >
            <MenuItem value={0}>Activo</MenuItem>
            <MenuItem value={1}>Inactivo</MenuItem>
          </Select>
        </FormControl>
        <br />
        <br />
        <FormControl sx={{ m: 1, minWIDth: 150 }}>
          <InputLabel ID="demo-simple-select-helper-label">vacunaID</InputLabel>
          <Select
            defaultValue={""}
            labelID="demo-simple-select-helper-label"
            ID="demo-simple-select-helper"
            name="vacunaID"
            label="vacunaID"
            onChange={handleChange}
            {...register("vacunaID", {
              required: "Campo requerIDo",
            })}
          >
            <MenuItem value={0}>Activo</MenuItem>
            <MenuItem value={1}>Inactivo</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl sx={{ m: 1, minWIDth: 150 }}>
          <InputLabel ID="demo-simple-select-helper-label">
            pacienteID
          </InputLabel>
          <Select
            defaultValue={""}
            labelID="demo-simple-select-helper-label"
            ID="demo-simple-select-helper"
            name="pacienteID"
            label="pacienteID"
            onChange={handleChange}
            {...register("pacienteID", {
              required: "Campo requerIDo",
            })}
          >
            <MenuItem value={0}>Activo</MenuItem>
            <MenuItem value={1}>Inactivo</MenuItem>
          </Select>
        </FormControl>
        <br />
        <TextField
          className={styles.inputMaterial}
          label="vacunadorID"
          name="vacunadorID"
          onChange={handleChange}
          {...register("vacunadorID", {
            required: "Campo requerIDo",
            pattern: {
              value: /^[a-z\d\-_\s]+$/i,
              message: "vacunadorID no valIDa",
            },
          })}
          error={!!errors?.vacunadorID}
          helperText={errors?.vacunadorID ? errors.vacunadorID.message : null}
        />
        <br />
        <TextField
          className={styles.inputMaterial}
          label="vacunadorID"
          name="vacunadorID"
          onChange={handleChange}
          {...register("vacunadorID", {
            required: "Campo requerIDo",
            pattern: {
              value: /^[a-z\d\-_\s]+$/i,
              message: "vacunadorID no valIDa",
            },
          })}
          error={!!errors?.vacunadorID}
          helperText={errors?.vacunadorID ? errors.vacunadorID.message : null}
        />
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
      <h2>Editar vacunacion</h2>
      <div className={styles.inputMaterial}>
        <div className="details">
          <h1 className="itemTitle">
            {vacunacionSeleccionado && vacunacionSeleccionado.ID}
          </h1>
          <div className="detailItem">
            <span className="itemKey">centroID: </span>
            <span className="itemValue">
              {vacunacionSeleccionado && vacunacionSeleccionado.centroID}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">vacunadorID: </span>
            <span className="itemValue">
              {vacunacionSeleccionado && vacunacionSeleccionado.vacunadorID}
            </span>
          </div>
          <div className="detailItem">
            <span className="itemKey">vacunaID:</span>
            <span className="itemValue">
              {" "}
              {vacunacionSeleccionado && vacunacionSeleccionado.vacunaID === 0
                ? "Activo"
                : "Inactivo"}
            </span>
          </div>
          <br />
        </div>
      </div>
      <TextField
        className={styles.inputMaterial}
        label="centroID"
        name="centroID"
        onChange={handleChange}
        value={vacunacionSeleccionado && vacunacionSeleccionado.centroID}
      />
      <br />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="vacunadorID"
        name="vacunadorID"
        onChange={handleChange}
        value={vacunacionSeleccionado && vacunacionSeleccionado.vacunadorID}
      />
      <br />
      <br />
      <FormControl sx={{ m: 1, minWIDth: 150 }}>
        <InputLabel ID="demo-simple-select-helper-label">vacunaID</InputLabel>
        <Select
          defaultValue={""}
          labelID="demo-simple-select-helper-label"
          ID="demo-simple-select-helper"
          name="vacunaID"
          label="vacunaID"
          onChange={handleChange}
        >
          <MenuItem value={0}>Activo</MenuItem>
          <MenuItem value={1}>Inactivo</MenuItem>
        </Select>
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
        Estás seguro que deseas eliminar al vacunacion{" "}
        <b>{vacunacionSeleccionado && vacunacionSeleccionado.centroIDs}</b>?{" "}
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
        ID="botonInsertarvacunacion"
        variant="contained"
        className={styles.botonInsertarvacunacion}
        onClick={() => abrirCerrarModalInsertar()}
      >
        Agregar Nuevo vacunacion
      </Button>

      <br />
      <br />
      <MaterialTable
        columns={columns}
        data={data}
        title="vacunacions de Vacunación"
        actions={[
          {
            icon: () => <PrintIcon />,
            tooltip: "Export to Pdf",
            onClick: () => exportToPdf(),
            isFreeAction: true,
          },

          {
            icon: Edit,
            tooltip: "Editar vacunacion",
            onClick: (event, rowData) =>
              seleccionarvacunacion(rowData, "Editar"),
          },
          {
            icon: Delete,
            tooltip: "Eliminar vacunacion",
            onClick: (event, rowData) =>
              seleccionarvacunacion(rowData, "Eliminar"),
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
