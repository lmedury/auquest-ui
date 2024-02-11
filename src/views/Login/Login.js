import React from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { AXIOS_BACKEND_URL } from "../../assets/js/constants";
import { useAuth0 } from "@auth0/auth0-react";

export default function Login(props) {

    const {loginWithRedirect} = useAuth0();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const login = async () => {
        const userData = {
            'email': email,
            'password': password
        }
        const userLogin = await axios.post(`${AXIOS_BACKEND_URL}/users/login`, userData, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
            });
        if(userLogin.data.success){
            window.location.href = "/home";
        }
    }

    return(
        <Container>
            <h1 className="text-center">Login</h1>
            <Row>
                <Col md={{span: 6, offset:3}}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                        </Form.Group>
                        <div className="text-center">
                            <Button onClick={login} variant="primary" className="text-center" style={{width:200}}>
                                Login
                            </Button>
                        </div>
                        <div className="text-center">
                            <Button onClick={() => loginWithRedirect()} style={{width:200}} variant="warning" className="text-center">
                                Login with Auth0
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}