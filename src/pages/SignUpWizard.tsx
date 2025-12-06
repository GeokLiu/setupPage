import React, { useState, useContext } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

const SignUpWizard: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useContext(LanguageContext);
    const [step, setStep] = useState(1);

    const [icNumber, setIcNumber] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    const handleNext = () => {
        if (step === 1 && (!icNumber || !name || !address)) return alert("Fill all fields");
        if (step < 3) setStep(step + 1);
        else navigate("/user-mode"); // final step
    };

    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h4">
                {language === "BM" ? "Buat Akaun" : "Create Your Account"}
            </Typography>

            {step === 1 && (
                <Box mt={3}>
                    <TextField label="IC Number" value={icNumber} onChange={(e) => setIcNumber(e.target.value)} sx={{ mb: 2 }} />
                    <TextField label={language === "BM" ? "Nama" : "Name"} value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
                    <TextField label={language === "BM" ? "Alamat" : "Address"} value={address} onChange={(e) => setAddress(e.target.value)} sx={{ mb: 2 }} />
                </Box>
            )}

            {step === 2 && (
                <Box mt={3}>
                    <Typography>{language === "BM" ? "Rakam Suara Anda" : "Record Your Voice"}</Typography>
                    {/* Add your real-time voice component here */}
                </Box>
            )}

            {step === 3 && (
                <Box mt={3}>
                    <Typography>{language === "BM" ? "Soalan Keselamatan" : "Security Questions"}</Typography>
                    {/* Security questions inputs here */}
                </Box>
            )}

            <Box mt={3}>
                <Button variant="contained" onClick={handleNext}>
                    {language === "BM" ? "Seterusnya" : "Next"}
                </Button>
            </Box>
        </Box>
    );
};

export default SignUpWizard;

