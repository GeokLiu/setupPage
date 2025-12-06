import React, { useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import axios from "axios";

const translations = {
    BM: { title: "Anda seorang?", normal: "Normal", rural: "Luar Bandar", easy: "Mudah", senior: "Warga Emas" },
    BI: { title: "Are you a?", normal: "Normal", rural: "Rural Area", easy: "Easy", senior: "Senior Citizen" },
};

const UserMode: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useContext(LanguageContext);
    const icNumber = (location.state as any)?.icNumber;

    const handleSelect = async (mode: string) => {
        try {
            await axios.post("http://localhost:8000/user-mode", { ic_number: icNumber, mode });
            navigate("/signin");
        } catch (err: any) {
            alert(err.response?.data?.detail || "Failed to set mode");
        }
    };

    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h4">{translations[language].title}</Typography>
            <Box display="flex" justifyContent="center" gap={2} mt={2}>
                <Button variant="contained" onClick={() => handleSelect("normal")}>{translations[language].normal}</Button>
                <Button variant="contained" onClick={() => handleSelect("rural")}>{translations[language].rural}</Button>
                <Button variant="contained" onClick={() => handleSelect("easy")}>{translations[language].easy}</Button>
                <Button variant="contained" onClick={() => handleSelect("senior")}>{translations[language].senior}</Button>
            </Box>
        </Box>
    );
};

export default UserMode;
