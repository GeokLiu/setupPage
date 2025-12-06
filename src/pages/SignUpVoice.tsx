import React, { useState, useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import axios from "axios";

const translations = {
    BM: { recordVoice: "Rakam Suara Anda", next: "Seterusnya" },
    BI: { recordVoice: "Record Your Voice", next: "Next" },
};

const SignUpVoice: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useContext(LanguageContext);

    const { icNumber } = (location.state as any) || {}; // received from step 2

    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => setAudioBlob(new Blob(chunks, { type: "audio/wav" }));
        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorder) mediaRecorder.stop();
        setRecording(false);
    };

    const handleNext = async () => {
        if (!audioBlob) return alert("Please record your voice first");

        const formData = new FormData();
        formData.append("ic_number", icNumber);
        formData.append("file", audioBlob, `${icNumber}.wav`);

        try {
            await axios.post("http://localhost:8000/signup-voice", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Pass IC number to next step
            navigate("/signup-security", { state: { icNumber } });
        } catch (err: any) {
            alert(err.response?.data?.detail || "Failed to save voice");
        }
    };

    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h4">{translations[language].recordVoice}</Typography>

            <Box mt={2}>
                {!recording ? (
                    <Button variant="contained" onClick={startRecording}>Start Recording</Button>
                ) : (
                    <Button variant="contained" onClick={stopRecording}>Stop Recording</Button>
                )}
            </Box>

            <Box mt={3}>
                <Button variant="contained" onClick={handleNext}>{translations[language].next}</Button>
            </Box>
        </Box>
    );
};

export default SignUpVoice;



