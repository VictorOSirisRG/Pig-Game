import React from "react";
import Sidebar from "../../components/Sidebar.jsx/Sidebar";
import { useForm } from "react-hook-form";
import API from "../../utils/api";
// import Navbar from "../../components/Navbar.jsx/Navbar";
import { TextField, Button, Modal, Box } from "@material-ui/core";
import { useState} from "react";
import "./Perfil.scss";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";

import { getUser, setUserData } from "../../utils/common";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      width: "30ch",
    },
  },
  botonInsertarCentro: {
    backgroundColor: "#44c1c9",
    top: "50%",
    left: "0%",
    width: "34ch",
    height: "6ch",
    margin: "2ch",
  },
  botonCambiarContrasena: {
    backgroundColor: "#E1EB0E",
    top: "50%",
    left: "0%",
    width: "34ch",
    height: "6ch",
    margin: "2ch",
  },
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  inputMaterial: {
    width: "100%",
  },
  divv: {
    paddingTop: "8ch",
  },
  colors: {
    color: "red",
  },
}));

const Perfil = () => {
  const classes = useStyles();
  // const [file, setFile] = useState("");
  const [modalInsertar, setModalInsertar] = useState(false);

  // const [pass, setPass] = useState({
  //   email: getUser().email,
  //   password: "",
  //   newPasword: "",
  // });
  const [perfilSeleccionado, setPerfilSeleccionado] = useState({
    nombre: getUser().nombre,
    apellido: getUser().apellido,
    id: getUser().id,
    email: getUser().email,
    roles: [getUser().roles[0]],
    nombreCompleto: getUser().nombreCompleto,
    jwToken: getUser().jwToken,
    isVerified: true,
    estado: getUser().estado,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfilSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    passChange(data);
  };

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    reset();
  };

  const bodyInsertar = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.modal}>
        <h3>Cambiar Contraseña</h3>
        <div className="bottom">
          <div className="right"></div>
        </div>
        <Box mb={8}>
          <TextField
            className={classes.inputMaterial}
            label="Contraseña Anterior"
            name="passwordAnterior"
            type="password"
            autoComplete="off"
            {...register("passwordAnterior", {
              required: "Campo requerido",
            })}
            error={!!errors?.passwordAnterior}
            helperText={
              errors?.passwordAnterior ? errors.passwordAnterior.message : null
            }
          />
          <br />
          <TextField
            className={classes.inputMaterial}
            label="Nueva Contraseña"
            name="nuevaPassword"
            type="password"
            autoComplete="off"
            {...register("nuevaPassword", {
              required: "Campo requerido",
              pattern: {
                value: /^[A-Za-z0-9]{8,50}$/,
                message: "Requiere mínimo 8 caracteres",
              },
            })}
            error={!!errors?.nuevaPassword}
            helperText={
              errors?.nuevaPassword ? errors.nuevaPassword.message : null
            }
          />
          <br />
          <TextField
            className={classes.inputMaterial}
            label="Confirmar nueva contraseña"
            name="confirmPassword"
            type="password"
            autoComplete="off"
            {...register("confirmPassword", {
              required: "Campo requerido",
              pattern: {
                value: /^[A-Za-z0-9]{8,50}$/,
                message: "Requiere mínimo 8 caracteres",
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
            Guardar
          </Button>
          <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
        </div>
      </div>
    </form>
  );

  const peticionPut = () => {
    API.putData("Usuarios/updateProfile/" + getUser().id, perfilSeleccionado)
      .then((res) => {
        if (res.status === 200) {
          toast.success(`¡Se ha actualizado tu Perfil!`, {
            position: "top-right",
          });
          localStorage.removeItem("userData");
          setUserData(perfilSeleccionado);
          setTimeout(() => {
            window.location.reload(true);
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("Error de conexion " + err);
        toast.error(`¡ERROR! No se pudo actualizar el perfil`, {
          position: "top-right",
        });
      });
  };

  const passChange = (data) => {
    API.putData("Usuarios/changePassword/" + getUser().email, data)
      .then((res) => {
        if (res.status === 200) {
          toast.success(`¡Se ha actualizado tu Contraseña!`, {
            position: "top-right",
          });
        }
        setModalInsertar(!modalInsertar);
      })
      .catch((err) => {
        console.error("Error de conexion " + err);
        console.log(err);
        console.log(data);
        toast.error(`¡ERROR! Contraseña Incorrecta`, {
          position: "top-right",
        });
      });
  };
  // console.log(perfilSeleccionado);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        {/* <Navbar /> */}
        <div className="top">
          <h1 className={classes.colors}>
            Bienvenido al sistema de registro de vacunaciónes
          </h1>
        </div>
        <div div className="top">
          <img
            width="400"
            height="400"
            src={"https://cdn-icons-png.flaticon.com/512/3524/3524752.png"}
            alt=""
          />

          <form className={classes.root}>
            <div className={classes.divv}>
              <TextField
                id="outlined-helperText"
                name="nombre"
                label="Nombre"
                variant="outlined"
                value={perfilSeleccionado && perfilSeleccionado.nombre}
                onChange={handleChange}
              />

              <TextField
                id="outlined-helperText"
                name="apellido"
                label="Apellido"
                variant="outlined"
                value={perfilSeleccionado && perfilSeleccionado.apellido}
                onChange={handleChange}
              />
            </div>
            <div>
              <TextField
                id="outlined-helperText"
                name="email"
                label="Email"
                variant="outlined"
                value={perfilSeleccionado && perfilSeleccionado.email}
                onChange={handleChange}
              />

              <TextField
                id="outlined-helperText"
                name="rol"
                label="Rol"
                variant="outlined"
                value={perfilSeleccionado && perfilSeleccionado.roles[0]}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div>
              <Button
                variant="contained"
                className={classes.botonCambiarContrasena}
                onClick={() => abrirCerrarModalInsertar()}
              >
                Cambiar Contraseña
              </Button>
              <Button
                id="botonInsertarCentro"
                variant="contained"
                className={classes.botonInsertarCentro}
                onClick={() => peticionPut()}
              >
                Editar Usuario
              </Button>
            </div>
          </form>
        </div>
        <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
          {bodyInsertar}
        </Modal>
      </div>
    </div>
  );
};

export default Perfil;
