import {
    Card,
    Button,
    Row,
    Col,
    Form,
    Label,
    Spinner,
    Table,
    Pagination,
    Offcanvas,
    Nav,
  } from "react-bootstrap";
  
  import { useState, createRef, Fragment, useEffect, useCallback } from "react";
  import { ToastContainer } from "react-toastify";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { CategoryDD } from "../../components/DropDown";
  import Actionbar from "../../components/layout/Actionbar";
  import ConfirmDialog from "../../components/ConfirmDialog";
  import useFetch from "../../components/hooks/useFetch";
  import { CSVLink } from "react-csv";
  const csvLink = createRef();
  
  const Category = () => {
    const [category, setCategory] = useState({});
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
  
    const getAllCategory = useCallback(() => {
      setShowDialog(false);
      setValidated(false);
      getData("Category?" + new URLSearchParams(searchCriteria), "GET");
    }, [getData, searchCriteria]);
  
    useEffect(() => {
      getAllCategory();
    }, [getAllCategory]);
  
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
      setCategory({});
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
  
      setCategory({ ...category, [name]: value });
    };
    const handleDialogNo = () => {
      setShowDialog(false);
    };
  
    const saveCategory = (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }
      const methodType = category.categoryID ? "PUT" : "POST";
      saveData("Category", methodType, category, getAllCategory);
    };
  
    const deleteCategory = () => {
      deleteData(
        "Category/",
        "DELETE",
        category,
        getAllCategory
      );
    };
  
    const headers = [
      { label: "Name", key: "name" },
      { label: "Parent", key: "Parent" },
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
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Category Setup</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Card>
              <Card.Body>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveCategory}
                  method="POST"
                >
                  <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="categoryName"
                        value={category.categoryName}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Parent Category</Form.Label>
                      <CategoryDD
                        onChange={(value, action) => {
                          setCategory({
                            ...category,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="parentCategoryID"
                        selected={category.parentCategoryID}
                      />
                    </Form.Group>
                  </Col>
                  </Row>
  
                  <Button
                    variant="light"
                    type="cancel"
                    onClick={handleReset}
                    as={Col}
                  >
                    Reset
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
                    <Button variant="primary" type="submit" className="float-end">
                      {category.categoryID ? "Update" : "Save"}
                    </Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Offcanvas.Body>
        </Offcanvas>
  
        <Actionbar pageTitle="Category Setup">
          <Nav.Link
            onClick={() => {
              setShowCanvas(true);
              setCategory({});
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
            data={itemExportList}
            filename="Category"
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
                    categoryName: e.target.value,
                  })
                }
                placeholder="Search"
              />
            </Form.Group>
          </Col>
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
                      <th>Parent Category</th>
                      
                      <th></th>
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
                          setCategory(item);
                        }}
                        key={item.categoryID}
                        className={
                          item.categoryID === category.categoryID
                            ? "table-active"
                            : ""
                        }
                      >
                        <td>{index + 1}</td>
                        <td>{item.categoryName}</td>
                        <td>{item.parentCategoryName}</td>
                       
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
          handleDialogYes={deleteCategory}
        />
      </Fragment>
    );
  };
  
  export default Category;
