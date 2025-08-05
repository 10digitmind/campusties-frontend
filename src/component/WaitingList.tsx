import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  userName: string;
  email: string;
  phoneNumber: string;
}

const WaitingList: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    email: '',
    phoneNumber: '',
  });

  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { userName, email, phoneNumber } = formData;

    if (!userName || !email || !phoneNumber) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setMessage('Submitting...');

    try {
      const res = await fetch('https://thrifftify-backend.onrender.com/api/users/createlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'You’ve joined the waiting list successfully!');
        setFormData({ userName: '', email: '', phoneNumber: '' });

        setTimeout(() => {
            setMessage('')
        }, 2500);
      } else {
        setError(data.error || 'Something went wrong.');
        setMessage('');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
      console.log(err)
      setMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Be the First to Know!</h2>
      <p style={styles.description}>
      We're building something exciting  a dating platform made for both students and non-students where real connections meet real value. Whether you're looking for love, friendships, or meaningful chats, this is your space. Plus, users can receive real money when others  paid for  attention  because your time and presence matter.

Join our waiting list to get early access, exclusive perks, and be part of a dating experience that actually values you</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="userName"
          placeholder="Full Name"
          value={formData.userName}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Join Waiting List</button>
      </form>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    border: '1px solid #eee',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
    marginTop:"150px"
  },
  description: {
    fontSize: '14px',
    marginBottom: '1.5rem',
    color: '#444',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    backgroundColor: 'gold',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  success: {
    marginTop: '1rem',
    color: 'green',
  },
  error: {
    marginTop: '1rem',
    color: 'red',
  },
};

export default WaitingList;
