// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Home from './Components/Home';
import Polling from './Components/Polling';

import RangeOutput from './Components/RangeOutput';
import ForgetPassword from './Components/ForgetPasswor';
import NewPassword from './Components/NewPassword';
import Header from './Components/Header';
import AddPoll from './Components/AddPoll';
import SideNavBar from './Components/Navbar';


function App() {
  return (
  <>
  <BrowserRouter>
  <Routes>
    <Route path='/' element={< Login/>}></Route>
    <Route path='/Header' element={< Header/>}></Route>
    <Route path='/signUp' element={< SignUp/>}></Route>
    <Route path='/Home' element={< Home/>}></Route>
    <Route path='/Polling' element={< Polling/>}></Route>
    <Route path='/SideNavBar' element={< SideNavBar/>}></Route>
    <Route path='/RangeOutput' element={< RangeOutput/>}></Route>
    <Route path='/ForgetPassword' element={< ForgetPassword/>}></Route>
    <Route path='/NewPassword' element={< NewPassword/>}></Route>
    <Route path='/AddPoll' element={< AddPoll/>}></Route>
  

  </Routes>
  </BrowserRouter>

  </>
  );
}

export default App;
