import {
    Card,
    Button,
    Row,
    Col,
    Form,
    Spinner,
    Table,
    Pagination,
    Offcanvas,
    Nav,
  } from "react-bootstrap";
  
  import { useState, createRef, Fragment, useEffect, useCallback } from "react";
  import { ToastContainer } from "react-toastify";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { OriginCountry } from "../../components/DropDown";
  import Actionbar from "../../components/layout/Actionbar";
  import ConfirmDialog from "../../components/ConfirmDialog";
  import useFetch from "../../components/hooks/useFetch";
  import { CSVLink } from "react-csv";
  const csvLink = createRef();
  
  const Supplier = () => {
    const [supplier, setSupplier] = useState({});
    const [validated, setValidated] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({
      pageIndex: 1,
      pageSize: 10,
      excelExport: false,
    });
    const [itemExportList, setItemExportList] = useState([]);
  
    const [res, getData] = useFetch();
    const [reqResponse, saveData] = useFetch();
    const [, deleteData] = useFetch();
  
    const getAllSupplier = useCallback(() => {
      setShowDialog(false);
      setValidated(false);
      getData("Supplier?" + new URLSearchParams(searchCriteria), "GET");
    }, [getData, searchCriteria]);
  
    useEffect(() => {
      getAllSupplier();
    }, [getAllSupplier]);
  
    const getExcelData = () => {
      setSearchCriteria({ ...searchCriteria, excelExport: true });
      setItemExportList(res.data);
      setSearchCriteria({ ...searchCriteria, excelExport: false });
      setTimeout(() => {
        csvLink.current.link.click();
      }, 1000);
    };
  
    const handleClose = () => {
      setShowCanvas(false);
    };
  
    const handleReset = () => {
      Array.from(document.querySelectorAll("input")).forEach(
        (input) => (input.value = "")
      );
      setSupplier({});
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
  
      setSupplier({ ...supplier, [name]: value });
    };
    const handleDialogNo = () => {
      setShowDialog(false);
    };
  
    const saveSupplier = (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }
      const methodType = supplier.supplierID ? "PUT" : "POST";
      saveData("Supplier", methodType, supplier, getAllSupplier);
    };
  
    const deleteSupplier = () => {
      deleteData(
        "Supplier",
        "DELETE",
        supplier,
        getAllSupplier
      );
    };
  
    const headers = [
      { label: "Name", key: "Name" },
      { label: "Country", key: "Name" },
    ];
  
    return (
      <Fragment>
        <Offcanvas
          show={showCanvas}
          onHide={handleClose}
          placement="end"
          className="w-75"
          scroll={true}
          backdrop={false}
        >
          <Offcanvas.Header closeButton className="header">
            <Offcanvas.Title>Supplier Setup</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Card>
              <Card.Body>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveSupplier}
                  method="POST"
                >
                  <Row className="mb-3">
  
                    <Col sm="2" className="mb-1">
                      <Form.Label className="labelleft">Name</Form.Label>
                    </Col>
                    <Col sm="7" className="mb-1">
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="name"
                        value={supplier.name}
                        required
                      />
                    </Col>
                    <Col sm="1" className="mb-1">
  
                      <Form.Label className="labelleft">Country</Form.Label>
                    </Col>
                    <Col sm="2" className="mb-1">
                      <OriginCountry
                        onChange={(value, action) => {
                          setSupplier({
                            ...supplier,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="originCountryId"
                        selected={supplier.originCountryId}
                      />
                    </Col>
                    <Col sm="2" className="mb-1">
                      <Form.Label className="labelleft">Address</Form.Label>
                    </Col>
                    <Col sm="10" className="mb-1">
                      <Form.Control
                        as="textarea"
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="address"
                        value={supplier.address}
                        required
                      />
                    </Col>
                    <Col sm="2" className="mb-1">
                      <Form.Label className="labelleft">Email</Form.Label>
                    </Col>
                    <Col sm="4" className="mb-1">
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="email"
                        value={supplier.email}
                        required
                      />
                    </Col>
                    <Col sm="2" className="mb-1">
                      <Form.Label className="labelleft">Office Phone</Form.Label>
                    </Col>
                    <Col sm="4" className="mb-1">
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="phone"
                        value={supplier.phone}
                        required
                      />
                    </Col>
                    <Col sm="2" className="mb-1">
  
                      <Form.Label className="labelleft">Contact Name</Form.Label>
                    </Col>
                    <Col sm="4" className="mb-1">
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="contactPerson"
                        value={supplier.contactPerson}
                        required
                      />
                    </Col>
                    <Col sm="2" className="mb-1">
                      <Form.Label className="labelleft">Contact Phone</Form.Label>
                    </Col>
                    <Col sm="4">
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="contactPhone"
                        value={supplier.contactPhone}
                        required
                      />
                    </Col>
                     <Col sm="2" className="mb-1">
                      <Form.Label className="labelleft">Supplier Ac</Form.Label>
                    </Col>
                    <Col sm="4">
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="accountId"
                        value={supplier.accountId}
                        required
                      />
                    </Col>
  
  
                  </Row>
  
                  <Button
                    variant="primary"
                    type="cancel"
                    onClick={handleReset}
                    className="btncolor"
                    as={Col}
                  >
                    Cancel
                  </Button>
                  {reqResponse.loading ? (
                    <Button variant="primary" disabled className="float-end">
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
                    <Button variant="primary" type="submit" className="float-end btncolor">
                      {supplier.id ? "Update" : "Save"}
                    </Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Offcanvas.Body>
        </Offcanvas>
  
        <Actionbar pageTitle="Supplier Setup">
  
          <CSVLink
            headers={headers}
            data={itemExportList}
            filename="Supplier"
            className="hidden"
            ref={csvLink}
          />
        </Actionbar>
  
        <Row className="mt-2">
          <Col sm="3">
            <Form.Group>
              <Form.Control
                className="border-dark"
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    supplier: e.target.value,
                  })
                }
                placeholder="Search"
              />
            </Form.Group>
          </Col>
          <Col className="text-end">
            <Nav.Link
              onClick={() => {
                setShowCanvas(true);
                setSupplier({});
              }}
              className="nav-link text-seccess"
            >
              <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
            </Nav.Link>
  
          </Col>
        </Row>
  
        <Row className="mt-2 mb-2">
          <Col>
            <Card>
              <Card.Body>
                <Table responsive hover striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Country</th>
                      <th>Address</th>
                      <th>Email</th>
                      <th>Office Phone</th>
                      <th>Contact Name</th>
                      <th>Contact Phone</th>
                      <th>Account</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.dataLoading && (
                      <tr>
                        <td colSpan="10" className="text-center">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                    )}
                    {!res.dataLoading && res.data.length === 0 && (
                      <tr>
                        <td colSpan="10" className="text-center">
                          <b>No data found!</b>
                        </td>
                      </tr>
                    )}
                    {res.data.map((item, index) => (
                      <tr
                        onClick={() => {
                          setSupplier(item);
                        }}
                        key={item.supplierID}
                        className={
                          item.supplierID === supplier.supplierID
                            ? "table-active"
                            : ""
                        }
                      >
                        <td>{index + 1}</td>
  
                        <td>{item.name}</td>
                        <td>{item.originCountryName}</td>
                        <td>{item.address}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.contactPerson}</td>
                        <td>{item.contactPhone}</td>
                        <td>{item.accountId}</td>
                        <td>
                          <Button
                            variant="btn btn-sm btn-outline-primary"
                            onClick={() => setShowCanvas(true)}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-pen" />
                          </Button>
                          <Button
                            variant="btn btn-sm btn-outline-danger ms-1"
                            type=""
                            onClick={() => setShowDialog(true)}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination className="float-end">
                  <Pagination.Prev
                    onClick={() =>
                      setSearchCriteria({
                        ...searchCriteria,
  
                        pageIndex:
                          searchCriteria.pageIndex === 1
                            ? 1
                            : searchCriteria.pageIndex - 1,
                      })
                    }
                  />
  
                  <Pagination.Next
                    onClick={() =>
                      setSearchCriteria({
                        ...searchCriteria,
  
                        pageIndex: searchCriteria.pageIndex + 1,
                      })
                    }
                  />
                </Pagination>
              </Card.Body>
            </Card>
          </Col>
        </Row>
  
        <ToastContainer autoClose={2000} />
        <ConfirmDialog
          showDialog={showDialog}
          handleDialogNo={handleDialogNo}
          handleDialogYes={deleteSupplier}
        />
      </Fragment>
    );
};

export default Supplier;
