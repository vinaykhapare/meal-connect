import { useState } from "react";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PasswordIcon from "@mui/icons-material/Password";
import Link from "@mui/joy/Link";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

function Loginform() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(loginData.email, loginData.password);
      await login(response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        maxHeight: "max-content",
        maxWidth: "fit-content",
        mx: "auto",
      }}
    >
      <Typography level="title-lg" startDecorator={<AccountCircleIcon />}>
        Login
      </Typography>
      <Divider inset="none" />
      <CardContent
        sx={{
          display: "grid",
        }}
      >
        <FormControl sx={{ gridColumn: "1/-1" }}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            endDecorator={<AlternateEmailIcon />}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            endDecorator={<PasswordIcon />}
          />
        </FormControl>
        <p>
          New user?
          <Link href="/register">Register</Link>
        </p>
        <Button variant="solid" color="primary" onClick={handleSubmit}>
          Login
        </Button>
      </CardContent>
    </Card>
  );
}

export default Loginform;
