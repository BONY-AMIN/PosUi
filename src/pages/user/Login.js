
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Form, Row, Button, Image, Spinner } from "react-bootstrap";

const LogIn = () => {
  let navigate = useNavigate();
  const [messages, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    var { phoneNumber, password } = event.target;
    setLoading(true);
    var postType = "Auth/Login";
    var postData = JSON.stringify({
          phoneNumber: phoneNumber.value,
          password: password.value,
        });
    console.log(postData);
    const response = await fetch(process.env.REACT_APP_API_URL + postType, {
      body: postData,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    if (response.ok) {
      var result = await response.json();
      
      if (result.access_Token === "Error") {
        setMessage([{ error: "Invalid Email or Password" }]);
        setLoading(false);
        return;
      }
      console.log(result);
      localStorage.setItem("token", result.access_Token);
      // fetching user
      console.log(phoneNumber.value);
      fetch(process.env.REACT_APP_API_URL + "Auth/" + phoneNumber.value, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          localStorage.setItem("user", JSON.stringify(result));
          navigate("/dashboard");
          // if (result.companyId == null) {
          //   navigate("/companyprofile");
          // } else {
            
          // }
        })
        .catch((err) => {
          console.log(err);
        });

      //fetching company
      // const userfromToken = JSON.parse(localStorage.getItem("user"));
      // fetch(
      //   process.env.REACT_APP_API_URL + "Company/" + userfromToken.companyId,
      //   {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },
      //   }
      // )
      //   .then((res) => res.json())
      //   .then((result) => {
      //     console.log(result);
      //     localStorage.setItem("company", JSON.stringify(result));
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      setLoading(false);
    } else {
      setLoading(false);
      setMessage([{ error: "Invalid Username or Password" }]);
    }
  };

  // const handleSubmit = async (event) => {
  //     //navigate("/dashboard");
  //   event.preventDefault();
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.stopPropagation();
  //     setValidated(true);
  //     return;
  //   }
  //   const { userName, password } = event.target;
  //   setLoading(true);

  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  //   const urlencoded = new URLSearchParams();
  //   urlencoded.append("UserName", userName.value);
  //   urlencoded.append("Password", password.value);
  //   urlencoded.append("grant_type", "password");

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: urlencoded,
  //     redirect: "follow",
  //   };

  //   fetch(process.env.REACT_APP_LOGIN_API_URL, requestOptions)
  //     .then((res) => {
  //       if (res.ok) {
  //         res.json().then((result) => {
  //           setLoading(false);
  //           if (result.access_token === "Error") {
  //             setMessage([{ error: "Invalid Email or Password" }]);
  //             return;
  //           } else {
  //             localStorage.setItem(
  //               "user",
  //               JSON.stringify({
  //                 userName: result.userName,
  //                 fullName: result.fullName,
  //                 role: result.role,
  //               })
  //             );
  //             localStorage.setItem("token", result.access_token);
  //             navigate("/dashboard");
  //           }
  //         });
  //       } else {
  //         setMessage([{ error: "Invalid Email or Password" }]);
  //       }
  //       setLoading(false);
  //       setValidated(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoading(false);
  //     });
  // };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <Card>
        <Card.Body>
          <Row>
            <Col className="p-5">
              <Row className="justify-content-md-center mb-2">
                <Image
                  src="/logo.png"
                  className="img-fluid"
                  alt="Logo"
                  placeholder="logo"
                  title="logo"
                  style={{ maxHeight: "100px", maxWidth: "150px" }}
                />
              </Row>

              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                method="POST"
              >
                {messages.map((item) => (
                  <li className="text-danger" key={item}>
                    {item.error && item.error}
                  </li>
                ))}

                <Row className="mb-3">
                  {/* <Form.Group>
                    <Form.Label>User Name</Form.Label>
                    <Form.Control name="userName" required />
                  </Form.Group> */}
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control name="phoneNumber" required />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      maxLength="30"
                      required
                    />
                  </Form.Group>
                </Row>

                {loading ? (
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
                    Login
                  </Button>
                )}
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LogIn;
