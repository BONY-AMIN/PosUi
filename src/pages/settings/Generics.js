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
  import { Dosage,Strenth,OriginCountry ,ProductGroup
  } from "../../components/DropDown";
  import Actionbar from "../../components/layout/Actionbar";
  import ConfirmDialog from "../../components/ConfirmDialog";
  import useFetch from "../../components/hooks/useFetch";
  import { CSVLink } from "react-csv";
  const csvLink = createRef();
  
  const Generics = () => {
    const [generics, setGenerics] = useState({});
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
  
    const getAllGenerics = useCallback(() => {
      setShowDialog(false);
      setValidated(false);
      getData("Generics?" + new URLSearchParams(searchCriteria), "GET");
    }, [getData, searchCriteria]);
  
    useEffect(() => {
        console.log("In");
      getAllGenerics();
    }, [getAllGenerics]);
  
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
      setGenerics({});
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
  
      setGenerics({ ...generics, [name]: value });
    };
    const handleDialogNo = () => {
      setShowDialog(false);
    };
  
    const saveGenerics = (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }
      console.log(generics);
      const methodType = generics.id ? "PUT" : "POST";
      console.log(methodType);
      saveData("Generics", methodType, generics, getAllGenerics);
    };
  
    const deletegenerics = () => {
      deleteData(
        "Generics",
        "DELETE",
        generics,
        getAllGenerics
      );
    };
  
    const headers = [
      { label: "Name", key: "name" },
      { label: "Dosage", key: "dosage" },
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
            <Offcanvas.Title>Generics Setup</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Card>
              <Card.Body>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveGenerics}
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
                        value={generics.name}
                        
                      />
                    </Col>
                      <Col sm="3">      
                      <Form.Label className="labelleft">Dosage</Form.Label>
                      </Col>
                      <Col sm="9">      
                      <Dosage
                        onChange={(value, action) => {
                          setGenerics({
                            ...generics,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="dosageId"
                        selected={generics.dosageId}
                      />
                    </Col>
                      <Col sm="3">      
                   
                      <Form.Label className="labelleft">Strenth</Form.Label>
                      </Col>
                      <Col sm="9">      
                      <Strenth
                        onChange={(value, action) => {
                          setGenerics({
                            ...generics,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="strenthId"
                        selected={generics.strenthId}
                      />
                    </Col>
                      <Col sm="3">      
                    
                      <Form.Label className="labelleft">Origin Country</Form.Label>
                      </Col>
                      <Col sm="9">      
                      <OriginCountry
                        onChange={(value, action) => {
                          setGenerics({
                            ...generics,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="originCountryId"
                        selected={generics.originCountryId}
                      />
                   </Col>
                      <Col sm="3">      
                      <Form.Label className="labelleft">Product Group</Form.Label>
                      </Col>
                      <Col sm="9">      
                      <ProductGroup
                        onChange={(value, action) => {
                          setGenerics({
                            ...generics,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="productGroupId"
                        selected={generics.productGroupId}
                      />
                     </Col>
                      <Col sm="3">      
                      <Form.Label className="labelleft">Discount</Form.Label>
                      </Col>
                      <Col sm="9">
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="number"
                        name="discount"
                        value={generics.discount}
                        
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
                      {generics.id ? "Update" : "Save"}
                    </Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Offcanvas.Body>
        </Offcanvas>
  
        <Actionbar pageTitle="Generics Setup">
          {/* <Nav.Link className="nav-link text-success" onClick={getExcelData}>
            <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
          </Nav.Link> */}
          <CSVLink
            headers={headers}
            data={itemExportList}
            filename="Generics"
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
                    genericsName: e.target.value,
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
              setGenerics({});
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
                      <th>Code</th>
                      <th>Dosage</th>
                      <th>Strenth</th>
                      <th>Origin</th>
                      <th>Category</th>
                      <th>Discount</th>
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
                          setGenerics(item);
                        }}
                        key={item.id}
                        className={
                          item.id === generics.id
                            ? "table-active"
                            : ""
                        }
                      >
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.code}</td>
                        <td>{item.dosageName}</td>
                        <td>{item.strenthName}</td>
                        <td>{item.originCountryName}</td>
                        <td>{item.productGroupName}</td>
                        <td>{item.discount}</td>
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
          handleDialogYes={deletegenerics}
        />
      </Fragment>
    );
  };
  
  export default Generics;
  