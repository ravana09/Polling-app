import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Home from './Components/Home';
import Polling from './Components/Polling';
import RangeOutput from './Components/RangeOutput';
import ForgetPassword from './Components/ForgetPassword';
import NewPassword from './Components/NewPassword';
import Header from './Components/Header';
import AddPoll from './Components/AddPoll';
import SideNavBar from './Components/Navbar';
import GooogleForm from './Components/GooogleForm';
import VotedLIst from './Components/VotedLIst';

import Trending from './Components/Trending/Trending';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/NewPassword" element={<NewPassword />} />
        <Route path="/GooogleForm" element={<GooogleForm />} />

        <Route path="/Trending" element={<Trending />} />

        
       
        <Route path="/Polling" element={<WithHomeLayout component={<Polling />} />} />
       
        <Route path="/RangeOutput" element={<WithHomeLayout component={<RangeOutput />} />} />
        <Route path="/AddPoll" element={<WithHomeLayout component={<AddPoll />} />} />
        <Route path="/VotedLIst" element={<WithHomeLayout component={<VotedLIst />} />} />
   
      </Routes>
    </BrowserRouter>
  );
}

function WithHomeLayout({ component }) {
  return <Home>{component}</Home>;
}

export default App;
