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
  import { Country
  } from "../../components/DropDown";
  import Actionbar from "../../components/layout/Actionbar";
  import ConfirmDialog from "../../components/ConfirmDialog";
  import useFetch from "../../components/hooks/useFetch";
  import { CSVLink } from "react-csv";
  const csvLink = createRef();
  
  const Store = () => {
    const [store, setStore] = useState({});
    const [validated, setValidated] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({
      pageIndex: 1,
      pageSize: 20,
      excelExport: false,
    });
    const [itemExportList, setItemExportList] = useState([]);
  
    const [res, getData] = useFetch();
    const [reqResponse, saveData] = useFetch();
    const [, deleteData] = useFetch();
  
    const getAllStore = useCallback(() => {
      setShowDialog(false);
      setValidated(false);
      getData("Store?" + new URLSearchParams(searchCriteria), "GET");
    }, [getData, searchCriteria]);
  
    useEffect(() => {
      getAllStore();
    }, [getAllStore]);
  
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
      setStore({});
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
  
      setStore({ ...store, [name]: value });
    };
    const handleDialogNo = () => {
      setShowDialog(false);
    };
  
    const saveStore = (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }
      const methodType = store.storeID ? "PUT" : "POST";
      saveData("Store", methodType, store, getAllStore);
    };
  
    const deletestore = () => {
      deleteData(
        "Store",
        "DELETE",
        store,
        getAllStore
      );
    };
  
    const headers = [
      { label: "Name", key: "name" },
      { label: "Store", key: "store" },
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
            <Offcanvas.Title>Store Setup</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Card>
              <Card.Body>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveStore}
                  method="POST"
                >
                  <Row className="mb-3">
                  <Col sm="3">
                      <Form.Label className="labelleft">Name</Form.Label>
                      </Col>
                      <Col sm="9">
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="name"
                        value={store.name}
                      />
                      </Col>
                      <Col sm="3">
                      <Form.Label className="labelleft">Country</Form.Label>
                      </Col>
                      <Col sm="9">
                      <Country
                        onChange={(value, action) => {
                          setStore({
                            ...store,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="countryID"
                        selected={store.countryID}
                      />
                      </Col>
                   
                      <Col sm="3">
                      <Form.Label className="labelleft">City</Form.Label>
                      </Col>
                      <Col sm="9">                  
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="city"
                        value={store.city}
                        
                      />
                      </Col>
                      <Col sm="3">
                      <Form.Label className="labelleft">Address</Form.Label>
                      </Col>
                      <Col sm="9">                  
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="address"
                        value={store.address}
                        
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
                      {store.storeID ? "Update" : "Save"}
                    </Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Offcanvas.Body>
        </Offcanvas>
  
        <Actionbar pageTitle="Store Setup">
          {/* <Nav.Link className="nav-link text-success" onClick={getExcelData}>
            <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
          </Nav.Link> */}
          <CSVLink
            headers={headers}
            data={itemExportList}
            filename="Store"
            className="hidden"
            ref={csvLink}
          />
        </Actionbar>
  
        <Row className="mt-2">
          <Col sm="3">
            <Form.Group>
              <Form.Control
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    name: e.target.value,
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
              setStore({});
            }}
            className="nav-link text-primary"
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
                      <th>City</th>
                      <th>Address</th>
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
                        <td colSpan="5" className="text-center">
                          <b>No data found!</b>
                        </td>
                      </tr>
                    )}
                    {res.data.map((item, index) => (
                      <tr
                        onClick={() => {
                          setStore(item);
                        }}
                        key={item.storeID}
                        className={
                          item.storeID== store.storeID
                            ? "table-active"
                            : ""
                        }
                      >
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        
                        <td>{item.countryName}</td>
                        <td>{item.city}</td>
                        <td>{item.address}</td>
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
          handleDialogYes={deletestore}
        />
      </Fragment>
    );
  };
  
  export default Store;
  