import React from "react";
import {Row, Col, Container, Card} from "react-bootstrap";
import buyImage from "../../assets/img/buy.gif";
import rideImage from "../../assets/img/ride.gif";
import subleaseImage from "../../assets/img/sublease.gif";

export default function Home() {

    return(
        <Container>
            <h1 className="text-center">Welcome to AU Quest</h1>
            <Row>
                <Col md="4">
                    <Card className="custom-card pointer" onClick={() => window.location.href="/marketplace"}>
                        <Card.Img style={{width:'100%'}} variant="top" className="card-image" src={buyImage}/>
                        <Card.Body className="text-center">
                            <Card.Title>Marketplace</Card.Title>
                            <Card.Text>
                                Looking for stuff? Explore the marketplace!
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="4">
                    <Card className="custom-card pointer" onClick={() => window.location.href="/sublease"}>
                        <Card.Img style={{width:'100%'}} variant="top" className="card-image" src={subleaseImage}/>
                        <Card.Body className="text-center">
                            <Card.Title>Sublease</Card.Title>
                            <Card.Text>
                                Sublease your unit or take a unit for sublease!
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="4">
                    <Card className="custom-card pointer" onClick={() => window.location.href="/rides"}>
                        <Card.Img style={{width:'100%'}} variant="top" className="card-image" src={rideImage}/>
                        <Card.Body className="text-center">
                            <Card.Title>Rides</Card.Title>
                            <Card.Text>
                                Offering a ride or need a ride? Lets goooo!
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}