import { Container, Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import {  Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TopNavigation = () => {
  let navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) ?? {};

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="white" expand="lg" className="border-bottom">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="text-primary">
          <Image
            src="/logo.png"
            height="30"
            placeholder="logo"
            title="logo"
            className="d-inline-block align-top"
            alt="Pharmacy logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto my-2 my-lg-0">
            

            {/* {(user.role === "STORE" || user.role === "ADMINISTRATOR") && ( */}
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-store"
                      className="text-primary"
                    />{" "}
                    Purchase
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/inventoryreceive"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Purchase
                </NavDropdown.Item>
                               

              </NavDropdown>
            {/* )} */}

            {/* {(user.role === "STORE" || user.role === "ADMINISTRATOR") && ( */}
            <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-store"
                      className="text-primary"
                    />{" "}
                    Sells
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/sells"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Sells
                </NavDropdown.Item>
               
              </NavDropdown>
            {/* )} */}

           
            {/* {(user.role === "ACCOUNTS" || user.role === "ADMINISTRATOR") && ( */}
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-coins"
                      className="text-primary"
                    />{" "}
                    Accounts
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/parentaccount"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Account Head
                </NavDropdown.Item>
                
               
              </NavDropdown>
            {/* )} */}



            {/* {(user.role === "ADMINISTRATOR" ||
              user.role === "ADMINISTRATOR") && ( */}
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-sliders"
                      className="text-primary"
                    />{" "}
                    Settings
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/usersetup"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  User
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/brand"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Brand
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/country"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Country
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/productGroup"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Product Group
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/store"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Store
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/product"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Product Setup
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/generics"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Generics
                </NavDropdown.Item>
              
              
               
               
                <NavDropdown.Item
                  as={Link}
                  to="/supplier"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Supplier
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/manufacturer"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Manufacturer
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={Link}
                  to="/category"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Category
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/unitsetup"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Unit
                </NavDropdown.Item>
              </NavDropdown>
            {/* )} */}
          </Nav>

          <Nav>
            <NavDropdown
              title={
                <>
                  <FontAwesomeIcon
                    icon="fa-regular fa-user"
                    className="text-primary"
                  />{" "} 
                  <span>{user?.fullName}</span>
                </>
              }
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item className="text-center">
                {user?.fullName} <br />
                <b>@{user?.userName}</b> <br />
                {user?.phoneNumber}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/changepassword">
                Change Password
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logOut}>Log Out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavigation;
