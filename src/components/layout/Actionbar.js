import { Container, Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Actionbar = (props) => {
  return (
    <Navbar bg="blue" expand="lg" className="rounded action-bar headertextsize">
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/dashboard" className="nav-link text-light">
              <FontAwesomeIcon icon="fa-solid fa-house" /> Home{" "}
              <FontAwesomeIcon icon="fa-solid fa-chevron-right" />{" "}
              {props.pageTitle}
            </NavLink>
          </Nav>

          <Nav className="ms-auto">{props.children}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Actionbar;
