import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Import draftjs-to-html for converting EditorState to HTML
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import Swal from "sweetalert2";
import serverDev from "../../../Server";

const FormInputModal = () => {
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  const createHandler = async (e) => {
    e.preventDefault();

    try {
      const contentState = editorState.getCurrentContent();
      const contentHtml = draftToHtml(convertToRaw(contentState)); // Convert EditorState to HTML

      const response = await axios.post(
        `${serverDev}modul/add`,
        {
          title: title,
          content: contentHtml, // Send HTML content to backend
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Data Berhasil Ditambahkan",
        });
        handleClose(); // Close modal after successful submission
      } else {
        throw new Error("Failed to add modul");
      }
    } catch (error) {
      console.error("Error while saving:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response ? error.response.data.message : "Network Error",
      });
    }
  };

  function onEditorStateChange(newEditorState) {
    setEditorState(newEditorState);
  }

  function handleClose() {
    setShow(false);
    setTitle("");
    setEditorState(EditorState.createEmpty()); // Clear editor state after save
  }

  return (
    <>
      <Button variant="outline-primary" onClick={() => handleShow(true)}>
        Tambah Modul
      </Button>
      <Modal
        show={show}
        fullscreen={fullscreen}
        animation={false}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Modul Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formTitle">
            <Form.Label>Judul Modul</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan judul modul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <br />
          <br />
          <Form.Group controlId="formContent">
            <Form.Label>Konten Modul</Form.Label>
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={createHandler}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FormInputModal;
