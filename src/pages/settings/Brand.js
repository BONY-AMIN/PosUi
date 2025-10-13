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
import {  Manufacturer } from "../../components/DropDown";
import Actionbar from "../../components/layout/Actionbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const BrandSetup = () => {
  const [brands, setBrands] = useState({ dosageId: 0, strenthId: 0 });
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

  const getAllBrands = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Brand?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllBrands();
  }, [getAllBrands]);

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
    setBrands({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setBrands({ ...brands, [name]: value });
  };
  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveBrands = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    console.log(brands);
    const methodType = brands.id ? "PUT" : "POST";
    console.log(methodType);
    saveData("Brand", methodType, brands, getAllBrands);
  };

  const deletebrans = () => {
    console.log(brands);
    deleteData(
      "Brand/",
      "DELETE",
      brands,
      getAllBrands
    );
  };

  const headers = [
    { label: "Name", key: "name" },
  
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
          <Offcanvas.Title>Product Entry</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveBrands}
                method="POST"
              >
                <Row className="mb-3">

                  <Col sm="2" className="mb-1">
                    <Form.Label className="labelleft">Name</Form.Label>
                  </Col>
                  <Col sm="10" className="mb-1">
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="name"
                      value={brands.name}

                    />
                  </Col>
                
                  <Col sm="2" className="mb-1">
                    <Form.Label className="labelleft">Manufacturer</Form.Label>
                  </Col>
                  <Col sm="10" className="mb-1">
                    <Manufacturer
                      onChange={(value, action) => {
                        setBrands({
                          ...brands,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      name="manufacturerId"
                      selected={brands.manufacturerId}
                    />
                  </Col>
                  
                  <Col sm="2" className="mb-1">
                    <Form.Label className="labelleft">Retail Price</Form.Label>
                  </Col>
                  <Col sm="10" className="mb-1">
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="retailPrice"
                      value={brands.retailPrice}

                    />
                  </Col>

                  <Col sm="2" className="mb-1">
                    <Form.Label className="labelleft">Opening Stock</Form.Label>
                  </Col>
                  <Col sm="10" className="mb-1">
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="openingStock"
                      value={brands.openingStock}

                    />
                  </Col>
                  <Col sm="2" className="mb-1">
                    <Form.Label className="labelleft">Current Stock</Form.Label>
                  </Col>
                  <Col sm="10" className="mb-1">
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="currentStock"
                      value={brands.currentStock}

                    />
                  </Col>
                  <Col sm="2" className="mb-1">
                    <Form.Label className="labelleft">ReOrder Point</Form.Label>
                  </Col>
                  <Col sm="10" className="mb-1">
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="reOrderPoint"
                      value={brands.reOrderPoint}

                    />
                  </Col>
                  <Col sm="2" className="mb-1">
                    <Form.Label className="labelleft">Vat</Form.Label>
                  </Col>
                  <Col sm="10" className="mb-1">
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="vat"
                      value={brands.vat}

                    />
                  </Col>
                  <Col sm="2" className="mb-1">
                    <Form.Label className="labelleft">Discount</Form.Label>
                  </Col>
                  <Col sm="10" className="mb-1">
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="discount"
                      value={brands.discount}

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
                    {brands.id ? "Update" : "Save"}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>

      <Actionbar pageTitle="Product List">
        
        {/* <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link> */}
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="Brands"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>

      <Row className="mt-2">
        <Form.Group as={Col} sm="2">
          <Form.Control
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                brandName: e.target.value,
              })
            }
            placeholder="Name"
          />
        </Form.Group>

        
        <Form.Group as={Col} sm="2">
          <Manufacturer
            onChange={(value, action) =>
              setSearchCriteria({
                ...searchCriteria,

                [action.name]: value ? value.value : null,
              })
            }
            name="manufacturerId"
          />
        </Form.Group>
    
        <Col className="text-end">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setBrands({  retailPrice: 0, reOrderPoint: 0, openingStock: 0, currentStock: 0 });
          }}
          className="nav-link text-primary"
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </Nav.Link></Col>

      </Row>

      <Row className="mt-2 mb-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover striped size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Code</th>
                  
                    <th>Manufacturer</th>
                   
                    <th>Retail Price</th>
                    <th>Current Stock</th>
                    <th>Opening Stock</th>
                    <th>ReOrder Point</th>
                    <th>Vat</th>
                    <th>Discount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="15" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="15" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((item, index) => (
                    <tr
                      onClick={() => {
                        setBrands(item);
                      }}
                      key={item.id}
                      className={
                        item.id === brands.id
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.code}</td>
                      
                      <td>{item.manufacturerName}</td>
                   
                      <td>{item.retailPrice}</td>
                      <td>{item.currentStock}</td>
                      <td>{item.openingStock}</td>
                      <td>{item.reOrderPoint}</td>
                      <td>{item.vat}</td>
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
        handleDialogYes={deletebrans}
      />
    </Fragment>
  );
};

export default BrandSetup;
