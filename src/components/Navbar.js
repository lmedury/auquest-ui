import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import quest from '../assets/img/quest-logo.png';
import axios from "axios";
import { AXIOS_BACKEND_URL } from "../assets/js/constants";
import { useAuth0 } from "@auth0/auth0-react";

export default function AppNavbar(props) {

    const [userInformation, setUserInformation] = React.useState();
    const [loaded, setLoaded] = React.useState();

    React.useEffect(() => {
        async function getUserInformation() {
            const session = await axios.get(`${AXIOS_BACKEND_URL}/users/session`, {withCredentials: true});
            if(session.data.user) {
                const userData = await axios.get(`${AXIOS_BACKEND_URL}/users/user`, {params: {
                    'email': session.data.user
                }, withCredentials: true});
                setUserInformation(userData.data[0]);
            }
            setLoaded(true);
        }
        getUserInformation();
    }, [])

    const { logout } = useAuth0();

    return(
        <Navbar className="chip-navbar" variant="dark">
            <Container>
                <Navbar.Brand href="/home" className="brand">
                    <img
                    alt=""
                    src={quest}
                    width="80"
                    height="40"
                    className="d-inline-block align-top"
                    />{' '}
                </Navbar.Brand>
                <Nav className="me-auto">
                    {loaded && !userInformation ?
                    <Nav.Link href="/login" className="nav-link">Login</Nav.Link> : <></> }
                    {loaded && !userInformation ?
                    <Nav.Link href="/registration" className="nav-link">Registration</Nav.Link> : <></> }
                    {userInformation && userInformation.Email ? 
                    <Nav.Link href="/marketplace" className="nav-link">Marketplace</Nav.Link> : <></> }
                    {userInformation && userInformation.Email ? 
                    <Nav.Link href="/sublease" className="nav-link">Sublease</Nav.Link> : <></> }
                    {userInformation && userInformation.Email ? 
                    <Nav.Link href="/rides" className="nav-link">Rides</Nav.Link> : <></> }
                    {userInformation && userInformation.Email ? 
                    <Nav.Link href="/ama" className="nav-link">AuburnGPT</Nav.Link> : <></> }
                    {userInformation && userInformation.Email ? 
                    <Nav.Link href="/offers" className="nav-link">Offers</Nav.Link> : <></> }
                    
                </Nav>
                {userInformation && userInformation.Email ? 
                <Nav.Link onClick={async () => {
                    await axios.get(`${AXIOS_BACKEND_URL}/users/logout`, {withCredentials: true});
                    logout({ logoutParams: { returnTo: "/login" } })
                }} className="nav-link">Logout</Nav.Link> : <></> }
            </Container>
        </Navbar>
    )
}