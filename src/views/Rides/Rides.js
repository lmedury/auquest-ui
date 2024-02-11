import axios from "axios";
import React from "react";
import { Container, Row, Col, Card, Form, Button, Table, Badge } from "react-bootstrap";
import { AXIOS_BACKEND_URL, IPFS_URL } from "../../assets/js/constants";
import buyImage from "../../assets/img/offer-ride.gif";
import sellImage from "../../assets/img/ride.gif";
import RideCard from "../../components/Cards/RideCard";
import ModalWithImage from "../../components/Modals/ModalWithImage";

export default function Rides() {

    const [action, setAction] = React.useState();
    const [offers, setOffers] = React.useState();
    const [userInformation, setUserInformation] = React.useState();
    const [rides, setRides] = React.useState();
    const [carName, setCarName] = React.useState();
    const [origin, setOrigin] = React.useState();
    const [destination, setDestination] = React.useState();
    const [rideDate, setRideDate] = React.useState();
    const [rideStart, setRideStart] = React.useState();
    const [rideCost, setRideCost] = React.useState();
    const [capacity, setCapacity] = React.useState();
    const [location, setLocation] = React.useState();
    const [success, setSuccess] = React.useState();
    const [successMessage, setSuccessMessage] = React.useState();

    const postRide = async () => {
        const postData = {
            'postedBy': userInformation.Email,
            'car': carName,
            'origin': origin,
            'destination': destination,
            'date': rideDate,
            'time': rideStart,
            'cost': rideCost,
            'capacity': capacity,
            'location': location
        }
        try{
            const result = await axios.post(`${AXIOS_BACKEND_URL}/rides/post`, postData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
                });
            if(result.data.success) {
                setSuccess(true);
                setSuccessMessage("Your ride has been posted");
            }
        } catch (err) {
            
        }
    }

    React.useEffect(() => {
        async function getUserInformation() {
            const session = await axios.get(`${AXIOS_BACKEND_URL}/users/session`, {withCredentials: true});
            if(session.data.user) {
                const userData = await axios.get(`${AXIOS_BACKEND_URL}/users/user`, {params: {
                    'email': session.data.user
                }, withCredentials: true});
                setUserInformation(userData.data[0]);
            } else {
                window.location.href = "/login"
            }
            
        }
        getUserInformation();
    }, [])

    React.useEffect(() => {
        async function getRides() {
            let items = await axios.get(`${AXIOS_BACKEND_URL}/rides/all`, {withCredentials: true});
            items = items.data;
            const formattedItems = [];
            for (let i=0; i<items.length; i++) {
                const item = {
                    'destination': items[i].destination,
                    'origin': items[i].origin,
                    'date': items[i].date,
                    'time': items[i].time,
                    'cost': parseInt(items[i].cost),
                    'capacity': parseInt(items[i].capacity),
                    'location': items[i].location,
                    'postedBy': items[i].postedBy,
                    'id': items[i]._id
                };
                formattedItems.push(item);
            }
            setRides(formattedItems);
        }
        getRides();
    }, [])

    return(
        <Container>
            <ModalWithImage
                show={success}
                message={successMessage}
                title="Woohoo!" 
                handleClose={() => window.location.href="/rides"} />
            {!action ? 
                <Row>
                    <Col lg={{span:3, offset: 3}}>
                        <Card className="custom-card pointer" onClick={() => setAction('offer')}>
                            <Card.Img variant="top" className="card-image" src={buyImage}/>
                            <Card.Body>
                                <Card.Title>Offer a Ride</Card.Title>
                                <Card.Text>
                                    Heading to Atlanta airport? Want to split gas?
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="3">
                        <Card className="custom-card pointer" onClick={() => setAction('request')}>
                            <Card.Img variant="top" className="card-image" src={sellImage} />
                            <Card.Body>
                                <Card.Title>Request a Ride</Card.Title>
                                <Card.Text>
                                    Need to go to Atlanta airport? Want to go to vacation with new friends?
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                </Row> : <></>
            }
            {action === 'request' && rides && rides.length > 0 ? 
            <Row>
                <p>Rides Available:</p>
                {rides.map(ride => 
                    <Col key={ride.id} md="4" lg="3">
                        <RideCard
                            origin={ride.origin}
                            cost={ride.cost}
                            date={ride.date}
                            time={ride.time}
                            capacity={ride.capacity}
                            destination={ride.destination}
                            price={ride.rent}
                            id={ride.id}
                        />
                    </Col>
                )}
            </Row> : action === 'offer' ?
            <Row>
                <h2 className="text-center">Offer Ride</h2>
                <Col md={{span: 6, offset:3}}>
                    <Form>
                        
                        <Row>
                            <Col md="12">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Car:</Form.Label>
                                    <Form.Control onChange={(e) => setCarName(e.target.value)} type="text" placeholder="Nissan Altima" />
                                </Form.Group>
                            </Col>
                            <Col md="6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>From:</Form.Label>
                                    <Form.Control onChange={(e) => setOrigin(e.target.value)} type="text" placeholder="Auburn" />
                                </Form.Group>
                            </Col>
                            <Col md="6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>To:</Form.Label>
                                    <Form.Control onChange={(e) => setDestination(e.target.value)} type="text" placeholder="Atlanta" />
                                </Form.Group>
                            </Col>
                            <Col md="6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Start Date:</Form.Label>
                                    <Form.Control onChange={(e) => setRideDate(e.target.value)} type="text" placeholder="2 Feb 2024" />
                                </Form.Group>
                            </Col>
                            <Col md="6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Start Time:</Form.Label>
                                    <Form.Control onChange={(e) => setRideStart(e.target.value)} type="text" placeholder="10:00 AM" />
                                </Form.Group>
                            </Col>
                            <Col md="6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Cost (in USD) / Per Person:</Form.Label>
                                    <Form.Control onChange={(e) => setRideCost(e.target.value)} type="number" placeholder="550" />
                                </Form.Group>
                            </Col>
                            <Col md="6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Capacity:</Form.Label>
                                    <Form.Control onChange={(e) => setCapacity(e.target.value)} type="number" placeholder="550" />
                                </Form.Group>
                            </Col>
                            <Col md="12">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Location to Pickup:</Form.Label>
                                    <Form.Control as="textarea" onChange={(e) => setLocation(e.target.value)} type="number" placeholder="346 W Magnolia Ave" />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <div className="text-center">
                            <Button onClick={postRide} variant="warning" className="text-center">Post Ride</Button>
                        </div>
                    </Form>
                </Col>
            </Row> : <></> }
        </Container>
    )
}