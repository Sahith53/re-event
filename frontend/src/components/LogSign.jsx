import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// const API_URL = 'https://localhost:3000'; // For development
const API_URL = 'https://re-event-1.onrender.com'; // For production

const LogSign = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();

  const handleOtpSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Sending OTP verification request...');
      const response = await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Verification response:', response.data);

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set token in axios defaults for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        console.log('Token stored in localStorage and axios headers');
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Sending OTP request for email:', email);
      const response = await axios.post(`${API_URL}/send-otp`, {
        email
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Send OTP response:', response.data);

      if (response.status === 200) {
        setShowOtpInput(true);
        setError('');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {error && <div className="error-message">{error}</div>}
      
      {!showOtpInput ? (
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmitForm}>
          <div className="email-display">{email}</div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            disabled={loading}
            maxLength={5}
            pattern="[0-9]{5}"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
          <button 
            type="button" 
            onClick={() => {
              setShowOtpInput(false);
              setOtp('');
              setError('');
            }}
            disabled={loading}
          >
            Change Email
          </button>
        </form>
      )}
    </div>
  );
};

export default LogSign; 