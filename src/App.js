import { Routes, Route } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import TopNavigation from "./components/layout/TopNavigation";
import Footer from "./components/layout/Footer";

import Dashboard from "./pages/Dashboard";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import UserConfig from "./pages/user/UserConfig";

import ParentAccount from "./pages/accounting/ParentAccount";
import SubsidiaryAccount from "./pages/accounting/SubsidiaryAccount";

import ChangePassword from "./pages/user/ChangePassword";
import Product from "./pages/settings/Product";
import UnitSetup from "./pages/settings/UnitSetup";
import ProductGroup from "./pages/settings/ProductGroup";
import Generics from "./pages/settings/Generics";
import Brand from "./pages/settings/Brand";
import Category from "./pages/settings/Category";
import Store from "./pages/settings/Store";
import Country from "./pages/settings/Country";
import Supplier from "./pages/settings/Supplier";
import Manufacturer from "./pages/settings/Manufacturer";
import InventoryReceive from "./pages/purchase/InventoryReceive";
import Sells from "./pages/sell/Sells";
library.add(fas, far);

const App = () => {
  const token = localStorage.getItem("token");

  // let message = "Welcome to ArunimaERP!";

  // if (Notification.permission === "granted") {
  //   const notification = new Notification(message);
  // } else if (Notification.permission !== "denied") {
  //   Notification.requestPermission().then((permission) => {
  //     if (permission === "granted") {
  //       const notification = new Notification(message);
  //     }
  //   });
  // }

  return (
    <div>
      {/* {token === null || token === "" || token === "Error" ?( */}
        <div>
          <TopNavigation />
          <Container fluid>
            <Row>
              <Col sm className="mt-2 min-vh-100">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
               
                  <Route path="/usersetup" element={<UserConfig />} />
                  <Route path="/changepassword" element={<ChangePassword />} />
                 
                  <Route path="/parentaccount" element={<ParentAccount />} />
                 
                  <Route
                    path="/subsidiaryaccount"
                    element={<SubsidiaryAccount />}
                  />
                              
                              
                   <Route path="/product" element={<Product />} />
                
                
                  <Route path="/unitsetup" element={<UnitSetup />} />
                  <Route path="/productGroup" element={<ProductGroup />} />
                  <Route path="/generics" element={<Generics />} />
                  <Route path="/brand" element={<Brand />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/country" element={<Country />} />
                  <Route path="/supplier" element={<Supplier />} />
                  <Route path="/manufacturer" element={<Manufacturer />} />

                  {/* purchase */}
                  <Route path="/inventoryreceive" element={<InventoryReceive />} />
                  <Route path="/sells" element={<Sells />} />
                  <Route path="/category" element={<Category />} />
                
                  <Route path="/" element={<Dashboard />} />
                </Routes>
              </Col>
              <Footer />
            </Row>
          </Container>
        </div>
      {/* ) : (
        //<Navigate to="/login" />
        <Navigate to="/dashboard" />
      )} */}
    </div>
  );
};

export default App;
