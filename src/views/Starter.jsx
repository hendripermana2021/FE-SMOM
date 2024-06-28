import { Col, Row } from "reactstrap";

import ModulTables from "./ui/ModulTabel.js";
import TopCards from "../components/dashboard/TopCards.js";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import serverDev from "../Server.js";

const Starter = () => {
  const [data, setData] = useState([]);
  const token = sessionStorage.getItem("accessToken");
  const [dashboard, setDashboard] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // navigate
      navigate("/login");
    } else {
      const decode = jwtDecode(token);
      console.log(decode.role_id);
      setData(decode.role_id);
      getDashboard();
    }
  }, [token, navigate]);

  const getDashboard = async () => {
    try {
      const response = await axios.get(`${serverDev}dashboard`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setDashboard(response.data.data);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };

  return (
    <div>
      {/***Top Cards***/}
      <Row>
        {data == 1 ? (
          <>
            <Col sm="6" lg="3">
              <TopCards
                bg="bg-light-success text-success"
                title="Jumlah Siswa"
                subtitle="Jumlah Siswa"
                earning={dashboard.siswaCount}
                icon="bi bi-people"
              />
            </Col>
            <Col sm="6" lg="3">
              <TopCards
                bg="bg-light-danger text-danger"
                title="Jumlah Modul"
                subtitle="Jumlah Modul"
                earning={dashboard.modulCount}
                icon="bi bi-coin"
              />
            </Col>
            <Col sm="6" lg="3">
              <TopCards
                bg="bg-light-warning text-warning"
                title="Kelas"
                subtitle="Kelas Diampuh"
                earning={dashboard.kelasCount}
                icon="bi bi-basket3"
              />
            </Col>
            <Col sm="6" lg="3">
              <TopCards
                bg="bg-light-info text-into"
                title="Guru"
                subtitle="Jumlah Guru"
                earning={dashboard.guruCount}
                icon="bi bi-bag"
              />
            </Col>
          </>
        ) : (
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-danger text-danger"
              title="Jumlah Modul"
              subtitle="Jumlah Modul"
              earning={dashboard.modulCount}
              icon="bi bi-coin"
            />
          </Col>
        )}
      </Row>

      {/***Table ***/}
      <Row>
        <Col lg="12">
          <ModulTables />
        </Col>
      </Row>
      {/***Blog Cards***/}
      {/* <Row>
        {BlogData.map((blg, index) => (
          <Col sm="6" lg="6" xl="3" key={index}>
            <Blog
              image={blg.image}
              title={blg.title}
              subtitle={blg.subtitle}
              text={blg.description}
              color={blg.btnbg}
            />
          </Col>
        ))}
      </Row> */}
    </div>
  );
};

export default Starter;
