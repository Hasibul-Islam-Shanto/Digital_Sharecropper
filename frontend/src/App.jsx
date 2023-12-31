import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import Request from "./pages/Request";
import Appointment from "./pages/Appointment";
import Deal from "./pages/Deal";
import AdminAgentLogin from "./pages/AdminAgentLogin";
import Transactions from "./pages/Transactions";
import Blogs from "./pages/Blogs";
import SingleBlog from "./components/Blogs/SingleBlog";
import Ratings from "./pages/Ratings";

const App = () => {
  return (
    <React.Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/request" element={<Request />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/deal" element={<Deal />} />
        <Route path="/adminagentlogin" element={<AdminAgentLogin />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<SingleBlog />} />
        <Route path="/reviews" element={<Ratings />} />
      </Routes>
      <Footer />
    </React.Fragment>
  );
};

export default App;
