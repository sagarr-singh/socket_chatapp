import React, { useState } from "react";
import ReactDom from "react-dom/client";
// import App from "./App";
import Chat from "./App";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";

// const token = localStorage.getItem("token");
// const [userName, setUserName] = useState(null);


const root = ReactDom.createRoot(document.getElementById('root'))
root.render(
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
        </Routes>
    </Router>
)

