import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Polling from './Components/Polling';
import RangeOutput from './Components/RangeOutput';
import AddPoll from './Components/AddPoll';
import VotedLIst from './Components/VotedLIst';
import Trending from './Components/Trending/Trending';
import Comments from './Components/Tools/Comments';
import PollEndingTime from './Components/Timing/PollEndingTime';
import PollStartingTime from './Components/Timing/PollStartingTime';
import UserDetails from './Components/User/UserDetails';
import Login from './Components/Login&signup/Login';
import SignUp from './Components/Login&signup/SignUp';
import ForgetPassword from './Components/Login&signup/ForgetPassword';
import NewPassword from './Components/Login&signup/NewPassword';
import GoogleForm from './Components/Login&signup/GooogleForm';
import MobileNum from './Components/Login&signup/MobileNum';
import Search from './Components/Search/Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/NewPassword" element={<NewPassword />} />
        <Route path="/GooogleForm" element={<GoogleForm />} />
        <Route path="/Trending" element={<Trending />} />
        <Route path="/MobileNumberVerify" element={<MobileNum />} />

        <Route path="/Polling" element={<WithHomeLayout component={<Polling />} showTrending={true} />} />
        <Route path="/RangeOutput" element={<WithHomeLayout component={<RangeOutput />} showTrending={true} />} />
        <Route path="/AddPoll" element={<WithHomeLayout component={<AddPoll />} showTrending={true} />} />
        <Route path="/VotedLIst" element={<WithHomeLayout component={<VotedLIst />} showTrending={true} />} />
        <Route path="/Comments" element={<WithHomeLayout component={<Comments />} showTrending={true} />} />
        <Route path="/PollEndingTime" element={<WithHomeLayout component={<PollEndingTime />} showTrending={true} />} />
        <Route path="/PollStartingTime" element={<WithHomeLayout component={<PollStartingTime />} showTrending={true} />} />
        <Route path="/UserDetails" element={<WithHomeLayout component={<UserDetails />} showTrending={false} />} />
        <Route path="/Search" element={<WithHomeLayout component={<Search />} showTrending={false} />} />
      </Routes>
    </BrowserRouter>
  );
}

function WithHomeLayout({ component, showTrending }) {
  return <Home showTrending={showTrending}>{component}</Home>;
}

export default App;
