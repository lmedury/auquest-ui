import axios from "axios";
import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { AXIOS_BACKEND_URL } from "../../assets/js/constants";

export default function Profile() {

    const [userInformation, setUserInformation] = React.useState();

    React.useEffect(() => {
        async function getUserInformation() {
            const session = await axios.get(`${AXIOS_BACKEND_URL}/users/session`, {withCredentials: true});
            if(session.data.user) {
                const userData = await axios.get(`${AXIOS_BACKEND_URL}/users/user`, {params: {
                    'email': session.data.user
                }, withCredentials: true});
                setUserInformation(userData.data[0]);
            }
        }
        getUserInformation();
    }, [])

    return(
        <Container>
            <h1 className="text-center">Profile</h1>
            {userInformation && userInformation.Email ? 
            <Form>
                <Row>
                    <Col md={{span: 4, offset:2}}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control readOnly disabled value={userInformation.Name} type="text" />
                        </Form.Group>
                    </Col>
                    <Col md={{span: 4}}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control readOnly disabled value={userInformation.Email} type="text" />
                        </Form.Group>
                    </Col>
                    <Col md={{span: 8, offset:2}}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>About</Form.Label>
                            <Form.Control as="textarea" rows="3" value={userInformation.About} type="text" />
                        </Form.Group>
                    </Col>
                    <Col md={{span: 4, offset:2}}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control value={userInformation.Phone} type="text" />
                        </Form.Group>
                    </Col>
                    <Col md={{span: 4}}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Change Password</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="text-center">
                    <Col>
                        <Button variant="warning">Update Information</Button>
                    </Col>
                </Row>
            </Form> : <></> }
            
        </Container>
    )
}