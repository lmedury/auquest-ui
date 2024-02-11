import React from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { AXIOS_BACKEND_URL } from "../../assets/js/constants";
import { Modal } from "react-bootstrap";
import NotificationToast from "../../components/Toasts/CornerToast";

export default function Registration(props) {

    const [email, setEmail] = React.useState('');
    const [mobile, setMobile] = React.useState('');
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [otpSent, setOtpSent] = React.useState(false);
    const [otp, setOtp] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [about, setAbout] = React.useState('');

    const sendOtp = async () => {
        const domain = email.split('auburn.edu');
        const isAuburnEmail = domain.length > 1 ? true : false;
        if(isAuburnEmail && mobile.length === 10 && password.length >= 6){
            const postData = {
                'email': email
            }
            await axios.post(`${AXIOS_BACKEND_URL}/email/send-otp`, postData);
            setOtpSent(true);
        } else {
            setErrorMessage('Must use an Auburn email, a valid phone number, and a password of 6+ characters');
        }   
    }

    const verifyOtp = async () => {
        const postData = {
            'email': email,
            'otp': otp
        }
        try{
            const verify = await axios.post(`${AXIOS_BACKEND_URL}/email/verify-otp`, postData);
            if(verify.data.success){
                setOtpSent(false);
                const userData = {
                    'name': name,
                    'about': about,
                    'password': password,
                    'email': email,
                    'phone': mobile
                }
                const createUser = await axios.post(`${AXIOS_BACKEND_URL}/users/new`, userData);
                if(createUser.data.success) {
                    setSuccessMessage('Congratulations! You have created your profile.');
                }
            }
        } catch (err) {
            setErrorMessage('Invalid OTP. Please try again');
        }
        
    }

    return(
        <Container>
            <h1 className="text-center">Registration</h1>
            {errorMessage && errorMessage.length > 0 ? 
                <NotificationToast
                    message={errorMessage}
                    show={errorMessage.length > 0 ? true : false}
                    onClose={() => {
                        setErrorMessage('');
                    }}
                    variant="danger"
                /> : <></>
            }
            {successMessage && successMessage.length > 0 ? 
                <NotificationToast
                    message={successMessage}
                    show={successMessage.length > 0 ? true : false}
                    onClose={() => {
                        setSuccessMessage('');
                    }}
                    variant="success"
                /> : <></>
            }
            <Modal show={otpSent} onHide={() => setOtpSent(false)}>
                <Modal.Header closeButton>
                <Modal.Title>OTP Verification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>A one-time password has been sent to your Auburn email.</p>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>One-Time Password</Form.Label>
                        <Form.Control onChange={(e) => setOtp(e.target.value)} type="number" placeholder="Enter OTP" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() =>setOtpSent(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => verifyOtp()}>
                    Verify OTP
                </Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <Col md={{span: 6, offset:3}}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Auburn Email Address</Form.Label>
                            <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control onChange={(e) => setMobile(e.target.value)} type="text" placeholder="Enter Mobile" />
                            <Form.Text className="text-muted">
                            We'll never share your mobile number with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Name" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>About me:</Form.Label>
                            <Form.Control onChange={(e) => setAbout(e.target.value)} as="textarea" placeholder="Tell something about yourself. Example: I am Lalith, currently a Ph.D. student in CSSE dept." rows={3} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="I agree to the terms and conditions and the privacy policy" />
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="primary" onClick={sendOtp} className="text-center">
                                Register
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            
        </Container>
    )
}