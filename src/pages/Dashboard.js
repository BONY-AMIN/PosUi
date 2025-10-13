import { Row, Col } from "react-bootstrap";
import Store from "../components/widgets/Store";

import Actionbar from "../components/layout/Actionbar";
import ManPower from "../components/widgets/ManPower";
import NewJoin from "../components/widgets/NewJoin";
import DropOut from "../components/widgets/DroOut";
import { useState } from "react";

const Dashboard = () => {
 

  const [searchCriteria, setSearchCriteria] = useState({ store: "Uttara" });

  return (
    <div>
      <Actionbar pageTitle="Dashboard">
       
      </Actionbar>

      <Row className="mt-2">
        <Col md={3}>
          <ManPower searchCriteria={searchCriteria} />
        </Col>
        <Col md={3}>
          <Store searchCriteria={searchCriteria} />
        </Col>
        <Col md={3}>
          <NewJoin searchCriteria={searchCriteria} />
        </Col>
        <Col md={3}>
          <DropOut searchCriteria={searchCriteria} />
        </Col>
      </Row>
    
    </div>
  );
};

export default Dashboard;
