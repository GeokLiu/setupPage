// src/pages/SignUpStep2.tsx
import React, { useState, useContext, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

const translations = {
  BM: { confirmInfo: "Sahkan Maklumat Anda", fullName: "Nama Penuh", icNumber: "Nombor IC", address: "Alamat", next: "Seterusnya" },
  BI: { confirmInfo: "Confirm Your Info", fullName: "Full Name", icNumber: "IC Number", address: "Address", next: "Next" },
};

interface LocationState {
  icData?: { [key: string]: any };
}

const SignUpStep2: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const location = useLocation();
  const state = location.state as LocationState;

  const [name, setName] = useState("");
  const [icNumber, setIcNumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!state?.icData) return;

    const d = state.icData;
    setName(d.fullName || "");
    setIcNumber(d.icNumber || "");
    setAddress(d.address || "");
  }, [state]);

  const handleNext = () => {
    navigate("/signup-voice", { state: { userData: { name, icNumber, address } } });
  };

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h4">{translations[language].confirmInfo}</Typography>
      <TextField label={translations[language].fullName} value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={{ my: 1 }} />
      <TextField label={translations[language].icNumber} value={icNumber} onChange={(e) => setIcNumber(e.target.value)} fullWidth sx={{ my: 1 }} />
      <TextField label={translations[language].address} value={address} onChange={(e) => setAddress(e.target.value)} fullWidth sx={{ my: 1 }} />

      <Button variant="contained" sx={{ mt: 3 }} onClick={handleNext}>
        {translations[language].next}
      </Button>

      {state?.icData && (
        <Box mt={2} textAlign="left">
          <Typography variant="subtitle2">Debug: raw IC data</Typography>
          <pre style={{ textAlign: "left", whiteSpace: "pre-wrap" }}>{JSON.stringify(state.icData, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default SignUpStep2;
