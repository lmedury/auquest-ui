import axios from "axios";
import React from "react";
import { Container, Row, Col, Card, Form, Button, Table, Badge } from "react-bootstrap";
import { AXIOS_BACKEND_URL, IPFS_URL } from "../../assets/js/constants";
import buyImage from "../../assets/img/sublease.gif";
import sellImage from "../../assets/img/sublease-offer.gif";
import { uploadToIpfs } from "../../assets/js/utility";
import ModalWithImage from "../../components/Modals/ModalWithImage";
import SubleaseCard from "../../components/Cards/SubleaseCard";

export default function Sublease() {

    const [action, setAction] = React.useState();
    const [offers, setOffers] = React.useState();
    const [userInformation, setUserInformation] = React.useState();
    const [units, setUnits] = React.useState();
    const [name, setName] = React.useState();
    const [address, setAddress] = React.useState();
    const [description, setDescription] = React.useState();
    const [rent, setRent] = React.useState();
    const [utilityCost, setUtilityCost] = React.useState();
    const [images, setImages] = React.useState();
    const [success, setSuccess] = React.useState();
    const [successMessage, setSuccessMessage] = React.useState();

    React.useEffect(() => {
        async function getUserInformation() {
            const session = await axios.get(`${AXIOS_BACKEND_URL}/users/session`, {withCredentials: true});
            if(session.data.user) {
                const userData = await axios.get(`${AXIOS_BACKEND_URL}/users/user`, {params: {
                    'email': session.data.user
                }, withCredentials: true});
                setUserInformation(userData.data[0]);
                let subleaseOffers = await axios.get(`${AXIOS_BACKEND_URL}/sublease/offers`, {withCredentials: true});
                const relevantOffers = [];
                for (let i=0; i<subleaseOffers.data.length; i++){
                    const offer = subleaseOffers.data[i];
                    if(offer.offered_by === userData.data[0].Name || offer.offer_by_name === userData.data[0].Name) {
                        relevantOffers.push(offer);
                    }
                }
                setOffers(relevantOffers);
            } else {
                window.location.href = "/login"
            }
            
        }
        getUserInformation();
    }, [])

    React.useEffect(() => {
        async function getItems() {
            let items = await axios.get(`${AXIOS_BACKEND_URL}/sublease/all`, {withCredentials: true});
            items = items.data;
            const formattedItems = [];
            for (let i=0; i<items.length; i++) {
                const item = {
                    'title': items[i].title,
                    'description': items[i].description,
                    'datePosted': items[i].datePosted.split('GMT')[0],
                    'images': items[i].images.split(','),
                    'rent': parseInt(items[i].price),
                    'utility': parseInt(items[i].utilities),
                    'address': items[i].address,
                    'postedBy': items[i].postedBy,
                    'id': items[i]._id
                };
                formattedItems.push(item);
            }
            setUnits(formattedItems);
        }
        getItems();
    }, [])

    const changeOfferStatus = async (status, id) => {
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

    const saveImages = (event) => {
        const files = event.target.files;
        setImages(files);
    };

    const postUnit = async () => {
        let imagesString;
        if (images) {
            const productImageHashes = []
            for (let i = 0; i < images.length; i++) {
                const hash = await uploadToIpfs(images[i]);
                productImageHashes.push(hash);
            }
            imagesString = productImageHashes.toString();
        }
        const postData = {
            'title': name,
            'description': description,
            'address': address,
            'price': rent,
            'utilities': utilityCost,
            'datePosted': new Date().toString(),
            'postedBy': userInformation.Name,
            'images': imagesString
        };
        try{
            const result = await axios.post(`${AXIOS_BACKEND_URL}/sublease/post`, postData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
                });
            if(result.data.success) {
                setSuccess(true);
                setSuccessMessage("Your sublease unit has been posted");
            }
        } catch (err) {
            
        }
    }
    
    return(
        <Container>
            <ModalWithImage
                show={success}
                message={successMessage}
                title="Woohoo!" 
                handleClose={() => window.location.href="/sublease"} />
            {!action ? 
                <Row>
                    <Col lg={{span:3, offset: 3}}>
                        <Card className="custom-card pointer" onClick={() => setAction('take')}>
                            <Card.Img variant="top" className="card-image" src={buyImage}/>
                            <Card.Body>
                                <Card.Title>Take a Sublease</Card.Title>
                                <Card.Text>
                                    New to Auburn? Just moved in? Find the best place to move in today!
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="3">
                        <Card className="custom-card pointer" onClick={() => setAction('put')}>
                            <Card.Img variant="top" className="card-image" src={sellImage} />
                            <Card.Body>
                                <Card.Title>Sublease your unit</Card.Title>
                                <Card.Text>
                                    Are you moving out? Sublease your apartment in no time!
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row> : <></>
            }
            {action === 'take' && units && units.length > 0 ? 
            <Row>
                <p>Units available for sublease:</p>
                {units.map(unit => 
                    <Col key={unit.id} lg="4">
                        <SubleaseCard
                            image={`${IPFS_URL}/${unit.images[0]}`}
                            description={unit.description}
                            title={unit.title}
                            price={unit.rent}
                            id={unit.id}
                        />
                    </Col>
                )}
            </Row> : action === 'put' ?
            <Row>
                <h2 className="text-center">Sublease Unit</h2>
                <Col md={{span: 6, offset:3}}>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name of Apartment:</Form.Label>
                            <Form.Control onChange={(e) => setName(e.target.value)} type="text" placeholder="Auburn Apartment" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Address:</Form.Label>
                            <Form.Control onChange={(e) => setAddress(e.target.value)} as="textarea" placeholder="346 W Magnolia Ave, Apt 12" rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control onChange={(e) => setDescription(e.target.value)} 
                            placeholder="Tell us about the unit and what is included in utilities and benefits. Make your sales pitch here!" 
                            as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Rent (in USD):</Form.Label>
                            <Form.Control onChange={(e) => setRent(e.target.value)} type="number" placeholder="550" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Expected Utility Cost (in USD):</Form.Label>
                            <Form.Control onChange={(e) => setUtilityCost(e.target.value)} type="number" placeholder="100" />
                        </Form.Group>
                        <Form.Group controlId="formFileMultiple" className="mb-3">
                            <Form.Label>Photos of the apartment:</Form.Label>
                            <Form.Control onChange={saveImages} type="file" multiple />
                        </Form.Group>
                        <div className="text-center">
                            <Button onClick={postUnit} variant="warning" className="text-center">Put Unit For Sublease</Button>
                        </div>
                    </Form>
                </Col>
            </Row> : <></> }
        </Container>
    )
}