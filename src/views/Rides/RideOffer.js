import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AXIOS_BACKEND_URL, IPFS_URL } from "../../assets/js/constants";
import ModalWithImage from "../../components/Modals/ModalWithImage";

export default function RideOffer(props) {

    const [itemInformation, setItemInformation] = React.useState();
    const [userInformation, setUserInformation] = React.useState();
    const [seats, setSeats] = React.useState(0);
    const [offerSuccess, setOfferSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [rideCost, setRideCost] = React.useState(0);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

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
        const id = queryParams.get('id');
        async function getItemInformation(){
            
            const {data} = await axios.get(`${AXIOS_BACKEND_URL}/rides/ride/${id}`);
            const itemData = {
                'destination': data.destination,
                'origin': data.origin,
                'date': data.date,
                'time': data.time,
                'cost': parseInt(data.cost),
                'capacity': parseInt(data.capacity),
                'location': data.location,
                'postedBy': data.postedBy,
                'id': data._id
            };
            setItemInformation(itemData);
           
        }
        getItemInformation();
    }, []);

    const makeOffer = async () => {
        const postData = {
            'ride_id': itemInformation.id,
            'offered_by': itemInformation.postedBy,
            'offer_by_name': userInformation.Name,
            'offer_by_email': userInformation.Email,
            'status': 'Accepted',
            'origin': itemInformation.origin,
            'destination': itemInformation.destination,
            'date': itemInformation.date,
            'time': itemInformation.time,
            'seats': seats,
            'cost': rideCost
        }
        const makeOffer = await axios.post(`${AXIOS_BACKEND_URL}/rides/join`, postData, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
            });
        if(makeOffer.data.success) {
            setOfferSuccess(true);
            setSuccessMessage('Your ride is confirmed!');
        }
    }

    return(
        <Container>
            <ModalWithImage show={offerSuccess} 
            message={successMessage}
            title="Woohoo!" 
            handleClose={() => window.location.href="/rides"} />

            <h1 className="text-center">Join Ride</h1>
            {itemInformation && itemInformation.destination ? 
            <Row>
                <Col md={{span:6, offset:3}}>
                    <h1>{itemInformation.origin} - {itemInformation.destination}</h1>
                    <h2>${itemInformation.cost} / per person</h2>
                    <div>
                        <p>{itemInformation.postedBy} will be travelling on {itemInformation.date} starting at {itemInformation.time}</p>
                    </div>
                    <div>
                        <p>Pickup location: {itemInformation.location}</p>
                    </div>
                    <Row>
                        <Col md="6">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Seats:</Form.Label>
                                <Form.Control value={seats} onChange={(e) => {
                                    if(e.target.value <= itemInformation.capacity) {
                                        setSeats(e.target.value);
                                        setRideCost(itemInformation.cost*parseInt(e.target.value))
                                    } else {
                                        setSeats(itemInformation.capacity)
                                        setRideCost(itemInformation.cost*parseInt(itemInformation.capacity))
                                    }
                                }} type="number" placeholder="Enter Number of Seats" />
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <h3 style={{marginTop:'15%'}}>${rideCost}</h3>
                        </Col>
                    </Row>
                    <div className="text-center">
                        <Button onClick={makeOffer} variant="warning" style={{width:'100%'}}>Join Ride</Button>
                    </div>
                </Col>
            </Row> : <></> }
        </Container>
    )
}