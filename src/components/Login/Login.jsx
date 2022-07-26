import React, { useState, useRef } from "react";
import "./Login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo2 from "./logo2.png";
import API from "../../utils/api";
import { setUserSession} from "../../utils/common";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [emailval, setemailval] = useState("");
  const [passval, setpassval] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [loading, setLoading] = useState(false);
  const userRef = useRef();
  const [error, setError] = useState(null);

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await API.postData(
        "Auth/login",
        { email: emailval, password: passval },
        {
          headers: { "Content-Type": "application/json" },
        }
      ).then((response) => {
        setLoading(false);
        setUserSession(
          response.data.data.jwToken,
          response.data.data,
          response.data.data.roles[0]
        );
        navigate(from, { replace: true });
        window.location.reload(true);
        
      });
    } catch (error) {
      setLoading(false);
      if (error.response === 500) {
        setError("Error: Error de Conexión");

      } else if (error.response.status === 400) {
        setemailval("");
        setpassval("");
        setError("¡Verifique usuario y/o contraseña!");
        document.getElementById("email").focus();

      } else if (error.response.status === 404) {
        setemailval("");
        setpassval("");
        toast.error(error.response.data.Message, {
          position: "top-right",
        });
      }
      else {
        toast.error("¡Error de conexion, vuelva más tarde!", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <div className="fill-window">
      <div className="main-login">
        <div className="login-contain">
          <div className="left-side">
            {/* <div className="horizontal">
              <Link to="LoginAdmin">
                <button to="LoginAdmin" type="submit" className="nav_button">
                  Admin
                </button>
              </Link>
              <button to="/" type="submit" className="nav_button color">
                Pacientes
              </button>
            </div> */}

            <h2>Inicio de Sesión</h2>
            <div className="img-class">
              <img src={logo2} alt="logo de la empresa" srcSet="" id="img-id" />
            </div>
            <form onSubmit={handlesubmit}>
              <label for="correo" id="co">
                Correo Electrónico
              </label>
              <input
                ref={userRef}
                placeholder="Introduce tu Correo Electronico"
                type="text"
                value={emailval}
                onChange={(e) => {
                  setemailval(e.target.value);
                }}
                id="email"
                required
              />
              <label for="contraseña" id="co">
                Contraseña
              </label>
              <input
                placeholder="Introduce la contraseña"
                type="password"
                value={passval}
                onChange={(e) => {
                  setpassval(e.target.value);
                }}
                id="contraseña"
                required
              />
              <span>
                <Link to="/PasswordReset" className="link">
                  Recuperar Contraseña?
                </Link>
              </span>

              {error && (
                <>
                  <br />
                  <small style={{ color: "red" }}>{error}</small>
                </>
              )}
              <br />
              <button
                className="btn btn-success"
                to="Home"
                type="submit"
                id="sub_butt"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" /> : "Iniciar Sesion"}
              </button>
            </form>
            <div className="footer">
              <h6 id="registrate">
                No tienes una cuenta?{" "}
                <Link to="/Register" className="link">
                  Registrate
                </Link>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
