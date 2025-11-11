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
  
} from "react-bootstrap";
import { toast } from "react-toastify";

import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Brand } from "../../components/DropDown";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const Sale = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [validated, setValidated] = useState(false);
  const [master, setMaster] = useState({
    remarks:"",
    totalDiscount:0,
    sellDate: new Date().toISOString(),
    sellDetails: [],
  });

  const [rowdata, setRowdata] = useState({
   discount:'',
   discountAmt:'',
   brandId:'',
   quantity:'',
   vat:'',
   balance:'',
   unitPrice:'',
   newRate:'',
   totalNewRate:''
  });
  const [rowdataList, setRowDataList] = useState([]);
  const [sellDetails, setInputList] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllSells = useCallback(() => {
    setValidated(false);
    getData(
      "Sell?" + new URLSearchParams(searchCriteria),
      "GET"
    );
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllSells();
  }, [getAllSells]);

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
    if(name==='discount'){
    rowdata.discountAmt=rowdata.unitPrice*(value/100);
    rowdata.newRate=(rowdata.unitPrice-rowdata.unitPrice*(value/100));
    rowdata.totalNewRate=((rowdata.quantity * (rowdata.unitPrice-rowdata.unitPrice*(value/100))) +Number(rowdata.vat==''?0:rowdata.vat));
    }
    if(name==='discountAmt'){
      rowdata.discount=100*(value/rowdata.unitPrice);
      rowdata.newRate=(rowdata.unitPrice-value);
      rowdata.totalNewRate=((rowdata.quantity * (rowdata.unitPrice-value)) +Number(rowdata.vat==''?0:rowdata.vat));
      }
      if(name==='vat'){
        rowdata.newRate=(rowdata.unitPrice-Number(rowdata.discountAmt));
        rowdata.totalNewRate=((rowdata.quantity * (rowdata.unitPrice-Number(rowdata.discountAmt))) + Number(value));
        }
    setRowdata({ ...rowdata, [name]: value });
  };
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    let list = [...sellDetails];
    list[index][name] = value;
    // if (name === "receiveQuantity" || name === "bonusQuantity"|| name === "unitPrice"){
    //   list[index]["newRate"] =
    //       (Number(list[index]["receiveQuantity"]) * Number(list[index]["unitPrice"])/ Number(list[index]["receiveQuantity"]) - Number(list[index]["bonusQuantity"]));
    // }
    setInputList(list);
  };

  const handleMaster = (event) => {
    const { name, value } = event.target;

    setMaster({ ...master, [name]: value });
    // if(name=="discount"){
    //   let list = [...inventoryDetails];
    //   let avgdis=0;
    //   avgdis=value/inventoryDetails.length;
    //   console.log(avgdis);
    //   inventoryDetails.forEach((val,index)=>
      
    //   list[index]["newRate"] = (val.receiveQuantity* val.unitPrice)/(val.receiveQuantity-val.bonusQuantity)- (Number(avgdis)/Number(val.receiveQuantity)),
    //   );
    //   setInputList(list);
    // }
    
  };

 

  const getInvoiceTotal = () => {
    let sum = 0;
    let discount = master.totalDiscount ? master.totalDiscount : 0;
    rowdataList.forEach((el) => (sum += Number(el.totalNewRate)));
    return Number(sum) - Number(discount);
  };
 
  const saveSells = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    master.sellDetails = rowdataList;
    const methodType = master.id ? "PUT" : "POST";
    saveData("Sell", methodType, master, getAllSells);
  };
 
  const removeMasterRowClick = (id) => {
    console.log(id);
    deleteData(
      "Sell/" + id,
      "DELETE",
      getAllSells
    );
  };

  const editRowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRowDataList([
      ...rowdataList,
      {
        brandId: "",
        brandName: "",
        quantity: 0,
        discount:'',
        discountAmt:'',
        vat:'',
        //unitId: "",
        unitPrice: 0,
        discount:'',
        newRate:0,
        totalNewRate:0 
      },
    ]);
  };
  const addToRowList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRowDataList([
      ...rowdataList,
      {
        brandId: rowdata.brandId,
        brandName: rowdata.brandName,
        quantity: rowdata.quantity,
        discount:rowdata.discount,
        discountAmt:rowdata.discountAmt,
        vat:rowdata.vat,
        unitPrice: rowdata.unitPrice,
        newRate:rowdata.newRate,
        totalNewRate:rowdata.totalNewRate,
      },
    ]);
  };
  const removeRowClick = (index) => {
    const list = [...sellDetails];
    list.splice(index, 1);
    setInputList(list);
  };

  const headers = [
    { label: "Sell Date", key: "sellDate" },
    { label: "Supplier", key: "supplierName" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Sale">
        <Nav.Link
          onClick={() => {
            setMaster({ 
            remarks:"",
            totalDiscount:0,
            sellDate: new Date().toISOString(),
            });
            setInputList([{}]);
            setShowCanvas(true);
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
          filename="ItemList.csv"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2 mb-2">
        <Col>
          <Row className="mb-2">
            
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
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Table responsive striped hover size="sm">
                    <thead>
                      <tr>
                       
                        <th>SellNo</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>New Rate</th>
                        <th>Total Amount</th>
                        <th>Sell By</th>
                        {/* <th>Sell Date</th> */}
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
                            setInputList(item.sellDetails);
                          }}
                          className={
                            item.id === master.id ? "table-active" : ""
                          }
                        >
                         
                          <td>{item.sellNo}</td>
                         
                          <td>{item.sellDetails
                              .reduce((total, ele) => {
                                return (total += ele.quantity);
                              }, 0)
                              .toLocaleString()}</td>
                          <td>{item.sellDetails
                              .reduce((total, ele) => {
                                return (total += ele.unitPrice);
                              }, 0)
                              .toLocaleString()}</td>
                          <td>{item.sellDetails
                              .reduce((total, ele) => {
                                return (total +=ele.newRate);
                              }, 0)
                              .toLocaleString()}</td>
                               <td>{item.sellDetails
                              .reduce((total, ele) => {
                                return (total +=ele.newRate * ele.quantity);
                              }, 0)
                              .toLocaleString()}</td>
                          <td>{item.modifiedBy}</td>
                          {/* <td>{item.inventoryDate.split("T")[0]}</td> */}
                          <td>
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
                              onClick={(e) =>
                                removeMasterRowClick(item.id)
                              }
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
            {master.sellNo?(<Col sm="5">
            <Card>
              <Card.Body>
                <Row className="mb-2">
                  <Col>
                    <div className="ms-2 mt-2 lh-1">
                      {/* <Image src="/banner.png" className="h-25 w-25" /> */}
                      <h5>Easy Pharma</h5>
                      <p>Uttara</p>
                      <p>
                        01934858285 <span>jwelamin23@gmail.com</span>
                      </p>
                    </div>
                  </Col>
                  <Col align="right">
                    <div className="me-2 mt-2">
                      <h3>Sell No</h3>
                      {master.sellNo && (
                        <h5># {master.sellNo}</h5>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <h6 className="ms-2">Customer Address</h6>
                  <Col sm={4}>
                    <Table responsive borderless>
                      {master.customerPhoneNo && (
                        <tbody align="left">
                          <tr>
                            <td>Phone :</td>

                            <td>{master.customerPhoneNo}</td>
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
                          <td>Sell Date :</td>
                          {master.sellDate && (
                            <td>{master.sellDate.split("T")[0]}</td>
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
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Discount</th>
                      <th>New Price</th>
                      <th>Total Amount</th>
                     
                    </tr>
                  </thead>
                  {master.sellDetails && (
                    <tbody>
                      {master.sellDetails.map((item, index) => (
                        <tr key={index}>
                          <td>{item.brandName}</td>
                          <td>{item.quantity}</td>
                          <td>{item.unitPrice}</td>
                          <td>{item.discount}</td>
                          <td>{item.newRate}</td>
                          <td>
                            {(item.quantity* item.newRate).toLocaleString()}
                          </td>
                         
                        </tr>
                      ))}
                      <tr className="fw-bold">
                        <td align="right" colSpan={5}>
                          Total :
                        </td>
                        <td>
                          {master.sellDetails
                            .reduce((total, iterator) => {
                              return (total +=
                                iterator.quantity * iterator.newRate);
                            }, 0)
                            .toLocaleString()}
                        </td>
                        
                      </tr>
                    </tbody>
                  )}
                </Table>
              </Card.Body>
            </Card></Col>):null}
            
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
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sale</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {" "}
          <Card>
            <Card.Body>
                   
              <Form
                noValidate
                validated={validated}
                onSubmit={saveSells}
                method="POST"
              >
                <Row className="mb-2">
                  <Form.Group as={Col} sm="2">
                    <Form.Label>Sell Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleMaster(e)}
                      type="date"
                      name="sellDate"
                      value={master.sellDate.split("T")[0]}
                    />
                  </Form.Group>

                  <Form.Group as={Col} sm="2">
                    <Form.Label>Customer Phone</Form.Label>
                    <Form.Control
                      onChange={(e) => handleMaster(e)}
                      type="text"
                      name="customerPhoneNo"
                      value={master.customerPhoneNo}
                    />
                  </Form.Group>
                                   
                </Row>
                <Row className="mb-2">
                 <Form.Group className="col-md-2" as={Col}>
                                 
                    <Form.Label>Product</Form.Label>
                      <Brand 
                        onChange={(value, action) => {
                          setRowdata({
                            ...rowdata,
                            [action.name]: value ? value.value : null,
                          ['brandName']:value ? value.label : null,
                          ['vat']:value ? value.vat : null,
                          ['balance']:value ? value.balance : null,
                          
                          });
                        
                        }}
                        name="brandId"
                        selected={rowdata.brandId}
                      />
                           </Form.Group>
                              <Form.Group as={Col}>
                            <Form.Label>Balance</Form.Label>
                            <Form.Control
                               className="text-end"
                                onChange={(e) => handleRowdata(e)}
                                type="number"
                                name="balance"
                                value={rowdata.balance}
                                readOnly
                              />
                              </Form.Group>
                              <Form.Group as={Col}>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                               className="text-end"
                                onChange={(e) => handleRowdata(e)}
                                type="number"
                                name="quantity"
                                value={rowdata.quantity}
                              />
                              </Form.Group>
                              <Form.Group as={Col}>
                              <Form.Label>Unit Price</Form.Label>
                            <Form.Control
                                className="text-end"
                                onChange={(e) => handleRowdata(e)}
                                type="number"
                                name="unitPrice"
                                value={rowdata.unitPrice}
                              />
                               </Form.Group>
                               <Form.Group as={Col}>
                               <Form.Label>Discount(%)</Form.Label>
                            <Form.Control
                                className="text-end"
                                onChange={(e) => handleRowdata(e)}
                                type="number"
                                name="discount"
                                value={rowdata.discount}
                              />
                              </Form.Group>
                              <Form.Group as={Col}>
                               <Form.Label>Discount(Amt)</Form.Label>
                            <Form.Control
                                className="text-end"
                                onChange={(e) => handleRowdata(e)}
                                type="number"
                                name="discountAmt"
                                value={rowdata.discountAmt}
                              />
                              </Form.Group>
                              <Form.Group as={Col}>
                               <Form.Label>Vat</Form.Label>
                            <Form.Control
                                className="text-end"
                                onChange={(e) => handleRowdata(e)}
                                type="number"
                                name="vat"
                                value={rowdata.vat}
                              />
                              </Form.Group>
                               <Form.Group as={Col}>
                               <Form.Label>New Price</Form.Label>
                            <Form.Control
                                className="text-end"
                                onChange={(e) => handleRowdata(e)}
                                type="number"
                                name="newRate"
                                value={rowdata.newRate}
                                readOnly
                              />
                              </Form.Group>
                               <Form.Group as={Col}>
                               <Form.Label>Total Price</Form.Label>
                            <Form.Control
                                className="text-end"
                                onChange={(e) => handleRowdata(e)}
                                type="number"
                                name="totalNewRate"
                                value={rowdata.totalNewRate}
                                readOnly
                              />
                              </Form.Group>
                              <Form.Group as={Col}>
                              <Button 
                               className="mt-4"
                                  variant="btn btn-sm btn-outline-primary"
                                  type=""
                                  onClick={addToRowList}
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                                </Button>{" "}
                                </Form.Group>
                              
                </Row>


                <Row className="mb-4">
                  
                  <Table striped responsive="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Discount(%)</th>
                        <th>Discount(Amt)</th>
                        <th>Vat</th>
                        <th>New Price</th>
                        <th>Total Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowdataList.map((x, i) => {
                        return (
                          <tr key={i}>
                            <td className="sm">{i + 1}</td>
                            <td>{x.brandName}</td>
                            <td>{x.quantity} </td>
                            <td> {x.unitPrice}</td>
                            <td> {x.discount}</td>
                            <td> {x.discountAmt}</td>
                            <td> {x.vat}</td>
                            <td> {x.newRate}</td>
                            <td>{x.totalNewRate}</td>
                            <td>
                                <Button
                                  variant="btn btn-sm btn-outline-primary"
                                  type=""
                                  onClick={editRowClick}
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-edit" />
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
                      <tr className="fw-bold">
                        <td align="right">
                          Remarks:
                        </td>
                        <td colSpan={5}>
                    <Form.Group>
                    <Form.Control
                      onChange={(e) => handleMaster(e)}
                      type="text"
                      name="remarks"
                      value={master.remarks}
                    />
                  </Form.Group>
                        </td>
                    <td align="right">
                        Discount:
                      </td>
                      <td colSpan={2}>
                        <Form.Group>
                          <Form.Control
                            onChange={(e) => handleMaster(e)}
                            type="number"
                            name="totalDiscount"
                            value={master.totalDiscount}
                          />
                        </Form.Group>
                      </td>
                      
                     
                    </tr>
                    <tr className="fw-bold">
                      <td align="right" colSpan={8}>
                        Total Price:
                      </td>
                      <td>{getInvoiceTotal()}</td>
                      <td></td>
                    </tr>
                    </tbody>
                  </Table>
                  
                </Row>
                
                <Button variant="light" type="submit" as={Col} sm={1}>
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
                  <Button variant="primary" type="submit" className="float-end" >
                    Save
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default Sale;
