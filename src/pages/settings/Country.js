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
  import Actionbar from "../../components/layout/Actionbar";
  import ConfirmDialog from "../../components/ConfirmDialog";
  import useFetch from "../../components/hooks/useFetch";
  import { CSVLink } from "react-csv";
  const csvLink = createRef();
  
  const Country = () => {
    const [country, setCountry] = useState({});
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
  
    const getAllCountry = useCallback(() => {
      setShowDialog(false);
      setValidated(false);
      getData("Country?" + new URLSearchParams(searchCriteria), "GET");
    }, [getData, searchCriteria]);
  
    useEffect(() => {
      getAllCountry();
    }, [getAllCountry]);
  
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
      setCountry({});
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
  
      setCountry({ ...country, [name]: value });
    };
    const handleDialogNo = () => {
      setShowDialog(false);
    };
  
    const saveCountry = (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }
      const methodType = country.countryID ? "PUT" : "POST";
      saveData("Country", methodType, country, getAllCountry);
    };
  
    const deleteCountry = () => {
      
      deleteData(
        "Country",
        "DELETE",
        country,
        getAllCountry
      );
    };
  
  
    const headers = [
      { label: "Country", key: "Country" },
      { label: "Currency", key: "Currency" },
      { label: "Timezone", key: "Timezone" },
    ];
  
    return (
      <Fragment>
        <Offcanvas
          show={showCanvas}
          onHide={handleClose}
          placement="end"
          className="w-50"
          scroll={true}
          backdrop={false}
        >
          <Offcanvas.Header closeButton className="header">
           <Offcanvas.Title>Country Setup</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Card>
              <Card.Body>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveCountry}
                  method="POST"
                >
                  <Row className="mb-3">
                  <Col sm="3">
                    <Form.Label className="labelleft">Country</Form.Label>
                    </Col>
                     
                      <Col>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="countryName"
                        value={country.countryName}
                        required
                      />
                       </Col>
                      <Col sm="3">
                    <Form.Label className="labelleft">Currency</Form.Label>
                    </Col>
                     
                      <Col>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="currency"
                        value={country.currency}
                        required
                      />
                       </Col>
                        
                 
                  </Row>
                  <Row className="mb-3">
                 
                        <Col sm="3">
                    <Form.Label className="labelleft">Timezone</Form.Label>
                    </Col>
                     
                      <Col>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="timezone"
                        value={country.timezone}
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
                      {country.countryID ? "Update" : "Save"}
                    </Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Offcanvas.Body>
        </Offcanvas>
  
        <Actionbar pageTitle="Country Setup">
           <CSVLink
            headers={headers}
            data={itemExportList}
            filename="Country"
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
                    productGroup: e.target.value,
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
              setCountry({});
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
                      <th>Country</th>
                      <th>Currency</th>
                      <th>Timezone</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.dataLoading && (
                      <tr>
                        <td colSpan="5" className="text-center">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                    )}
                    {!res.dataLoading && res.data.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center">
                          <b>No data found!</b>
                        </td>
                      </tr>
                    )}
                    {res.data.map((item, index) => (
                      <tr
                        onClick={() => {
                          setCountry(item);
                        }}
                        key={item.countryID}
                        className={
                          item.countryID === country.countryID
                            ? "table-active"
                            : ""
                        }
                      >
                        <td>{index + 1}</td>
                        
                        <td>{item.countryName}</td>
                        <td>{item.currency}</td>
                        <td>{item.timezone}</td>
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
                            onClick={(e) => setShowDialog(true)}
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
          handleDialogYes={deleteCountry}
        />
      </Fragment>
    );
  };
  
  export default Country;
  