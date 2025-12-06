import React, { useState, useContext } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import axios from "axios";

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useContext(LanguageContext);

    const [icNumber, setIcNumber] = useState("");
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => setAudioBlob(new Blob(chunks, { type: "audio/wav" }));

            recorder.start();
            setMediaRecorder(recorder);
            setRecording(true);
        } catch (err) {
            alert("Cannot access microphone. Please allow microphone permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) mediaRecorder.stop();
        setRecording(false);
    };

    // ✅ Updated handleLogin as per your request
    const handleLogin = async () => {
        if (!icNumber) return alert("Enter IC number");
        if (!audioBlob) return alert("Record your voice");

        try {
            const response = await axios.post("http://localhost:8000/login", {
                ic_number: icNumber,
                voice_verified: true,
            });

            if (!response.data.success) {
                alert("Login failed. You need to sign up first.");
                navigate("/signup"); // redirect to signup page automatically
            } else {
                alert("Login successful");
                navigate("/user-mode");
            }
        } catch (err: any) {
            alert("Login failed. Redirecting to signup.");
            navigate("/signup-step1"); // redirect on any error
        }
    };

    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h4">{language === "BM" ? "Log Masuk" : "Sign In"}</Typography>

            <TextField
                placeholder="IC Number"
                value={icNumber}
                onChange={(e) => setIcNumber(e.target.value)}
                sx={{ mt: 2 }}
            />

            <Box mt={2}>
                {!recording ? (
                    <Button variant="contained" onClick={startRecording}>
                        {language === "BM" ? "Mula Rakaman" : "Start Recording"}
                    </Button>
                ) : (
                    <Button variant="contained" onClick={stopRecording}>
                        {language === "BM" ? "Hentikan Rakaman" : "Stop Recording"}
                    </Button>
                )}
            </Box>

            <Box mt={3}>
                <Button variant="contained" onClick={handleLogin}>
                    {language === "BM" ? "Log Masuk" : "Sign In"}
                </Button>
            </Box>

            <Box mt={2}>
                <Button variant="outlined" onClick={() => navigate("/")}>
                    {language === "BM" ? "Kembali ke Laman Utama" : "Back to Home"}
                </Button>
            </Box>
        </Box>
    );
};

export default SignIn;


