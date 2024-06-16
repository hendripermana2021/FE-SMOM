import { Button, Nav, NavItem } from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import "../assets/scss/style.scss";

const navigation = [
  {
    title: "Dashboard",
    href: "/starter",
    icon: "bi bi-layout-split",
  },
  {
    title: "Daftar Modul",
    href: "/modul",
    icon: "bi bi-book",
  },
  {
    title: "Daftar Siswa",
    href: "/siswa",
    icon: "bi bi-people",
  },
  {
    title: "Daftar Guru",
    href: "/guru",
    icon: "bi bi-person-add",
  },
  {
    title: "Content",
    href: "/buttons",
    icon: "bi bi-patch-check",
  },
];

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <span className="ms-auto d-lg-none">
          <Button
            close
            size="sm"
            className="ms-auto d-lg-none"
            onClick={() => showMobilemenu()}
          ></Button>
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "text-primary nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
