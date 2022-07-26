import React from "react";
import { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import logo2 from "../Register/logo2.png";
import { useForm } from "react-hook-form";
import API from "../../utils/api";
import { toast } from "react-toastify";

import {
  Modal,
  TextField,
  Button,
  Select,
  InputLabel,
  MenuItem,
  Input,
} from "@material-ui/core";

function Register() {
  const [usuarioBasicoSeleccionado, setusuarioBasicoSeleccionado] = useState({
    nombre: "",
    apellido: "",
    id: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const state = {
    errors: {
      nombre: "Campo obligatorio",
    },
  };
  const [data, setData] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const limpiarCampos = function () {
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
  };

  const onSubmit = (data) => {
    console.log("Estos es la data ", usuarioBasicoSeleccionado);
    peticionPost(usuarioBasicoSeleccionado);
  };

  const peticionPost = (data) => {
    API.postData("Usuarios/registerBasic", usuarioBasicoSeleccionado)
      .then((response) => {
        // setModalInsertar(!modalInsertar);
        setData(...(data + response.data.usuario));
        toast.success("¡Se ha creado un nuevo usuario!", {
          position: "top-right",
        });
        limpiarCampos();
      })

      .catch((error) => {
        console.log(error);
        console.log("objeto", usuarioBasicoSeleccionado);
        if (usuarioBasicoSeleccionado.apellido === "") {
          toast.warning("¡Todos los campos deben ser llenados!", {
            position: "top-right",
          });
        } else {
          toast.error("¡ERROR! No se pudo registrar el usuario", {
            position: "top-right",
          });
        }
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setusuarioBasicoSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div className="fill-window-recover">
      <div className="main-recover">
        <div className="recover-contain">
          <div className="left-side">
            <h3 id="titulo"> Registro de Usuario</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                name="nombre"
                id="nombre"
                {...register("nombre", {
                  required: "Campo requerido",
                  pattern: {
                    value: /^[a-zA-Z\s]*$/,
                    message: "Nombre no valido",
                  },
                  minLength: {
                    value: 6,
                    message: "Nombre de usuario debe tener 3 caracteres minimo",
                  },
                  maxLength: {
                    value: 30,
                    message: "Username must be atmost 30 characters long...",
                  },
                })}
                error={!!errors?.nombre}
                helperText={errors?.nombre ? errors.nombre.message : null}
                placeholder="Introducir Nombre "
                onChange={handleChange}
              />
              <p style={({ color: "red" }, { fontSize: 10 })}>
                {errors.nombre?.message}
              </p>

              <input
                name="apellido"
                id="apellido"
                {...register("apellido", {
                  required: "Campo requerido",
                  pattern: {
                    value: /^[a-zA-Z\s]*$/,
                    message: "apellido no valido",
                  },
                  minLength: {
                    value: 3,
                    message: "Apellido debe contener minimo 3 caracteres",
                  },
                  maxLength: {
                    value: 30,
                    message: "Apellido debe contener maximo 30 caracteres",
                  },
                })}
                error={!!errors?.apellido}
                helperText={errors?.apellido ? errors.apellido.message : null}
                placeholder="Introducir Apellido "
                onChange={handleChange}
              />
              <p>{errors.apellido?.message}</p>

              <input
                name="email"
                id="email"
                {...register("email", {
                  required: "Campo requerido",
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                    message: "Email invalido",
                  },
                })}
                onChange={handleChange}
                error={errors.email?.message}
                helperText={errors.email?.message}
                placeholder="Introducir Email"
              />
              <p>{errors.email?.message}</p>
              <input
                type="password"
                name="password"
                id="password"
                {...register("password", {
                  required: "Contraseña is Required...",
                  pattern: {
                    value:
                      /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{8,16}$/,
                    message:
                      "La contraseña debe tener minimo 8 caracteres, Una en Mayuscula, Una en minuscula, Un numero y un caracter special",
                  },
                })}
                placeholder="Contraseña"
                onChange={handleChange}
              />
              <p>{errors.password?.message}</p>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                {...register("confirmPassword", {
                  required: "Contraseña is Required...",
                  pattern: {
                    value:
                      /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{8,16}$/,
                    message:
                      "La contraseña debe tener minimo 8 caracteres, Una en Mayuscula, Una en minuscula, Un numero y un caracter special",
                  },
                })}
                placeholder="Confirmar Contraseña"
                onChange={handleChange}
              />
              <p>{errors.confirmPassword?.message}</p>
              {/* {error && (
              <>
                <small style={{ color: "red" }}>{error}</small>
              </>
            )} */}
              <button type="submit" id="sub_butt">
                Guardar
              </button>
              <br />
              <br />
              <h6 id="registrate">
                Ya estas registrado, pues inicia sesión.{" "}
                <Link to="/" className="link" id="iniciar_sesion">
                  Iniciar Sesión
                </Link>
              </h6>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
