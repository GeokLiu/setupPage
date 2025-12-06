// src/pages/SignUp1.tsx
import React, { useState, useRef, useContext } from "react";
import Webcam from "react-webcam";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

const SignUp1: React.FC = () => {
  const [frontIC, setFrontIC] = useState<string | null>(null);
  const [backIC, setBackIC] = useState<string | null>(null);
  const { language } = useContext(LanguageContext);
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();

  const translations = {
    BM: { scanFront: "Imbas Hadapan IC", scanBack: "Imbas Belakang IC", next: "Seterusnya" },
    BI: { scanFront: "Scan Front of IC", scanBack: "Scan Back of IC", next: "Next" },
  };

  const captureIC = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    if (!frontIC) setFrontIC(imageSrc);
    else if (!backIC) setBackIC(imageSrc);
  };

  const handleRetake = () => {
    if (backIC) setBackIC(null);
    else if (frontIC) setFrontIC(null);
  };

  const handleNext = () => {
    if (!frontIC || !backIC) return alert("Please scan both front and back of your IC");

    // MOCK IC DATA
    const mockIcData = {
      fullName: "TAN SENG HONG",
      icNumber: "990101145678",
      address: "N277 JALAN PERKASA 1 TAMAN MALURI, 55100, KUALA LUMPUR",
    };

    navigate("/signup-step2", { state: { icData: mockIcData } });
  };

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>

      {!frontIC || !backIC ? (
        <>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/png" width={300} />
          <Box mt={2}>
            <Button variant="contained" onClick={captureIC}>
              {!frontIC ? translations[language].scanFront : translations[language].scanBack}
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <Box textAlign="center">
              <Typography variant="subtitle1">Front of IC</Typography>
              <img src={frontIC} alt="Front IC" width={150} />
            </Box>
            <Box textAlign="center">
              <Typography variant="subtitle1">Back of IC</Typography>
              <img src={backIC} alt="Back IC" width={150} />
            </Box>
          </Box>

          <Box mt={3}>
            <Button variant="contained" onClick={handleNext} sx={{ mr: 2 }}>
              {translations[language].next}
            </Button>
            <Button variant="outlined" onClick={handleRetake}>
              Retake
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SignUp1;
