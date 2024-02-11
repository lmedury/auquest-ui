import React from "react";
import {Row, Col, Container, Tabs, Tab, Badge, Table} from 'react-bootstrap';
import axios from "axios";
import { AXIOS_BACKEND_URL } from "../../assets/js/constants";
import ModalWithImage from "../../components/Modals/ModalWithImage";

export default function Offers() {

    const [userInformation, setUserInformation] = React.useState();
    const [marketplaceItems, setMarketplaceItems] = React.useState([]);
    const [offers, setOffers] = React.useState([]);
    const [subleaseOffers, setSubleaseOffers] = React.useState([]);
    const [rideOffers, setRideOffers] = React.useState([]);
    const [success, setSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

    const marketplaceOfferStatus = async(status, id) => {
        const postData = {
            offer_id: id,
            update_data: {
                'status': status
            }
        }
        const result = await axios.post(`${AXIOS_BACKEND_URL}/marketplace/update-status`, postData, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
            });
        if(result.data.success) {
            setSuccess(true);
            setSuccessMessage(`The offer status has been changed to ${status}. Please check your email for more details.`)
        }
    }

    const changeSubleaseOfferStatus = async (status, id) => {
        const postData = {
            offer_id: id,
            update_data: {
                'status': status
            }
        }
        const result = await axios.post(`${AXIOS_BACKEND_URL}/sublease/update-status`, postData, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
            });
        if(result.data.success) {
            setSuccess(true);
            setSuccessMessage(`The offer status has been changed to ${status}. Please check your email for more details.`)
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
                let marketplaceOffers = await axios.get(`${AXIOS_BACKEND_URL}/marketplace/offers`, {withCredentials: true});
                const relevantOffers = [];
                for (let i=0; i<marketplaceOffers.data.length; i++){
                    const offer = marketplaceOffers.data[i];
                    if(offer.offered_by === userData.data[0].Name || offer.offer_by_name === userData.data[0].Name) {
                        relevantOffers.push(offer);
                    }
                }
                setOffers(relevantOffers);

                let subleaseOffers = await axios.get(`${AXIOS_BACKEND_URL}/sublease/offers`, {withCredentials: true});
                const relevantSubleaseOffers = [];
                for (let i=0; i<subleaseOffers.data.length; i++){
                    const offer = subleaseOffers.data[i];
                    if(offer.offered_by === userData.data[0].Name || offer.offer_by_name === userData.data[0].Name) {
                        relevantSubleaseOffers.push(offer);
                    }
                }
                setSubleaseOffers(relevantSubleaseOffers);

                let rideOffers = await axios.get(`${AXIOS_BACKEND_URL}/rides/offers`, {withCredentials: true});
                const relevantRideOffers = [];
                for (let i=0; i<rideOffers.data.length; i++){
                    const offer = rideOffers.data[i];
                    if(offer.offered_by === userData.data[0].Email || offer.offer_by_name === userData.data[0].Name) {
                        relevantRideOffers.push(offer);
                    }
                }
                setRideOffers(relevantRideOffers);


            } else {
                window.location.href = "/login"
            }
            
        }
        getUserInformation();
    }, [])

    return(
        <Container>
            <ModalWithImage show={success} 
            message={successMessage}
            title="Woohoo!" 
            handleClose={() => window.location.href="/offers"} />
            <h1 className="text-center">Offers</h1>
            <Tabs
                defaultActiveKey="marketplace"
                id="uncontrolled-tab-example"
                className="mb-3"
                >
                <Tab eventKey="marketplace" title="Marketplace">
                    <Row>
                        {offers && offers.length > 0 && userInformation ? 
                        <Col lg="12">
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Offer</th>
                                        <th>Item</th>
                                        <th>Buyer</th>
                                        <th>Seller</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offers.map((offer, index) => 
                                        <tr key={index}>
                                            <td>{offer.offer_by_name === userInformation.Name ? <Badge bg="success">Buy</Badge> : <Badge bg="danger">Sell</Badge>}</td>
                                            <td>{offer.item}</td>
                                            <td>{offer.offer_by_name}</td>
                                            <td>{offer.offered_by}</td>
                                            <td>
                                                {offer.status === 'Offered' ? 
                                                    <Badge bg="secondary">Pending</Badge> : <></>
                                                }
                                                {offer.status === 'Cancelled' ? 
                                                    <Badge bg="danger">Cancelled</Badge> : <></>
                                                }
                                                {offer.status === 'Confirmed' ? 
                                                    <Badge bg="success">Confirmed</Badge> : <></>
                                                }
                                            </td>
                                            { offer.status === 'Offered' ?
                                            <td>
                                                {offer.offer_by_name === userInformation.Name ? 
                                                <Badge onClick={() => marketplaceOfferStatus('Cancelled', offer._id)} className="pointer" bg="danger">Cancel Offer</Badge> : 
                                                <Badge onClick={() => marketplaceOfferStatus('Confirmed', offer._id)} className="pointer" bg="success">Confirm Offer</Badge>}
                                            </td> : <td></td> }
                                        </tr>
                                    )}
                                    
                                </tbody>
                            </Table>
                        </Col> : <></> }
                    </Row>
                </Tab>
                <Tab eventKey="subleases" title="Subleases">
                    <Row>
                        {subleaseOffers && subleaseOffers.length > 0 && userInformation ? 
                        <Col lg="12">
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Offer</th>
                                        <th>Item</th>
                                        <th>Lessee</th>
                                        <th>Lessor</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subleaseOffers.map((offer, index) => 
                                        <tr key={index}>
                                            <td>{offer.offer_by_name === userInformation.Name ? <Badge bg="success">Take Unit</Badge> : <Badge bg="danger">Offer Unit</Badge>}</td>
                                            <td>{offer.item}</td>
                                            <td>{offer.offer_by_name}</td>
                                            <td>{offer.offered_by}</td>
                                            <td>
                                                {offer.status === 'Offered' ? 
                                                    <Badge bg="secondary">Pending</Badge> : <></>
                                                }
                                                {offer.status === 'Cancelled' ? 
                                                    <Badge bg="danger">Cancelled</Badge> : <></>
                                                }
                                                {offer.status === 'Confirmed' ? 
                                                    <Badge bg="success">Confirmed</Badge> : <></>
                                                }
                                            </td>
                                            { offer.status === 'Offered' ?
                                            <td>
                                                {offer.offer_by_name === userInformation.Name ? 
                                                <Badge onClick={() => changeSubleaseOfferStatus('Cancelled', offer._id)} className="pointer" bg="danger">Cancel Offer</Badge> : 
                                                <Badge onClick={() => changeSubleaseOfferStatus('Confirmed', offer._id)} className="pointer" bg="success">Confirm Offer</Badge>}
                                            </td> : <td></td> }
                                        </tr>
                                    )}
                                    
                                </tbody>
                            </Table>
                        </Col> : <></> }
                    </Row>
                </Tab>
                <Tab eventKey="rides" title="Rides">
                    <Row>
                        {rideOffers && rideOffers.length > 0 && userInformation ? 
                        <Col lg="12">
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Offer</th>
                                        <th>Journey</th>
                                        <th>Rider</th>
                                        <th>Seats</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rideOffers.map((offer, index) => 
                                        <tr key={index}>
                                            <td>{offer.offer_by_name === userInformation.Name ? <Badge bg="success">Request Ride</Badge> : <Badge bg="danger">Offer Ride</Badge>}</td>
                                            <td>{offer.origin} - {offer.destination}</td>
                                            <td>{offer.offer_by_name}</td>
                                            <td>{offer.seats} for ${offer.cost}</td>
                                            <td>{offer.date} at {offer.time}</td>
                                        </tr>
                                    )}
                                    
                                </tbody>
                            </Table>
                        </Col> : <></> }
                    </Row>
                </Tab>
            </Tabs>
        </Container>
        
    )
}