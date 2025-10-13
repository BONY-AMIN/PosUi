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

const ProductGroupSetup = () => {
  const [productGroup, setProductGroup] = useState({});
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

  const getAllProductGroup = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("ProductGroup?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllProductGroup();
  }, [getAllProductGroup]);

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
    setProductGroup({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProductGroup({ ...productGroup, [name]: value });
  };
  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveProductGroup = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = productGroup.id ? "PUT" : "POST";
    saveData("ProductGroup", methodType, productGroup, getAllProductGroup);
  };

  const deleteProductGroup = () => {
    deleteData(
      "ProductGroup",
      "DELETE",
      productGroup,
      getAllProductGroup
    );
  };

  const headers = [
    { label: "Parent Group", key: "ParentGroupName" },
    { label: "Product Group", key: "Name" },
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
          <Offcanvas.Title className="headertextsize">Product Group Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card className="card">
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveProductGroup}
                method="POST"
              >
                <Row className="mb-3">

                  <Col sm="3">
                    <Form.Label className="labelleft">Group Name</Form.Label>
                  </Col>
                  <Col>

                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="name"
                      value={productGroup.name}
                      required

                    />

                  </Col>


                  {/* </Form.Group> */}
                </Row>
                <div className="btn-toolbar float-end">

                  <Button
                    variant="primary"
                    type="cancel"
                    onClick={handleReset}
                    className="btncolor"

                  >
                    Cancel
                  </Button>
                  &nbsp;&nbsp;
                  {reqResponse.loading ? (
                    <Button variant="primary" disabled>
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
                    <Button variant="primary" type="submit" className="btncolor">
                      {productGroup.id ? "Update" : "Save"}
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>

      <Actionbar pageTitle="Product Group Setup">
        {/* <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setProductGroup({});
          }}
          className="nav-link text-light"
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </Nav.Link>
        <Nav.Link className="nav-link text-light" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link> */}
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="ProductGroup"
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
              setProductGroup({});
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
                    <th width={"10%"}>#</th>
                    <th>Product Group</th>
                    <th width={"10%"}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((item, index) => (
                    <tr
                      onClick={() => {
                        setProductGroup(item);
                      }}
                      key={item.id}
                      className={
                        item.id === productGroup.id
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>

                      <td>{item.name}</td>
                      <td>
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => setShowCanvas(true)}
                          className="actionbtnsize"
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
        handleDialogYes={deleteProductGroup}
      />
    </Fragment>
  );
};

export default ProductGroupSetup;
