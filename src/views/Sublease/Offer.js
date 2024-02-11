import React from "react";
import { Container, Row, Col, Image, Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import axios from "axios";
import { AXIOS_BACKEND_URL, IPFS_URL } from "../../assets/js/constants";
import ModalWithImage from "../../components/Modals/ModalWithImage";

export default function SubleaseOffer(props) {

    const [itemInformation, setItemInformation] = React.useState();
    const [userInformation, setUserInformation] = React.useState();
    const [buyerAddress, setBuyerAddress] = React.useState();
    const [offerSuccess, setOfferSuccess] = React.useState(false);

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
            
            const {data} = await axios.get(`${AXIOS_BACKEND_URL}/sublease/unit/${id}`);
            const itemData = {
                'title': data.title,
                'description': data.description,
                'datePosted': data.datePosted.split('GMT')[0],
                'images': data.images.split(','),
                'rent': parseInt(data.price),
                'utility': parseInt(data.utilities),
                'address': data.address,
                'postedBy': data.postedBy,
                'id': data._id
            };
            setItemInformation(itemData);
           
        }
        getItemInformation();
    }, []);

    const makeOffer = async () => {
        const postData = {
            'item_id': itemInformation.id,
            'offered_by': itemInformation.postedBy,
            'offer_by_name': userInformation.Name,
            'offer_by_email': userInformation.Email,
            'status': 'Offered',
            'item': itemInformation.title
        }
        const makeOffer = await axios.post(`${AXIOS_BACKEND_URL}/sublease/make-offer`, postData, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
            });
        if(makeOffer.data.success) setOfferSuccess(true);
    }

    return(
        <Container>
            <ModalWithImage show={offerSuccess} 
            message="An offer has been sent to the current tenant" 
            title="Woohoo!" 
            handleClose={() => window.location.href="/sublease"} />

            <h1 className="text-center">Make an Offer</h1>
            {itemInformation && itemInformation.title ? 
            <Row>
                <Col md="6">
                    <Carousel style={{height:'40vh', width:'30vw'}}>
                        {itemInformation && itemInformation.images && itemInformation.images.map(image => 
                        <Carousel.Item>
                            <Image style={{height:'40vh', width:'30vw'}} rounded src={`${IPFS_URL}/${image}`} />
                        </Carousel.Item> )}
                    </Carousel>
                </Col>
                <Col md="6">
                    <h1>{itemInformation.title}</h1>
                    <div>
                        <p>
                            {itemInformation.address}
                        </p>
                    </div>
                    <h2>${itemInformation.rent}</h2>
                    <div>
                        <p>
                            Utilities expected to be around ${itemInformation.utility} each month.
                        </p>
                    </div>
                    <div>
                        <p>{itemInformation.postedBy} posted at {itemInformation.datePosted}</p>
                    </div>
                    <div>
                        <p> About the unit: <em>{itemInformation.description}</em>
                        </p>
                    </div>
                    <div className="text-center">
                        <Button onClick={makeOffer} variant="warning" style={{width:'100%'}}>Make an Offer</Button>
                    </div>
                </Col>
            </Row> : <></> }
        </Container>
    )
}