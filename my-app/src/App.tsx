import React from "react";
 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Medicine_receive from "./components/Medicine_receive";
import Receive from "./components/Receive";
 
export default function App() {
 return (
   <Router>
     <div>
       <Navbar />
       <Routes>
         <Route path="/" element={<Medicine_receive />} />
         <Route path="/receive" element={<Receive />} />
       </Routes>
     </div>
   </Router>
 );
}
