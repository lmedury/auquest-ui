import React from "react";
import {Row, Col, Container, Form, Button, Card} from "react-bootstrap";
import axios from "axios";
import { AXIOS_BACKEND_URL } from "../../assets/js/constants";

export default function AMA() {

    const [prompts, setPrompts] = React.useState([]);
    const [currentPrompt, setCurrentPrompt] = React.useState();

    const askQuestion = async () => {
        const currentPrompts = [...prompts, currentPrompt];
        const data = {
            'prompt': currentPrompt
        }
        const askAi = await axios.post(`${AXIOS_BACKEND_URL}/ai/ask`, data, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        currentPrompts.push(askAi.data.result.response);
        setPrompts(currentPrompts);
    }

    return(
        <Container>
            <h2 className="text-center">AuburnGPT</h2>
            
            {prompts.map((prompt, index) => 
            <Row style={{marginTop:'0%'}}>
                <Col sm={{span: 6, offset: index%2 === 0 ? 0 : 6}}>
                    <Card style={{backgroundColor: index%2 === 0 ? 'grey' : '#1a1d24', padding: '2%'}}>
                        <p>{prompt}</p>
                    </Card>
                    
                </Col>
            </Row>
            )}
            
            <div className="fixed-bottom p-3">
                <Row>
                    <Col md={{span:6, offset:3}}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Control onChange={(e) => setCurrentPrompt(e.target.value)} type="text" placeholder="Type your question here..." />
                        </Form.Group>
                    </Col>
                    <Col md={{span:3}}>
                        <Button onClick={() => {
                            
                            askQuestion();
                        }} style={{marginTop:'-3%'}} variant="warning">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </div>
        </Container>
    )
}
