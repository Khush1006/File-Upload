import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Files.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const Files = () => {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFile(file);
    const allowedExtensions =
      /(\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd)$/i;

    if (!allowedExtensions.exec(file.name)) {
      alert("Invalid file type");
      e.target.value = "";
      setFile(null);
      return;
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      let data = new FormData();
      data.append("image", file);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      axios
        .post("http://localhost:5500/uploadPhoto", data, config)
        .then((res) => {
          console.log("Data post");
        })
        .catch((err) => {
          console.log(err);
          alert("failed", err);
        });

      axios
        .get("http://localhost:5500/getFiles", data, config)
        .then((res) => {
          const UploadedFile = {
            name: file.name,
            url: URL.createObjectURL(file),
          };
          console.log("Data Get");
          setTableData((previousFile) => [UploadedFile, ...previousFile]);
        })
        .catch((err) => {
          alert("error", err);
        });
      setFile(null);
      fileInputRef.current.value = null;
    } else {
      alert("Please choose a file !");
    }
  };
  const handleViewFile = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="main-file">
      <h3>Upload File</h3>
      <form onSubmit={handleSubmit}>
        <input
          ref={fileInputRef}
          id="file"
          name="file"
          type="file"
          onChange={handleFileUpload}
        />
        <button className="btn" type="submit">
          Upload
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>View File</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((file, index) => (
            <tr key={index}>
              <td>
                <button
                  className="viewBtn"
                  onClick={() => handleViewFile(file.url)}
                >
                  {file.name}
                </button>
              </td>
              <td>
                <a href={file.url} download>
                  <FontAwesomeIcon
                    icon={faDownload}
                    style={{ color: "#1a62aa" }}
                  />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Files;
