import React from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";

export default function SubleaseCard({title, description, image, price, id}) {

    return(
        <Card className="custom-card" style={{ marginTop:'5%'}}>
            <Card.Img style={{height:'200px'}} variant="top" src={image} />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <h3>${price} </h3> 
                <Card.Text>
                    {description.slice(0,70)+'....'}
                </Card.Text>
                <Row>
                    <Col sm={{span:3}}>
                        <p><Badge bg="success">W & D Included</Badge></p>
                    </Col>
                    <Col sm={{span:3}}>
                        <p style={{marginLeft:'10%'}}><Badge bg="primary">2 Bed 2 Bath</Badge></p>
                    </Col>
                    <Col sm={{span:3, offset:2}}>
                        <p style={{marginLeft:'10%'}}><Badge bg="warning" className="pointer" onClick={() => window.location.href=`/sublease-offer?id=${id}`} text="black">Make an offer</Badge></p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}