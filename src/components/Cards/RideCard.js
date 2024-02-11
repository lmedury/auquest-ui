import React from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import rideImage from "../../assets/img/ride.jpeg";

export default function RideCard({destination, origin, capacity, cost, date, time, id}) {

    return(
        <Card className="custom-card" style={{ width: '18rem', marginTop:'5%'}}>
            <Card.Img style={{height:'200px'}} variant="top" src={rideImage} />
            <Card.Body>
                <Card.Title>{origin} - {destination}</Card.Title>
                <h3>${cost} </h3> 
                <Card.Text>
                    {date} at {time}
                </Card.Text>
                <Row>
                    <Col sm={{span: 4}}>
                        <p><Badge bg="success">{capacity} spots left</Badge></p>
                    </Col>
                    <Col sm={{span: 3}}>
                        <p><Badge bg="primary">{destination}</Badge></p>
                    </Col>
                    <Col sm={{span: 3, offset:1}}>
                        <p><Badge bg="warning" text="black" className="pointer" onClick={() => window.location.href=`/ride-offer?id=${id}`}>Join Ride</Badge></p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}