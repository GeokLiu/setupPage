import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const SignUpStep2: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Debug: 看看数据到底有没有传过来 (按 F12 看 Console)
    console.log("Step 2 Received State:", state);

    // 1. 接收数据 (如果没有数据，给个默认空值，防止报错)
    const [fullName, setFullName] = useState(state?.fullName || "");
    const [icNumber, setIcNumber] = useState(state?.icNumber || "");
    const [address, setAddress] = useState(state?.address || "");

    // 如果 state 也没拿到，可能是直接刷新了页面，我们手动填一下 Mock (仅用于开发)
    useEffect(() => {
        if (!state) {
            setFullName("TAN SENG HONG");
            setIcNumber("990101-14-5678");
            setAddress("KL Default Address");
        }
    }, [state]);

    const handleNext = () => {
        // 2. 把你可能修改过的数据 (Editor Info) 传给下一页 (Voice)
        navigate('/signup-voice', {
            state: {
                fullName: fullName,
                icNumber: icNumber,
                address: address
            }
        });
    };

    return (
        <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5', p: 0 }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3, bgcolor: 'white', borderRadius: { xs: 0, sm: 4 }, my: { xs: 0, sm: 4 } }}>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={() => navigate(-1)}><ArrowBackIosNewIcon /></IconButton>
                    <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>Confirm Info</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* 这里是可以 Edit 的输入框 */}
                    <TextField 
                        label="Full Name" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        fullWidth 
                    />
                    <TextField 
                        label="IC Number" 
                        value={icNumber} 
                        onChange={(e) => setIcNumber(e.target.value)} 
                        fullWidth 
                    />
                    <TextField 
                        label="Address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        fullWidth multiline rows={3} 
                    />
                </Box>

                <Box sx={{ mt: 'auto', pt: 3 }}>
                    <Button variant="contained" size="large" fullWidth onClick={handleNext} sx={{ py: 1.5, fontSize: '1.1rem' }}>
                        Confirm & Next
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUpStep2;