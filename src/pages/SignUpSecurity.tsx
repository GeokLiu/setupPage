import React, { useState, useContext } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { LanguageContext } from "../context/LanguageContext";

const SignUpSecurity: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useContext(LanguageContext);
    const icNumber = (location.state as any)?.icNumber;

    const [q1, setQ1] = useState("");
    const [a1, setA1] = useState("");
    const [q2, setQ2] = useState("");
    const [a2, setA2] = useState("");

    const handleNext = async () => {
        if (!q1 || !a1 || !q2 || !a2) return alert("Please fill all fields");
        try {
            await axios.post("http://localhost:8000/signup-security", { ic_number: icNumber, question1: q1, answer1: a1, question2: q2, answer2: a2 });
            navigate("/user-mode", { state: { icNumber } });
        } catch (err: any) {
            alert(err.response?.data?.detail || "Failed to save security questions");
        }
    };

    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h4">{language === "BM" ? "Soalan Keselamatan" : "Security Questions"}</Typography>
            <Box mt={2}>
                <TextField label={language === "BM" ? "Soalan 1" : "Question 1"} value={q1} onChange={(e) => setQ1(e.target.value)} sx={{ mb: 2 }} />
                <TextField label={language === "BM" ? "Jawapan 1" : "Answer 1"} value={a1} onChange={(e) => setA1(e.target.value)} sx={{ mb: 2 }} />
                <TextField label={language === "BM" ? "Soalan 2" : "Question 2"} value={q2} onChange={(e) => setQ2(e.target.value)} sx={{ mb: 2 }} />
                <TextField label={language === "BM" ? "Jawapan 2" : "Answer 2"} value={a2} onChange={(e) => setA2(e.target.value)} sx={{ mb: 2 }} />
            </Box>
            <Button variant="contained" onClick={handleNext}>{language === "BM" ? "Seterusnya" : "Next"}</Button>
        </Box>
    );
};

export default SignUpSecurity;

