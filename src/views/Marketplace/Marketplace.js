import axios from "axios";
import React from "react";
import { Container, Row, Col, Card, Form, Button, Table, Badge } from "react-bootstrap";
import { AXIOS_BACKEND_URL, IPFS_URL } from "../../assets/js/constants";
import MarketplaceCard from "../../components/Cards/MarketplaceCard";
import buyImage from "../../assets/img/buy.gif";
import sellImage from "../../assets/img/sell.gif";
import { uploadToIpfs } from "../../assets/js/utility";
import ModalWithImage from "../../components/Modals/ModalWithImage";

export default function Marketplace() {

    const [userInformation, setUserInformation] = React.useState();
    const [marketplaceItems, setMarketplaceItems] = React.useState([]);
    const [action, setAction] = React.useState();
    const [deliveryMode, setDeliveryMode] = React.useState(false);
    const [pickupMode, setPickupMode] = React.useState(false);
    const [productImages, setProductImages] = React.useState();
    const [nameOfItem, setNameOfItem] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [price, setPrice] = React.useState(0);
    const [pickupAddress, setPickupAddress] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [offers, setOffers] = React.useState();

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
        async function getItems() {
            let items = await axios.get(`${AXIOS_BACKEND_URL}/marketplace/items`, {withCredentials: true});
            items = items.data;
            const formattedItems = [];
            for (let i=0; i<items.length; i++) {
                const item = {
                    'title': items[i].title,
                    'description': items[i].description,
                    'datePosted': items[i].datePosted.split('GMT')[0],
                    'images': items[i].images.split(','),
                    'mode': items[i].mode,
                    'price': parseInt(items[i].price),
                    'addressForPickup': items[i].addressForPickup,
                    'postedBy': items[i].postedBy,
                    'id': items[i]._id
                };
                formattedItems.push(item);
            }
            setMarketplaceItems(formattedItems);
            
        }
        getItems();
    }, [])

    const saveProductImages = (event) => {
        const files = event.target.files;
        setProductImages(files);
    };

    const postItem = async () => {
        let images;
        if (productImages) {
            const productImageHashes = []
            for (let i = 0; i < productImages.length; i++) {
                const hash = await uploadToIpfs(productImages[i]);
                productImageHashes.push(hash);
            }
            images = productImageHashes.toString();
        }
        const postData = {
            'title': nameOfItem,
            'description': description,
            'price': price,
            'mode': deliveryMode ? 'Deliver to Auburn Address' : 'Pickup from Address',
            'datePosted': new Date().toString(),
            'addressForPickup': pickupAddress,
            'postedBy': userInformation.Name,
            'images': images
        };
        try{
            const result = await axios.post(`${AXIOS_BACKEND_URL}/marketplace/new-item`, postData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
                });
            if(result.data.success) {
                setSuccess(true);
                setSuccessMessage("Your item has been added to the marketplace");
            }
        } catch (err) {
            
        }
    }

    const changeOfferStatus = async (status, id) => {
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

    return(
        <Container>
            <ModalWithImage
                show={success}
                message={successMessage}
                title="Woohoo!" 
                handleClose={() => window.location.href="/marketplace"} />
            {!action ? 
                <Row>
                    <Col lg={{span:3, offset: 3}}>
                        <Card className="custom-card pointer" onClick={() => setAction('buy')}>
                            <Card.Img variant="top" className="card-image" src={buyImage}/>
                            <Card.Body>
                                <Card.Title>Buy Items</Card.Title>
                                <Card.Text>
                                    New to Auburn? Just moved in? Whatever it is, find everything you want at our marketplace!
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="3">
                        <Card className="custom-card pointer" onClick={() => setAction('sell')}>
                            <Card.Img variant="top" className="card-image" src={sellImage} />
                            <Card.Body>
                                <Card.Title>Sell Items</Card.Title>
                                <Card.Text>
                                    Are you moving out? Do you have anything extra to get rid of? Put it online and find a buyer in no time!
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row> : <></>
            }
            {action === 'buy' && marketplaceItems && marketplaceItems.length > 0 ? 
            <Row>
                <p>Buy Items:</p>
                {marketplaceItems.map(item => 
                    <Col key={item.id} md="4" lg="3">
                        <MarketplaceCard
                            image={`${IPFS_URL}/${item.images[0]}`}
                            description={item.description}
                            title={item.title}
                            price={item.price}
                            mode={item.mode.split(' ')[0]}
                            id={item.id}
                        />
                    </Col>
                )}
            </Row> : action === 'sell' ?
            <Row>
                <h2 className="text-center">Sell Item</h2>
                <Col md={{span: 6, offset:3}}>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name of Item:</Form.Label>
                            <Form.Control onChange={(e) => setNameOfItem(e.target.value)} type="text" placeholder="Gotrax Electric Scooter" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control onChange={(e) => setDescription(e.target.value)} as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Price (in USD):</Form.Label>
                            <Form.Control onChange={(e) => setPrice(e.target.value)} type="number" placeholder="250" />
                        </Form.Group>
                        <Form.Group controlId="formFileMultiple" className="mb-3">
                            <Form.Label>Photos of the item:</Form.Label>
                            <Form.Control onChange={saveProductImages} type="file" multiple />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Mode of Sale:</Form.Label>
                            <Form.Check // prettier-ignore
                                onChange={(e) => setDeliveryMode(!deliveryMode)}
                                type="checkbox"
                                label="Deliver to Auburn address"
                            />
                            <Form.Check // prettier-ignore
                                onChange={(e) => setPickupMode(!pickupMode)}
                                type="checkbox"
                                label="Buyer must pickup"
                            />
                        </Form.Group>
                        {pickupMode ? 
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Pickup addres:</Form.Label>
                                <Form.Control onChange={(e) => setPickupAddress(e.target.value)} as="textarea" rows={3} />
                            </Form.Group> : <></>
                        }
                        <div className="text-center">
                            <Button onClick={postItem} variant="warning" className="text-center">Post Item</Button>
                        </div>
                    </Form>
                </Col>
            </Row> : <></>
            }
            
        </Container>
    )
}