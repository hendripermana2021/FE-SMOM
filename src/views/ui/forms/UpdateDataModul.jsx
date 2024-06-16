import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Import draftjs-to-html for converting EditorState to HTML
import htmlToDraft from "html-to-draftjs"; // Import html-to-draftjs for converting HTML to EditorState
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import Swal from "sweetalert2";
import serverDev from "../../../Server";
import PropTypes from "prop-types";

const UpdateDataModul = ({ modul }) => {
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (modul) {
      setTitle(modul.title);

      // Convert HTML content to EditorState
      const blocksFromHtml = htmlToDraft(modul.content);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [modul]);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  const updateHandler = async (e) => {
    e.preventDefault();

    try {
      const contentState = editorState.getCurrentContent();
      const contentHtml = draftToHtml(convertToRaw(contentState)); // Convert EditorState to HTML

      const response = await axios.put(
        `${serverDev}modul/update/${modul.id}`,
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

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Data Berhasil Diperbarui",
        });
        handleClose(); // Close modal after successful submission
      } else {
        throw new Error("Failed to update modul");
      }
    } catch (error) {
      console.error("Error while updating:", error);
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
  }

  return (
    <>
      <button className="dropdown-item" onClick={() => handleShow(true)}>
        <i className="ti-info menu-icon me-2" />
        Update Modul
      </button>
      <Modal
        show={show}
        fullscreen={fullscreen}
        animation={false}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Modul</Modal.Title>
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
          <Button variant="primary" onClick={updateHandler}>
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateDataModul.propTypes = {
  modul: PropTypes.object.isRequired,
};

export default UpdateDataModul;
