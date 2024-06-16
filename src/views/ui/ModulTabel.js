import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";

import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import $ from "jquery";
import "jquery/dist/jquery.min.js";
import serverDev from "../../Server";

import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "react-bootstrap";
import FormInputModal from "./forms/FormInputModul";
import UpdateDataModul from "./forms/UpdateDataModul";

const ModulTables = () => {
  const [Modul, setModul] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable("#tablemodul")) {
      $(document).ready(function () {
        const tableInterval = setInterval(() => {
          if ($("#tablemodul").is(":visible")) {
            clearInterval(tableInterval);
            $("#tablemodul").DataTable();
          }
        }, 1000);
      });
    }

    getModul();
  }, []);

  const getModul = async () => {
    try {
      const response = await axios.get(`${serverDev}modul`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setModul(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching room data:", error);
      setLoading(false);
    }
  };

  const deleteModul = async (modul) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios
            .delete(`${serverDev}modul/delete/${modul.id}`, {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  "accessToken"
                )}`,
              },
            })
            .then(() => {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              getModul();
            });
        } catch (error) {
          console.error("Error deleting room data:", error);
          console.log(modul.id);
          Swal.fire("Error!", "Your file has not been deleted.", "error");
        }
      }
    });
  };

  return (
    <div>
      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i className="bi bi-bell me-2"> </i>
          Tabel Modul
        </CardTitle>
        <CardBody>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Jumlah Modul
          </CardSubtitle>
          <FormInputModal />
          <Table className="table table-hover" id="tablemodul">
            <thead>
              <tr>
                <th>No</th>
                <th>Title</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              ) : Modul.length === 0 ? (
                <tr>
                  <td colSpan="4">No Modul available</td>
                </tr>
              ) : (
                Modul.map((Moduls, index) => (
                  <tr key={index}>
                    <td>U {index + 1}</td>
                    <td>{Moduls.title}</td>
                    <td>
                      {Moduls.status_post === "active" ? (
                        <Badge bg="success">{Moduls.status_post}</Badge>
                      ) : (
                        Moduls.status_post ===
                        "unactive"(
                          <Badge bg="danger">{Moduls.status_post}</Badge>
                        )
                      )}
                    </td>
                    <td>
                      <DropdownButton
                        as={ButtonGroup}
                        key="end"
                        id="dropdown-button-drop-end"
                        drop="end"
                        variant="secondary"
                      >
                        {/* <DetailFormEmployee emp={Moduls} /> */}
                        <UpdateDataModul modul={Moduls} />

                        <button
                          className="dropdown-item"
                          onClick={() => deleteModul(Moduls)}
                        >
                          <i className="ti-trash menu-icon me-2" />
                          Delete
                        </button>
                      </DropdownButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ModulTables;