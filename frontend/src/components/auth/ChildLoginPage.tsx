import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  Person as PersonIcon,
  Key as KeyIcon
} from '@mui/icons-material';
import { useChildAuth } from '../../contexts/ChildAuthContext';

const ChildLoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    authKey: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginChild } = useChildAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginChild(formData);
      navigate(`/child-dashboard/${response.childId}`);
    } catch (error: any) {
      setError(error.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                🌟 아이 로그인 🌟
              </Typography>
              <Typography variant="h6" color="textSecondary">
                칭찬 포인트에 오신 것을 환영해요!
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                name="username"
                label="아이디"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ color: 'action.active', mr: 1 }} />
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                margin="normal"
                name="authKey"
                label="비밀번호"
                type="password"
                value={formData.authKey}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  startAdornment: <KeyIcon sx={{ color: 'action.active', mr: 1 }} />
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
              </Button>
            </Box>

            <Box textAlign="center" mt={3}>
              <Button
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ textDecoration: 'underline' }}
              >
                부모님 로그인하기
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ChildLoginPage;