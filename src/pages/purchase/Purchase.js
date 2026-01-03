import { useState, createRef, Fragment, useCallback, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Form,
  Spinner,
  Nav,
  InputGroup,
  Offcanvas,
  Modal
} from "react-bootstrap";
import { toast } from "react-toastify";

import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Supplier,
  Brand,
  Manufacturer,
  CategoryDD,
  Product,
  Generics,
  UserType,
} from "../../components/DropDown";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const Purchase = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [validated, setValidated] = useState(false);
  const [master, setMaster] = useState({
    supplierId: "",
    warehouseId: 1,
    supplierInvoiceNo: "",
    deliveryChalanNo: "",
    remarks: "",
    totalDiscount: "",
    totalVat: "",
    totalSubTotal:"",
    totalVat:"",
    grandTotal:"",
    totalLineDiscount:"",
    totalPayableAmount:"",
    purchaseDate: new Date().toISOString(),
    supplierInvoiceDate: new Date().toISOString(),
    deliveryInvoiceDate: new Date().toISOString(),
    PurchaseDetails: [],
  });
  const [rowdata, setRowdata] = useState({
    discount: "",
    discountAmt: "",
    brandId: "",
    quantity: "",
    vat: "",
    balance: "",
    unitPrice: "",
    newRate: "",
    subTotal1: "",
    subTotal2: "",
    subTotal3: "",
    totalNewRate: "",
  });
  const [rowdataList, setRowDataList] = useState([]);
  const [purchaseDetails, setInputList] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [brands, setBrands] = useState({ dosageId: 0, strenthId: 0 });
  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getAllPurchase = useCallback(() => {
    setValidated(false);
    getData("Purchase?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllPurchase();
  }, [getAllPurchase]);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };
  const handleRowdata = (event) => {
    const { name, value } = event.target;
    //console.log(name, value);
    //console.log(rowdata.receiveQuantity);
    console.log(rowdata);
    if (name === "receiveQuantity") {
      rowdata.subTotal1 =value * Number(rowdata.unitPrice==""?0 : rowdata.unitPrice) ;
      rowdata.subTotal2 =rowdata.subTotal1+ (((Number(rowdata.vat==""?0:rowdata.vat)/100) * Number(rowdata.unitPrice==""?0 : rowdata.unitPrice))* value) ;
      rowdata.subTotal3=rowdata.subTotal2-Number(rowdata.discountAmt);
      rowdata.totalNewRate=rowdata.subTotal3;
      rowdata.newRate =rowdata.totalNewRate/rowdata.receiveQuantity ;
      // rowdata.totalNewRate =
      //   value * (rowdata.unitPrice - Number(rowdata.discountAmt)) +
      //   Number(rowdata.vat);
    }
    if (name === "unitPrice") {
      rowdata.subTotal1 =value * Number(rowdata.receiveQuantity==""?0:rowdata.receiveQuantity);
      rowdata.subTotal2 =rowdata.subTotal1 +(((Number(rowdata.vat==""?0:rowdata.vat)/100) * value)* rowdata.receiveQuantity) ;
      rowdata.subTotal3=rowdata.subTotal2-Number(rowdata.discountAmt);
      rowdata.totalNewRate=rowdata.subTotal3;
      rowdata.newRate =rowdata.totalNewRate/rowdata.receiveQuantity ;
      // rowdata.totalNewRate =
      //   rowdata.receiveQuantity * (value - Number(rowdata.discountAmt)) +
      //   Number(rowdata.vat);
    }
    if (name === "discount") {
      rowdata.discountAmt = rowdata.unitPrice * (value / 100);
      rowdata.subTotal1 =rowdata.unitPrice * Number(rowdata.receiveQuantity==""?0:rowdata.receiveQuantity);
      rowdata.subTotal2 =rowdata.subTotal1 +(((Number(rowdata.vat==""?0:rowdata.vat)/100) * rowdata.unitPrice)* rowdata.receiveQuantity) ;
      rowdata.subTotal3=rowdata.subTotal2-(Number(rowdata.discountAmt)* rowdata.receiveQuantity);
      rowdata.totalNewRate=rowdata.subTotal3;
      rowdata.newRate =rowdata.totalNewRate/rowdata.receiveQuantity ;
      // rowdata.totalNewRate =
      //   rowdata.receiveQuantity *
      //     (rowdata.unitPrice - rowdata.unitPrice * (value / 100)) +
      //   Number(rowdata.vat == "" ? 0 : rowdata.vat);
    }
    if (name === "discountAmt") {
      rowdata.discount = 100 * (value / rowdata.unitPrice);
      rowdata.subTotal1 =rowdata.unitPrice * Number(rowdata.receiveQuantity==""?0:rowdata.receiveQuantity);
      rowdata.subTotal2 =rowdata.subTotal1 +(((Number(rowdata.vat==""?0:rowdata.vat)/100) * rowdata.unitPrice)* rowdata.receiveQuantity) ;
      rowdata.subTotal3=rowdata.subTotal2-(value* rowdata.receiveQuantity);
      rowdata.totalNewRate=rowdata.subTotal3;
      rowdata.newRate =rowdata.totalNewRate/rowdata.receiveQuantity ;
      // rowdata.totalNewRate =
      //   rowdata.receiveQuantity * (rowdata.unitPrice - value) +
      //   Number(rowdata.vat == "" ? 0 : rowdata.vat);
    }
    if (name === "vat") {
      rowdata.subTotal1 =rowdata.unitPrice * Number(rowdata.receiveQuantity==""?0:rowdata.receiveQuantity);
      rowdata.subTotal2 =rowdata.subTotal1 +(((value/100) * rowdata.unitPrice)* rowdata.receiveQuantity) ;
      rowdata.subTotal3=rowdata.subTotal2-(rowdata.discountAmt* rowdata.receiveQuantity);
      rowdata.totalNewRate=rowdata.subTotal3;
      rowdata.newRate =rowdata.totalNewRate/rowdata.receiveQuantity ;
      // rowdata.newRate = rowdata.unitPrice - Number(rowdata.discountAmt);
      // rowdata.totalNewRate =
      //   rowdata.receiveQuantity *
      //     (rowdata.unitPrice - Number(rowdata.discountAmt)) +
      //   Number(value);
    }
    setRowdata({ ...rowdata, [name]: value });
  };
  const addToRowList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRowDataList([
      ...rowdataList,
      {
        productId: rowdata.productId,
        productName: rowdata.productName,
        orderQuantity: rowdata.orderQuantity,
        receiveQuantity: rowdata.receiveQuantity,
        bonusQuantity: rowdata.bonusQuantity,
        unitPrice: rowdata.unitPrice,
        discount: rowdata.discount,
        discountAmt: rowdata.discountAmt,
        vat: rowdata.vat,
        newRate: rowdata.newRate,
        totalNewRate: rowdata.totalNewRate,
        manufacturingDate: rowdata.manufacturingDate,
        expiryDate: rowdata.expiryDate,
        subTotal1:rowdata.subTotal1,
        subTotal2:rowdata.subTotal2,
        subTotal3:rowdata.subTotal3
      },
    ]);
  };
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    let list = [...purchaseDetails];
    list[index][name] = value;
    if (name === "discount") {
      list[index]["discountAmt"] =
        Number(list[index]["unitPrice"]) * (value / 100);
    }
    if (name === "discountAmt") {
      list[index]["discount"] =
        100 * (value / Number(list[index]["unitPrice"]));
    }
    if (
      name === "receiveQuantity" ||
      name === "bonusQuantity" ||
      name === "unitPrice" ||
      name === "discount" ||
      name === "discountAmt" ||
      name === "vat"
    ) {
      list[index]["newRate"] =
        (Number(list[index]["receiveQuantity"]) *
          Number(list[index]["unitPrice"]) -
          Number(list[index]["bonusQuantity"]) *
            Number(list[index]["unitPrice"])) /
          Number(list[index]["receiveQuantity"]) -
        Number(list[index]["unitPrice"]) *
          (Number(list[index]["discount"]) / 100) +
        Number(list[index]["vat"]);
    }
    setInputList(list);
  };

  const handleMaster = (event) => {
    const { name, value } = event.target;

    setMaster({ ...master, [name]: value });
    //if(name=="totalDiscount"){
    // let list = [...purchaseDetails];
    // let avgdis=0;
    // avgdis=value/purchaseDetails.length;

    // purchaseDetails.forEach((val,index)=>
    // list[index]["newRate"] = ((((val.receiveQuantity* val.unitPrice)-(val.bonusQuantity*val.unitPrice))-Number(avgdis))/Number(val.receiveQuantity))
    // );
    //setInputList(list);
    //}
  };

  const handleBrandChange = (event) => {
    const { name, value } = event.target;

    setBrands({ ...brands, [name]: value });
  };

  const getInvoiceTotal = () => {
    let sum = 0;
    let discount = master.totalDiscount ? master.totalDiscount : 0;
    rowdataList.forEach((el) => (sum += Number(el.totalNewRate)));
    return Number(sum) - Number(discount);
  };
  // const getAllBrands = useCallback(() => {
  //   setValidated(false);
  //   getData("Brand?" + new URLSearchParams(searchCriteria), "GET");
  // }, [getData, searchCriteria]);

  const saveBrands = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const methodType = brands.id ? "PUT" : "POST";
    fetch(process.env.REACT_APP_API_URL + "Brand", {
      method: methodType,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(brands),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Data Added Successfuly", {
            position: "bottom-right",
          });
          let lastindex = purchaseDetails.length - 1;
          const list = [...purchaseDetails];
          //list[lastindex]["brandId"]="";
          list.splice(lastindex, 1);
          setInputList(list);
          //removeRowClick(lastindex);
          //addRowClick(e);
        } else {
          toast.error(response.statusText + "(" + response.status + ")", {
            position: "bottom-right",
          });
        }
        setValidated(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const savePurchase = (e) => {
    console.log("savePurchase");
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    master.purchaseDetails = rowdataList;
    const methodType = master.id ? "PUT" : "POST";
    saveData("Purchase", methodType, master, getAllPurchase);
  };
  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setBrands({});
  };
  const removeMasterRowClick = (id) => {
    console.log(id);
    deleteData("Purchase/" + id, "DELETE", getAllPurchase);
  };

  const editRowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInputList([
      ...purchaseDetails,
      {
        productId: "",
        receiveQuantity: 0,
        bonusQuantity: 0,
        orderQuantity: 0,
        //unitId: "",
        unitPrice: 0,
        discount: 0,
        vat: 0,
        newRate: 0,
        expiryDate: new Date().toISOString(),
        manufacturingDate: new Date().toISOString(),
      },
    ]);
  };
  const removeRowClick = (index) => {
    const list = [...purchaseDetails];
    list.splice(index, 1);
    setInputList(list);
  };

  const headers = [
    { label: "Purchase Date", key: "purchaseDate" },
    { label: "Supplier", key: "supplierName" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Purchase">
        {/* <Nav.Link className="nav-link text-light" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link> */}
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="ItemList.csv"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2 mb-2">
        <Col>
          <Row className="mb-2">
            <Form.Group as={Col} sm="3">
              <Supplier
                onChange={(value, action) =>
                  setSearchCriteria({
                    ...searchCriteria,

                    [action.name]: value ? value.value : null,
                  })
                }
                name="supplierId"
              />
            </Form.Group>
            <Form.Group as={Col} sm="3">
              <InputGroup>
                <InputGroup.Text>From</InputGroup.Text>
                <Form.Control
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      fromDate: e.target.value,
                    })
                  }
                  type="date"
                  name="fromDate"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} sm="3">
              <InputGroup>
                <InputGroup.Text>To</InputGroup.Text>
                <Form.Control
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      toDate: e.target.value,
                    })
                  }
                  type="date"
                  name="toDate"
                />
              </InputGroup>
            </Form.Group>
            <Col className="text-end">
              <Nav.Link
                onClick={() => {
                  setMaster({
                    supplierId: "",
                    warehouseId: 1,
                    supplierInvoiceNo: "",
                    deliveryChalanNo: "",
                    remarks: "",
                    totalDiscount: 0,
                    totalVat: 0,
                    purchaseDate: new Date().toISOString(),
                    supplierInvoiceDate: new Date().toISOString(),
                    deliveryInvoiceDate: new Date().toISOString(),
                  });
                  setInputList([{}]);
                  setShowCanvas(true);
                }}
                className="nav-link text-seccess"
              >
                <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
              </Nav.Link>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Table responsive striped hover bordered size="sm">
                    <thead>
                      <tr>
                        <th>Supplier</th>
                        <th>Supplier# Inv</th>
                        <th>Delivery# Inv</th>
                        <th>InvoiceNo</th>
                        {/* <th>QTY</th>
                        <th>QC OUT</th> */}
                        <th>OK QTY</th>
                        <th>Rate</th>
                        <th>Total Amount</th>
                        <th>Received By</th>
                        <th className="actionalign">Action</th>
                        {/* <th>Received Date</th> */}
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
                          key={index}
                          onClick={() => {
                            setMaster(item);
                            setInputList(item.purchaseDetails);
                          }}
                          className={
                            item.id === master.id ? "table-active" : ""
                          }
                        >
                          <td>{item.supplierName}</td>
                          <td>{item.supplierInvoiceNo}</td>
                          <td>{item.deliveryChalanNo}</td>
                          <td>{item.invoiceNo}</td>
                          {/* <td>{item.purchaseDetails
                              .reduce((total, ele) => {
                                return (total += ele.receivedQuantity);
                              }, 0)
                              .toLocaleString()}</td>
                          <td>{item.purchaseDetails
                              .reduce((total, ele) => {
                                return (total += ele.deductQuantity);
                              }, 0)
                              .toLocaleString()}</td> */}
                          <td className="text-end">
                            {item.purchaseDetails
                              .reduce((total, ele) => {
                                return (total += ele.receiveQuantity);
                              }, 0)
                              .toLocaleString()}
                          </td>
                          <td className="text-end">
                            {item.purchaseDetails
                              .reduce((total, ele) => {
                                return (total += ele.unitPrice);
                              }, 0)
                              .toLocaleString()}
                          </td>
                          <td className="text-end">
                            {item.purchaseDetails
                              .reduce((total, ele) => {
                                return (total +=
                                  ele.receiveQuantity * ele.unitPrice);
                              }, 0)
                              .toLocaleString()}
                          </td>
                          <td>{item.modifiedBy}</td>
                          {/* <td>{item.purchaseDate.split("T")[0]}</td> */}
                          <td className="actionalign">
                            {" "}
                            <Button
                              variant="btn btn-sm btn-outline-primary"
                              onClick={() => setShowCanvas(true)}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-edit" />
                            </Button>{" "}
                            <Button
                              variant="btn btn-sm btn-outline-danger"
                              type=""
                              onClick={(e) => removeMasterRowClick(item.id)}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            {master.inventoryNo ? (
              <Col sm="5">
                <Card>
                  <Card.Body>
                    <Row className="mb-2">
                      <Col>
                        <div className="ms-2 mt-2 lh-1">
                          {/* <Image src="/banner.png" className="h-25 w-25" /> */}
                          <h5>Xenora Ltd</h5>
                          <p>Uttara</p>
                          <p>
                            01934858285 <span>jwelamin23@gmail.com</span>
                          </p>
                        </div>
                      </Col>
                      <Col align="right">
                        <div className="me-2 mt-2">
                          <h3>Purchase No</h3>
                          {master.inventoryNo && (
                            <h5># {master.inventoryNo}</h5>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <h6 className="ms-2">Vendor Address</h6>
                      <Col sm={4}>
                        <Table responsive borderless>
                          {master.supplierName && (
                            <tbody align="left">
                              <tr>
                                <td>Supplier :</td>

                                <td>{master.supplierName}</td>
                              </tr>
                            </tbody>
                          )}
                        </Table>
                      </Col>
                      <Col sm={4}></Col>
                      <Col sm={4}>
                        <Table responsive borderless>
                          <tbody align="right">
                            <tr>
                              <td>Receive Date :</td>
                              {master.purchaseDate && (
                                <td>{master.purchaseDate.split("T")[0]}</td>
                              )}
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                    <Table responsive bordered striped>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Order Quantity</th>
                          <th>Receive Qty</th>
                          <th>Bonus Qty</th>
                          <th>Unit Price</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      {master.purchaseDetails && (
                        <tbody>
                          {master.purchaseDetails.map((item, index) => (
                            <tr key={index}>
                              <td>{item.brandName}</td>

                              <td className="text-end">{item.orderQuantity}</td>
                              <td className="text-end">
                                {item.receiveQuantity}
                              </td>
                              <td className="text-end">{item.bonusQuantity}</td>
                              <td className="text-end">{item.unitPrice}</td>
                              <td className="text-end">
                                {(
                                  item.unitPrice * item.receiveQuantity
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          <tr className="fw-bold">
                            <td align="right" colSpan={5}>
                              Total :
                            </td>
                            <td className="text-end">
                              {master.purchaseDetails
                                .reduce((total, iterator) => {
                                  return (total +=
                                    iterator.receiveQuantity *
                                    iterator.unitPrice);
                                }, 0)
                                .toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      )}
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>

      <Offcanvas
        show={showCanvas}
        onHide={() => setShowCanvas(false)}
        placement="end"
        className="w-100"
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton className="header">
          <Offcanvas.Title className="headertextsize">Purchase</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {" "}
          <Card className="card">
            <Card.Body>
              <>
                <Modal
                  size="xl"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  show={show}
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Product Entry</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {" "}
                    <Card>
                      <Card.Body>
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={saveBrands}
                          method="POST"
                        >
                          <Row className="mb-3">
                            <Form.Group as={Col}>
                              <Form.Label>Product</Form.Label>
                              <Product
                                onChange={(value, action) => {
                                  setBrands({
                                    ...brands,
                                    [action.name]: value ? value.value : null,
                                  });
                                }}
                                name="productId"
                                selected={brands.productId}
                              />
                            </Form.Group>

                            <Form.Group as={Col}>
                              <Form.Label>Sub Category</Form.Label>
                              <CategoryDD
                                onChange={(value, action) => {
                                  setBrands({
                                    ...brands,
                                    [action.name]: value ? value.value : null,
                                  });
                                }}
                                name="subCategoryId"
                                selected={brands.subCategoryId}
                                paramId={brands.productGroupId}
                              />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Generics</Form.Label>
                              <Generics
                                onChange={(value, action) => {
                                  setBrands({
                                    ...brands,
                                    [action.name]: value ? value.value : null,
                                  });
                                }}
                                name="genericId"
                                selected={brands.genericId}
                              />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Name</Form.Label>
                              <Form.Control
                                onChange={(e) => handleBrandChange(e)}
                                type="text"
                                name="name"
                                value={brands.name}
                              />
                            </Form.Group>
                          </Row>
                          <Row className="mb-3">
                            <Form.Group as={Col}>
                              <Form.Label>User Type</Form.Label>
                              <UserType
                                onChange={(value, action) => {
                                  setBrands({
                                    ...brands,
                                    [action.name]: value ? value.value : null,
                                  });
                                }}
                                name="userTypeId"
                                selected={brands.userTypeId}
                              />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Manufacturer</Form.Label>
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
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Pack Size</Form.Label>
                              <Form.Control
                                onChange={(e) => handleBrandChange(e)}
                                type="text"
                                name="packSize"
                                value={brands.packSize}
                              />
                            </Form.Group>
                          </Row>
                          <Row className="mb-3">
                            <Form.Group as={Col}>
                              <Form.Label>Retail Price</Form.Label>
                              <Form.Control
                                className="text-end"
                                onChange={(e) => handleBrandChange(e)}
                                type="number"
                                name="retailPrice"
                                value={brands.retailPrice}
                              />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Opening Stock</Form.Label>
                              <Form.Control
                                className="text-end"
                                onChange={(e) => handleBrandChange(e)}
                                type="number"
                                name="openingStock"
                                value={brands.openingStock}
                              />
                            </Form.Group>
                            <Form.Group as={Col}>
                              <Form.Label>Current Stock</Form.Label>
                              <Form.Control
                                className="text-end"
                                onChange={(e) => handleBrandChange(e)}
                                type="number"
                                name="currentStock"
                                value={brands.currentStock}
                              />
                            </Form.Group>
                          </Row>
                          <Row className="mb-3">
                            <Form.Group as={Col}>
                              <Form.Label>ReOrder Point</Form.Label>
                              <Form.Control
                                className="text-end"
                                onChange={(e) => handleBrandChange(e)}
                                type="number"
                                name="reOrderPoint"
                                value={brands.reOrderPoint}
                              />
                            </Form.Group>
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
                            <Button
                              variant="primary"
                              disabled
                              className="float-end"
                            >
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
                              className="float-end"
                            >
                              {brands.id ? "Update" : "Save"}
                            </Button>
                          )}
                        </Form>
                      </Card.Body>
                    </Card>
                  </Modal.Body>
                </Modal>
              </>
              <Form
                noValidate
                validated={validated}
                onSubmit={savePurchase}
                method="POST"
              >
                <Card className="cardbgcolor">
                  <Row className="mb-1">
                    <Col className="col-md-3"> <Form.Control
                        onChange={(e) => handleMaster(e)}
                        type="date"
                        name="purchaseDate"
                        value={master.purchaseDate.split("T")[0]}
                        placeholder="Received Date"
                      /></Col>
                    <Col className="col-md-3">
                      <Row>
                      <InputGroup>
                          <Form.Group as={Col} className="col-md-10">
                          <Supplier
                        onChange={(value, action) =>
                          setMaster({
                            ...master,
                            [action.name]: value ? value.value : null,
                          })
                        }
                        name="supplierId"
                        selected={master.supplierId}
                      
                      />
                          </Form.Group>
                          <Button variant="outline-primary" className="btncolor" onClick={handleShow}>
                            <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                          </Button>
                        </InputGroup>
                   
                      </Row>
                    
                    </Col>
                    <Col className="col-md-3">
                    <Form.Control
                        onChange={(e) => handleMaster(e)}
                        type="text"
                        name="supplierInvoiceNo"
                        value={master.supplierInvoiceNo}
                        placeholder="Supplier Invoice No"
                      />
                    </Col>
                    <Col className="col-md-3">
                    <Form.Control
                        onChange={(e) => handleMaster(e)}
                        type="text"
                        name="deliveryChalanNo"
                        value={master.deliveryChalanNo}
                        placeholder="Delivery Chalan No"
                      />
                    </Col>

                  </Row>
                </Card>
                <Card className="cardbgcolor">
                  <Row className="mb-1">
                    <Col className="col-md-5">
                      <Row className="mb-1">
                         <InputGroup>
                          <Form.Group as={Col} className="col-md-11">
                            <Product
                              onChange={(value, action) => {
                                setRowdata({
                                  ...rowdata,
                                  [action.name]: value ? value.value : null,
                                  ["brandName"]: value ? value.label : null,
                                  ["vat"]: value ? value.vat : null,
                                  ["balance"]: value ? value.balance : null,
                                });
                              }}
                              name="productId"
                              selected={rowdata.productId}
                            />
                          </Form.Group>
                          <Button variant="outline-primary" className="btncolor" onClick={handleShow}>
                            <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                          </Button>
                        </InputGroup>
                      </Row>
                      <Row className="mb-1">
                        <Form.Group as={Col}>
                        
                          <Form.Control
                            className="text-end"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="orderQuantity"
                            value={rowdata.orderQuantity}
                            placeholder="Order Quantity"
                          />
                        </Form.Group>
                        <Form.Group as={Col}>
                          
                          <Form.Control
                            className="text-end"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="receiveQuantity"
                            value={rowdata.receiveQuantity}
                            placeholder="Receive Quantity"
                          />
                        </Form.Group>
                        <Form.Group as={Col}>
                          
                          <Form.Control
                            className="text-end"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="bonusQuantity"
                            value={rowdata.bonusQuantity}
                            placeholder="Bonus Quantity"
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-1">
                        <Col className="col-md-2">
                          <Form.Label className="labelleft">
                            Mfg Date
                          </Form.Label>
                        </Col>

                        <Col className="col-md-4">
                          <Form.Control
                            className="text-end"
                            onChange={(e) => handleRowdata(e)}
                            type="date"
                            name="manufacturingDate"
                            value={rowdata.manufacturingDate}
                          />
                        </Col>

                        <Col className="col-md-2">
                          <Form.Label className="labelleft">
                            Exp Date
                          </Form.Label>
                        </Col>
                        <Col className="col-md-4">
                          <Form.Control
                            className="text-end"
                            onChange={(e) => handleRowdata(e)}
                            type="date"
                            name="expiryDate"
                            value={rowdata.expiryDate}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col className="col-md-3">
                      <Row className="mb-1">
                        <Col className="col-md-4">
                          <Form.Label className="labelleft">
                            Unit Price
                          </Form.Label>
                        </Col>
                        <Col className="col-md-8 mb-1">
                          <Form.Control
                            className="text-end"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="unitPrice"
                            value={rowdata.unitPrice}
                            placeholder="Unit Price"
                            
                          />
                        </Col>
                        <Col className="col-md-4">
                          <Form.Label className="labelleft">
                            New Price
                          </Form.Label>
                        </Col>
                        <Col className="col-md-8">
                          <Form.Control
                            className="text-end"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="newRate"
                            value={rowdata.newRate}
                            placeholder="New Price"
                            readOnly
                          />
                        </Col>
                        <Col className="col-md-6"></Col>
                        <Col className="col-md-6">
                          <Button
                            className="mt-1 btncolor"
                            variant="btn btn-lg btn-outline-light"
                            type=""
                            onClick={addToRowList}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                            ADD
                          </Button>{" "}
                        </Col>
                      </Row>
                    </Col>
                    <Col className="col-md-4">
                      <Row>
                        <Col className="col-md-6">
                          {" "}
                          <Form.Label className="labelleft">
                            Sub Total
                          </Form.Label>
                        </Col>
                        <Col className="col-md-6">
                          <Form.Control
                            className="text-end inputsmall"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="subTotal1"
                            value={rowdata.subTotal1}
                            placeholder="Sub Total"
                            readOnly
                          />
                        </Col>

                        <Col className="col-md-3">
                          <Form.Label className="labelleft">Vat</Form.Label>
                        </Col>
                        <Col className="col-md-3">
                          <Form.Control
                            className="text-end inputsmall"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="vat"
                            value={rowdata.vat}
                          />
                        </Col>
                        <Col className="col-md-6">
                          <Form.Control
                            className="text-end inputsmall"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="subTotal2"
                            value={rowdata.subTotal2}
                            placeholder="sub total"
                            readOnly
                          />
                        </Col>

                        <Col className="col-md-3">
                          <Form.Control
                            className="text-end inputsmall"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="discount"
                            value={rowdata.discount}
                            placeholder="Dis(%)"
                          />
                        </Col>
                        <Col className="col-md-3">
                          <Form.Control
                            className="text-end inputsmall"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="discountAmt"
                            value={rowdata.discountAmt}
                            placeholder="Dis(Amt)"
                          />
                        </Col>

                        <Col className="col-md-6">
                          <Form.Control
                            className="text-end inputsmall"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="subTotal3"
                            value={
                              rowdata.subTotal3 == ""
                                ? 0
                                : rowdata.subTotal3.toFixed(2)
                            }
                          
                            placeholder="sub total"
                            readOnly
                          />
                        </Col>

                        <Col className="col-md-6">
                          <Form.Label className="labelleft">Total</Form.Label>
                          </Col>
                        <Col className="col-md-6">
                          <Form.Control
                            className="text-end inputsmall"
                            onChange={(e) => handleRowdata(e)}
                            type="number"
                            name="totalNewRate"
                            value={
                              rowdata.totalNewRate == ""
                                ? 0
                                : rowdata.totalNewRate.toFixed(2)
                            }
                            placeholder="Total"
                            readOnly
                          
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
                <Card className="cardbgcolor">
                  <Row className="mb-1">
                    <Table striped responsive="sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product</th>
                          <th>UnitPrice</th>
                          <th>R_Qty</th>
                          <th>B_QTY</th>
                          <th>SubTotal</th>
                          <th>Vat....</th>
                          <th>Discount</th>
                          <th>New Cost</th>
                          <th>MRP</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowdataList.map((x, i) => {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{x.brandName}</td>
                              <td>{x.unitPrice}</td>
                              <td>{x.receiveQuantity}</td>
                              <td>{x.bonusQuantity}</td>
                              <td>{x.subTotal1}</td>
                              <td>{x.vat}</td>
                              <td>{x.discountAmt}</td>
                              <td>{x.newRate}</td>
                              <td>{x.newRate}</td>
                              <td>{x.totalNewRate}</td>

                              {/* <td className="text-end">
                             {x.receiveQuantity * x.newRate ==NaN?0:(x.receiveQuantity * x.newRate).toFixed(2)}
                            </td> */}
                              <td className="col-md-1">
                                <Button
                                  variant="btn btn-sm btn-outline-primary"
                                  type=""
                                  onClick={editRowClick}
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                                </Button>{" "}
                                <Button
                                  variant="btn btn-sm btn-outline-danger"
                                  type=""
                                  onClick={(e) => removeRowClick(i)}
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                        {/* <tr className="fw-bold">
                       
                    <td align="right" colSpan={7}>
                        Discount:
                      </td>
                      <td>
                        <Form.Group>
                          <Form.Control
                            className="text-end"
                            onChange={(e) => handleMaster(e)}
                            type="number"
                            name="totalDiscount"
                            value={master.totalDiscount==''?0:master.totalDiscount}
                          />
                        </Form.Group>
                      </td>
                      
                     
                    </tr> */}
                        {/* <tr className="fw-bold">
                      <td align="right" colSpan={12}>
                        Total Price:
                      </td>
                      <td className="text-end">{getInvoiceTotal()}</td>
                      <td></td>
                    </tr> */}
                      </tbody>
                    </Table>
                  </Row>
                  <Card className="cardbgcolor">
                    <Row className="mb-1">
                      <Col>
                      <Row className="mb-1">
                      {/* <Col className="col-md-4">
                      <Form.Label className="labelleft">Remarks</Form.Label>
                      </Col> */}
                      <Col className="col-md-12">
                      <Form.Control
                            onChange={(e) => handleRowdata(e)}
                            type="text"
                            name="remarks"
                            value={rowdata.remarks}
                            placeholder="Remarks"
                          />
                      </Col>
                      <Col className="col-md-3 mt-1">
                      <Form.Label className="labelleft">Upload Invoice</Form.Label>
                      </Col>
                      <Col className="col-md-9 mt-1">
                      <InputGroup>
                          <Form.Group as={Col} className="col-md-11">
                            <Form.Control
                              onChange={(e) => handleRowdata(e)}
                              type="text"
                              name="remarks"
                              value={rowdata.remarks}
                            />
                          </Form.Group>
                          <Button variant="outline-primary" onClick={handleShow} className="btncolor">
                            <FontAwesomeIcon icon="fa-solid fa-search" />
                          </Button>
                        </InputGroup>
                      </Col>

                       
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <Col className="col-md-3">
                            <Form.Label className="labelleft">Sub Total</Form.Label>
                            </Col>
                          <Col className="col-md-3">
                          <Form.Control
                              className="text-end inputsmall"
                              onChange={(e) => handleRowdata(e)}
                              type="number"
                              name="totalSubTotal"
                              value={master.totalSubTotal}
                              readOnly
                            />
                          </Col>
                          <Col className="col-md-3"> 
                          <Form.Label className="labelleft">Total</Form.Label>
                          </Col>
                          <Col className="col-md-3"><Form.Control
                              className="text-end inputsmall"
                              onChange={(e) => handleRowdata(e)}
                              type="number"
                              name="grandTotal"
                              value={master.grandTotal}
                              readOnly
                            /></Col>
                          <Col className="col-md-3">
                            <Form.Label className="labelleft">Vat</Form.Label>
                            </Col>
                          <Col className="col-md-3"><Form.Control
                              className="text-end inputsmall"
                              onChange={(e) => handleRowdata(e)}
                              type="number"
                              name="totalVat"
                              value={master.totalVat}
                              readOnly
                            /></Col>
                          <Col className="col-md-3">
                            <Form.Label className="labelleft">Product Discount</Form.Label>
                            </Col>
                          <Col className="col-md-3"><Form.Control
                              className="text-end inputsmall"
                              onChange={(e) => handleRowdata(e)}
                              type="number"
                              name="totalDiscount"
                              value={master.totalDiscount}
                              readOnly
                            /></Col>
                          <Col className="col-md-3">
                            <Form.Label className="labelleft">Line Discount</Form.Label>
                            </Col>
                          <Col className="col-md-3"><Form.Control
                              className="text-end inputsmall"
                              onChange={(e) => handleRowdata(e)}
                              type="number"
                              name="totalLineDiscount"
                              value={master.totalLineDiscount}
                              readOnly
                            /></Col>
                          <Col className="col-md-3">
                            <Form.Label className="labelleft">Payble Amount</Form.Label>
                            </Col>
                          <Col className="col-md-3"><Form.Control
                              className="text-end inputsmall"
                              onChange={(e) => handleRowdata(e)}
                              type="number"
                              name="totalPayableAmount"
                              value={master.totalPayableAmount}
                              readOnly
                            /></Col>
                          
                         
                        </Row>
                      </Col>
                    </Row>
                  </Card>

                  {/* <Button variant="light" type="submit" as={Col} sm={1}>
                  Cancel
                </Button>
                {reqResponse.loading ? (
                  <Button variant="primary" disabled className="float-end" as={Col} sm={1}>
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
                  <Button variant="primary" type="submit" className="float-end" as={Col} sm={1}>
                    Save
                  </Button>
                )} */}
                  <div className="btn-toolbar text-end">
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
                      <Button
                        variant="primary"
                        type="submit"
                        className="btncolor"
                      >
                        {master.id ? "Update" : "Save"}
                      </Button>
                    )}
                  </div>
                </Card>
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default Purchase;
