// src/pages/SignUp1.tsx
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp1: React.FC = () => {
    const [frontIC, setFrontIC] = useState<string | null>(null);
    const [backIC, setBackIC] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const navigate = useNavigate();

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

    const handleNext = async () => {
        if (!frontIC || !backIC) return alert("Please scan both front and back of your IC");

        try {
            setLoading(true);
            const formData = new FormData();
            const frontBlob = await (await fetch(frontIC)).blob();
            const backBlob = await (await fetch(backIC)).blob();
            formData.append("front_ic", frontBlob, "front_ic.png");
            formData.append("back_ic", backBlob, "back_ic.png");

            // Send images to backend to extract IC info
            const response = await axios.post("http://localhost:8000/extract-ic", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Navigate to Step 2 with extracted IC info
            navigate("/signup-step2", { state: { icData: response.data } });
        } catch (err) {
            console.error(err);
            alert("Failed to extract IC info. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h4" gutterBottom>
                Sign Up
            </Typography>

            {!frontIC || !backIC ? (
                <>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        width={300}
                    />
                    <Box mt={2}>
                        <Button variant="contained" onClick={captureIC}>
                            {!frontIC ? "Scan Front of IC" : "Scan Back of IC"}
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
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mr: 2 }}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Next"}
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

