import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import LoginIcon from "@mui/icons-material/Login";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import Link from "@mui/joy/Link";
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { scaleIn } from '../../animations';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", {
        email: formData.email.trim(),
        password: formData.password.trim()
      });

      const response = await fetch("http://127.0.0.1:3000/api/receiver/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        login(data);
        if (data.user.role === 'ngo') {
          navigate('/ngo/dashboard');
        } else {
          navigate('/');
        }
      } else {
        if (data.verificationStatus === 'Pending') {
          alert("Your account is pending verification. Please wait for admin approval.");
        } else if (data.verificationStatus === 'Rejected') {
          alert(data.message || "Your registration was not approved.");
        } else {
          alert(data.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.message || "An error occurred during login.");
    }
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
    >
      <Card
        variant="outlined"
        sx={{
          maxHeight: "max-content",
          maxWidth: "40%",
          mx: "auto",
        }}
      >
        <Typography level="title-lg" startDecorator={<LoginIcon />}>
          Login
        </Typography>
        <Divider inset="none" />
        <CardContent
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
            gap: 1.5,
          }}
        >
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              endDecorator={<EmailIcon />}
            />
          </FormControl>

          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              endDecorator={<PasswordIcon />}
            />
          </FormControl>

          <p>
            Don't have an account?{" "}
            <Link href="/signup">Sign up</Link>
          </p>

          <CardActions sx={{ gridColumn: "1/-1" }}>
            <Button variant="solid" color="primary" onClick={handleSubmit}>
              Login
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default Login;