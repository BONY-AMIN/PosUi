import {
  Card,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Spinner,
  Table,
  Nav,
  Offcanvas,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, createRef, Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Role } from "../../components/DropDown";
import Actionbar from "../../components/layout/Actionbar";
import useGetAll from "../../components/hooks/useGetAll";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const UserConfig = () => {
  const [user, setUser] = useState({Roles:['']});
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [res] = useGetAll("Account/GetAllUsers?", searchCriteria, toggle);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleRowClick = (item) => {
    setUser(item);
  };

  const handleClose = () => {
    setShowCanvas(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setUser({ ...user, [name]: value });
  };

  const saveUser = async (e) => {
    console.log(user);
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const methodType = user.id ? "PUT" : "POST";
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "Auth/Register", {
      method: methodType,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toast.success("Data Added Successfuly", {
            position: "bottom-right",
          });
        } else {
          toast.error(response.statusText + "(" + response.status + ")", {
            position: "bottom-right",
          });
        }
        setValidated(false);
        setLoading(false);
        setToggle(!toggle);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const headers = [
    { label: "FullName", key: "FullName" },
    { label: "User Name", key: "UserName" },
    { label: "Email", key: "Email" },
    { label: "PhoneNumber", key: "PhoneNumber" },
    { label: "Roles", key: "Roles" },
  ];

  const filteredData = res.data.filter((el) => {
    if (searchText === "") {
      return el;
    } else {
      return (
        el.FullName.toLowerCase().includes(searchText) ||
        el.UserName.toLowerCase().includes(searchText) ||
        el.Email.toLowerCase().includes(searchText) ||
        el.PhoneNumber.toString().toLowerCase().includes(searchText) ||
        el.Roles.toLowerCase().includes(searchText) ||
        el.AccessFailedCount.toString().toLowerCase().includes(searchText)
      );
    }
  });

  return (
    <Fragment>
      <Actionbar pageTitle="User Setup">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setUser({});
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
          Add
        </Nav.Link>
        {user.id && (
          <Nav.Link
            className="nav-link text-primary"
            onClick={() => {
              setShowCanvas(true);
            }}
          >
            <FontAwesomeIcon icon="fa-solid fa-pen" />
            Edit
          </Nav.Link>
        )}
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="User List.csv"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Col sm="3">
          <Form.Group>
            <Form.Control
              onChange={(e) => setSearchText(e.target.value.toLowerCase())}
              placeholder="Search"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive striped hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Access Failed Count</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {filteredData.map((item, index) => (
                    <tr
                      onClick={() => {
                        handleRowClick(item);
                      }}
                      key={item.UserName}
                      className={
                        item.UserName === user.UserName ? "table-active" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.FullName}</td>
                      <td>{item.UserName}</td>
                      <td>{item.Email}</td>
                      <td>{item.PhoneNumber}</td>
                      <td>{item.Roles}</td>
                      <td>{item.AccessFailedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Offcanvas
        show={showCanvas}
        onHide={handleClose}
        placement="end"
        className="w-50"
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>User Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={saveUser}
            method="POST"
          >
            <Row className="mb-2">
              <FormGroup as={Col}>
                <FormLabel>First Name</FormLabel>
                <FormControl
                  name="FirstName"
                  onChange={(e) => handleChange(e)}
                  value={user.FirstName}
                  required
                />
              </FormGroup>
              <FormGroup as={Col}>
                <FormLabel>Last Name</FormLabel>
                <FormControl
                  name="LastName"
                  onChange={(e) => handleChange(e)}
                  value={user.LastName}
                  required
                />
              </FormGroup>

              
            </Row>

            <Row>
            <FormGroup as={Col}>
                <FormLabel>User Name</FormLabel>
                <FormControl
                  name="UserName"
                  onChange={(e) => handleChange(e)}
                  value={user.UserName}
                  required
                />
              </FormGroup>
              <Form.Group as={Col}>
                <FormLabel>Role</FormLabel>
                <Role
                  onChange={(value, action) =>
                    setUser({
                      ...user,
                      [action.name]: value ? value.label : null
                      .map((item) => {
                        return item.value;
                      })
                      .join(","),
                    })
                  }
                  name="Roles"
                  required
                />
              </Form.Group>

              {/* <Form.Group as={Col}>
                <FormLabel>Factory</FormLabel>
                <Factory
                  onChange={(value, action) => {
                    setUser({
                      ...user,
                      [action.name]: value ? value.value : null
                        .map((item) => {
                          return item.value;
                        })
                        .join(","),
                    });

                    console.log(user);
                  }}
                  name="Factories"
                  required
                  isMulti={true}
                />
              </Form.Group> */}
            </Row>

            <Row className="mt-2">
              <FormGroup as={Col}>
                <FormLabel>Password</FormLabel>
                <FormControl
                  name="Password"
                  onChange={(e) => handleChange(e)}
                  type="password"
                  maxLength="30"
                  required
                />
              </FormGroup>

              <FormGroup as={Col}>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl
                  name="ConfirmPassword"
                  onChange={(e) => handleChange(e)}
                  type="password"
                  maxLength="30"
                  required
                />
              </FormGroup>
            </Row>

            <Row className="mt-2">
              <FormGroup as={Col}>
                <FormLabel>Email</FormLabel>
                <FormControl
                  name="Email"
                  onChange={(e) => handleChange(e)}
                  type="Email"
                  value={user.Email}
                  required
                />
              </FormGroup>

              <FormGroup as={Col}>
                <FormLabel>Phone</FormLabel>
                <FormControl
                  name="PhoneNumber"
                  onChange={(e) => handleChange(e)}
                  value={user.PhoneNumber}
                />
              </FormGroup>
            </Row>

            {loading ? (
              <Button variant="primary" disabled className="float-end mt-2">
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </Button>
            ) : (
              <Button
                variant="primary"
                type="submit"
                className="float-end mt-2"
              >
                {user.id ? "Update" : "Register"}
              </Button>
            )}
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default UserConfig;
