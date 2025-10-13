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
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  CategoryDD, Unit,Brand } from "../../components/DropDown";
import Actionbar from "../../components/layout/Actionbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const Product = () => {
  const [product, setProduct] = useState({});
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [productExportList, setProductExportList] = useState([]);

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllProduct = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Product?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setProductExportList(res.data);
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
    setProduct({});
  };

  const handleChange = (event) => {
    let { name, value } = event.target;

    // if (name === "UnitPrice") {
    //   value = parseInt(value);
    // }
    setProduct({ ...product, [name]: value });
  };
  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveProduct = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (product.categoryID === undefined) {
      toast.error("Product Category Is Not Defined !", {
        position: "bottom-right",
      });
      return;
    }
    const methodType = product.productID ? "PUT" : "POST";
    saveData("Product", methodType, product, getAllProduct);
  };

  const deleteProduct = () => {
    deleteData("Product/" + product.ProductID, "DELETE", null, getAllProduct);
  };

  const headers = [
    { label: "ProductCategoryName", key: "ProductCategoryName" },
    { label: "Product Code", key: "ProductCode" },
    { label: "Product Description", key: "ProductDescription" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Product Setup">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setProduct({});
          }}
          className="nav-link text-primary"
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </Nav.Link>
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={productExportList}
          filename="ProductList.csv"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>

      <Row className="mt-2">
        <Col>
          <Row>
            <Form.Group as={Col} sm="3">
              <CategoryDD
                onChange={(value, action) => {
                  setSearchCriteria({
                    ...searchCriteria,
                    [action.name]: value ? value.value : null,
                  });
                }}
                name="categoryId"
              />
            </Form.Group>
          </Row>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover striped size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Global SKU</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Retail Price</th>
                    <th>Cost Price</th>
                    <th>Sale Price</th>
                    <th>Open Stock</th>
                    <th>Current Stock</th>
                    <th>Re Order Point</th>
                    <th>Vat</th>
                    <th>Discount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="16" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="16" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((element, index) => (
                    <tr
                      onClick={() => {
                        setProduct(element);
                      }}
                      key={element.productID}
                      className={
                        element.ProductID === product.productID ? "table-active" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td className="col-md-2">{element.name}</td>
                      <td>{element.globalSKU}</td>
                       <td>{element?.brandName}</td>
                      <td>{element.categoryName}</td>
                      <td>{element?.unitName}</td>
                      <td>{element?.size}</td>
                      <td>{element?.color}</td>
                      <td>{element?.retailPrice}</td>
                      <td>{element?.defaultCostPrice}</td>
                      <td>{element?.defaultSellingPrice}</td>
                      <td>{element?.openingStock}</td>
                      <td>{element?.currentStock}</td>
                      <td>{element?.reOrderPoint}</td>
                      <td>{element?.vat}</td>
                      <td>{element?.discount}</td>
                      <td className="col-md-1">
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => setShowCanvas(true)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                        <Button
                          variant="btn btn-sm btn-outline-danger ms-1"
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

      <Offcanvas
        show={showCanvas}
        onHide={handleClose}
        placement="end"
        className="w-50"
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Product Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveProduct}
                method="POST"
              >
                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="name"
                      value={product.name}
                      required
                    />
                  </Form.Group>
                    <Form.Group as={Col}>
                    <Form.Label>Global SKU</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="globalSKU"
                      value={product.globalSKU}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-2">
                
                 <Form.Group as={Col}>
                    <Form.Label>Brand</Form.Label>
                    <CategoryDD
                      onChange={(value, action) => {
                        setProduct({
                          ...product,
                          [action.name]: value ? value.value : null,
                        }); 
                      }}
                      name="brandID"
                      placeholder="Select Brand"
                      selected={product.brandID}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Product Category</Form.Label>
                    <CategoryDD
                      onChange={(value, action) => {
                        setProduct({
                          ...product,
                          [action.name]: value ? value.value : null,
                        }); 
                      }}
                      name="categoryID"
                      placeholder="Select Category"
                      selected={product.categoryID}
                    />
                  </Form.Group>
                </Row> <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Size</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="size"
                      value={product.size}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="color"
                      value={product.color}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Unit</Form.Label>
                    <Unit
                      onChange={(value, action) => {
                        setProduct({
                          ...product,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      name="unitId"
                      selected={product.unitId}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Retai Price</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="retailPrice"
                      value={product.retailPrice}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Cost Price</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="defaultCostPrice"
                      value={product.defaultCostPrice}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Sell Price</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="defaultSellingPrice"
                      value={product.defaultSellingPrice}
                    />
                  </Form.Group>
                </Row>
                 <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Opening Stock</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="openingStock"
                      value={product.openingStock}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Current Stock</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="currentStock"
                      value={product.currentStock}
                    />
                  </Form.Group>
                </Row>
                 <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Re OrderPoint</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="reOrderPoint"
                      value={product.reOrderPoint}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Vat</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="vat"
                      value={product.vat}
                    />
                  </Form.Group>
                </Row>
                 <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Discount</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="discount"
                      value={product.discount}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Barcode</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="barcode"
                      value={product.barcode}
                    />
                  </Form.Group>
                </Row>

                <Button
                  variant="light"
                  onClick={handleReset}
                  type="cancel"
                  as={Col}
                  className="mt-2"
                >
                  Reset
                </Button>
                {reqResponse.loading ? (
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
                    {product.productID ? "Update" : "Save"}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>

      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteProduct}
      />
    </Fragment>
  );
};

export default Product;
