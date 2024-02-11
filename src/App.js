
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './assets/css/main.css'
import AppNavbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './views/Login/Login';
import Registration from './views/Registration/Registration';
import Profile from './views/Profile/Profile';
import Marketplace from './views/Marketplace/Marketplace';
import Offer from './views/Marketplace/Offer';
import Sublease from './views/Sublease/Sublease';
import SubleaseOffer from './views/Sublease/Offer';
import Rides from './views/Rides/Rides';
import RideOffer from './views/Rides/RideOffer';
import Home from './views/Home/Home';
import Offers from './views/Offers/Offers';
import AMA from './views/AskMeAnything/AMA';

function App() {
  return (
    <Router basename='/'>
      <div className="App">
        <header className="App-header">
          <AppNavbar />
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/offer" element={<Offer />} />
              <Route path="/sublease" element={<Sublease />} />
              <Route path="/sublease-offer" element={<SubleaseOffer />} />
              <Route path="/rides" element={<Rides />} />
              <Route path="/ride-offer" element={<RideOffer />} />
              <Route path="/home" element={<Home />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/ama" element={<AMA />} />
              <Route path="*" element={<Login />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
