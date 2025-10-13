import { Fragment } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useWidgetsValueFetch from "../hooks/useWidgetsValueFetch";
const Store = ({ searchCriteria }) => {
  const [store] = useWidgetsValueFetch("Dashboard/Store?", searchCriteria);

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <h6 className="text-black-50">Store</h6>
              <h5>{store}</h5>
              <h6 className="text-black-50">{searchCriteria.store}</h6>
            </Col>
            <Col className="d-flex justify-content-center align-items-center ">
              <div className="bg-primary bg-opacity-10 rounded-circle">
                <FontAwesomeIcon
                  icon="fa-solid fa-user-group"
                  className="text-primary fs-1 p-4"
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default Store;
