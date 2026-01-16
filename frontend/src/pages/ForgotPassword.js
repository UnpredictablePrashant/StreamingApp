import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { AuthContainer, FormContainer } from '../styles/auth.styles';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccess('Password reset instructions have been sent to your email.');
        setEmail('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Typography component="h1" variant="h5">
        Reset Password
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
        Enter your email address and we'll send you instructions to reset your password.
      </Typography>
      {success && (
        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
          {success}
        </Alert>
      )}
      <FormContainer onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Send Reset Instructions'}
        </Button>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Remember your password?{' '}
          <Link component={RouterLink} to="/login">
            Sign In
          </Link>
        </Typography>
      </FormContainer>
    </AuthContainer>
  );
};

