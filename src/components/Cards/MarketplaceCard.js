import React from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";

export default function MarketplaceCard({title, description, image, price, mode, id}) {

    return(
        <Card className="custom-card" style={{ width: '18rem', marginTop:'5%'}}>
            <Card.Img style={{height:'200px'}} variant="top" src={image} />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <h3>${price} </h3> 
                <Card.Text>
                    {description.slice(0,70)+'....'}
                </Card.Text>
                <Row>
                    <Col sm={{span: 3}}>
                        <p><Badge bg="primary">{mode}</Badge></p>
                    </Col>
                    <Col sm={{span: 3}}>
                        <p><Badge bg="success">{title.split(' ')[0]}</Badge></p>
                    </Col>
                    <Col sm={{span: 3, offset:1}}>
                        <p><Badge bg="warning" className="pointer" text="black" onClick={() => window.location.href=`/offer?id=${id}`}>Make an Offer</Badge></p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}