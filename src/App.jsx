// App.jsx


// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import RealEstateMenu from "./components/RealEstateMenu.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import AddProduct from "./components/AddProduct.jsx";
import Header from "./components/Header.jsx";
import LoginForm from "./components/LoginForm.jsx";
import UserProfile from "./components/UserProfile.jsx";
import PropertyDetails from "./components/PropertyDetails.jsx";

function App() {
    return (
        <Router>

                <Header />

                <Routes>
                    <Route path="/" element={<RealEstateMenu />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/addProduct" element={<AddProduct />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path='/profile' element={<UserProfile />} />
                    <Route path="/property/:id" element={<PropertyDetails/>} />
                </Routes>

        </Router>
    );
}

export default App;
