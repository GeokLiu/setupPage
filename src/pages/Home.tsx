import React, { useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { language, setLanguage } = useContext(LanguageContext);

    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h3">{language === "BM" ? "Selamat Datang" : "Welcome"}</Typography>
            <Box mt={3}>
                <Button variant="contained" onClick={() => navigate("/signup-step1")}>
                    {language === "BM" ? "Daftar" : "Sign Up"}
                </Button>
                <Button variant="contained" sx={{ ml: 2 }} onClick={() => navigate("/signin")}>
                    {language === "BM" ? "Log Masuk" : "Sign In"}
                </Button>
            </Box>
            <Box mt={3}>
                <Button onClick={() => setLanguage(language === "BM" ? "BI" : "BM")}>
                    {language === "BM" ? "Switch to English" : "Tukar ke BM"}
                </Button>
            </Box>
        </Box>
    );
};

export default Home;

