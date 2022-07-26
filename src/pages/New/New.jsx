import "./New.scss";
import Sidebar from "../../components/Sidebar.jsx/Sidebar";
import Navbar from "../../components/Navbar.jsx/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { TextField } from "@mui/material";
import { useState } from "react";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              <TextField
                id="standard-basic"
                label="Nombre"
                variant="standard"
                className="formInput"
              />
              <TextField
                id="standard-basic"
                label="Apellido"
                variant="standard"
                className="formInput"
              />
              <TextField
                id="standard-basic"
                label="Cedula"
                variant="standard"
                className="formInput"
              />
              <TextField
                id="standard-basic"
                label="Fecha de Nacimiento"
                variant="standard"
                className="formInput"
              />
              <TextField
                id="standard-basic"
                label="Direccion"
                variant="standard"
                className="formInput"
              />

              <button>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
