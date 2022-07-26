import React from "react";
import { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import "./Register.css";
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

function Register1() {
  const [usuarioBasicoSeleccionado, setusuarioBasicoSeleccionado] = useState({
    nombre: "",
    apellido: "",
    id: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [data, setData] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    peticionPost(data);
    reset();
  };

  const peticionPost = (data) => {
    API.postData("Usuarios/registerBasic", data)
      .then((response) => {
        // setModalInsertar(!modalInsertar);
        setData(...(data + response.data.usuario));
        toast.success("¡Se ha creado un nuevo usuario!", {
          position: "top-right",
        });
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
    <div className="main-Register">
      <div className="right-side">
        <div className="body-right">
          <div className="container">
            <h3 id="titulo">
              Registro de usuario
              </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group text-group">
                {/* <h5> Last Name</h5> */}
                <TextField
                  className="text-group"
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  InputProps={{ disableUnderline: true }}
                  {...register("nombre", {
                    required: "Required field",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Invalid nombre ",
                    },
                  })}
                  onChange={handleChange}
                  error={!!errors?.nombre}
                  helperText={errors?.nombre ? errors.nombre.message : null}
                />
              </div>

              <div className="input-group">
                <TextField
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  InputProps={{ disableUnderline: true }}
                  {...register("apellido", {
                    required: "Required field",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Invalid apellido ",
                    },
                  })}
                  error={!!errors?.apellido}
                  helperText={errors?.apellido ? errors.apellido.message : null}
                  onChange={handleChange}
                  id="apellido"
                />
              </div>
              <div className="input-group">
                {/* <h5> Email</h5> */}
                <TextField
                  type="Email"
                  name="email"
                  placeholder="Email"
                  InputProps={{ disableUnderline: true }}
                  {...register("email", {
                    required: "Required field",
                    pattern: {
                      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                      message: "Invalid email ",
                    },
                  })}
                  error={!!errors?.email}
                  helperText={errors?.email ? errors.email.message : null}
                  onChange={handleChange}
                  id="email"
                />
              </div>
              <div className="input-group">
                <TextField
                  type="password"
                  placeholder="Password"
                  InputProps={{ disableUnderline: true }}
                  onChange={handleChange}
                  name="password"
                  id="password"
                  {...register("password", {
                    required: "Required field",
                    pattern: {
                      message: "Invalid password ",
                    },
                  })}
                />
              </div>
              <div className="input-group">
                <TextField
                  type="password"
                  placeholder="Confirm Password"
                  InputProps={{ disableUnderline: true }}
                  onChange={handleChange}
                  name="confirmPassword"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Required field",
                    pattern: {
                      message: "Invalid Confirmation ",
                    },
                  })}
                />
              </div>
              <button type="submit" id="sbtn">Registrar</button>
              <p>
                Ya tienes una cuenta?
                <Link id="Links-signin" to="/">
                  iniciar Sesión
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register1;
