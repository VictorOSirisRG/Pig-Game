import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../../utils/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PasswordReset.css";

function PasswordReset() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/login";
  const [loading, setLoading] = useState(false);
  const userRef = useRef();
  const [error, setError] = useState(null);
  const [emailval, setemailval] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await API.postData("Usuarios/passwordRecovery", { email: emailval }
      ).then((response) => {
        setLoading(false);
        toast.success(response.data.message, {
          position: "top-right",
        });
        navigate(from, { replace: true });
      });
    } catch (error) {
      setLoading(false);
      if (error.response.status === 404) {
        setError("Error: Error de Conexión");
      }
      else if (error.response.status === 400) {
        toast.error(error.response.data.Message, {
          position: "top-right",
        });
        setemailval("");
        setError(error.response.data.errors.Email[0]);
        document.getElementById("correo").focus();
      }
      else {
        setemailval("");
        toast.error("¡Error de conexion, vuelva más tarde!", {
          position: "top-right",
        });
      }
    }
  };
  return (
    <div className="fill-window-recover">
      <div className="main-recover">
        <div className="recover-contain">
          <div className="left-side">
            <h3 id="titulo"> Recuperar Contraseña</h3>
            <form onSubmit={handlesubmit}>
              <label htmlFor="¨correo">Correo Electrónico</label>
              <input
                ref={userRef}
                placeholder="Introduce tu correo electrónico"
                type="text"
                value={emailval}
                onChange={(e) => {
                  setemailval(e.target.value);
                }}
                id="correo"
                required
              />
              {error && (
                <>
                  <small style={{ color: "red" }}>{error}</small>
                </>
              )}
              <button
                to="Home"
                type="submit"
                id="sub_butt"
                disabled={loading}>
                {loading ? <Spinner animation="border" /> : "Enviar Correo"}
              </button>

            </form>
            <span></span>
            <Link to="/login" className="link">
              Volver al login
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
