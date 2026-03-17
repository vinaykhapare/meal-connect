import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  InputAdornment,
  Link,
  Alert,
  Collapse,
} from "@mui/material";
import {
  HowToReg,
  Person,
  Phone,
  Email,
  LocationOn,
  Lock,
  PinDrop,
  Storefront,
  Category,
  CheckCircleOutline,
  ErrorOutline,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FOOD_SOURCE_TYPES = ["Hotel", "Restaurant", "Hall", "Other"];

const INITIAL_STATE = {
  name: "",
  phone: "",
  email: "",
  location: "",
  pincode: "",
  password: "",
  isFoodSource: false,
  foodSourceName: "",
  foodSourceType: "",
  foodSourceLocation: "",
  foodSourcePinCode: "",
};


const validators = {
  name: (v) => {
    const value = v.trim();

    if (!value) return "Full name is required";

    if (value.length < 2) return "Name must be at least 2 characters";

    if (value.length > 50) return "Name must be less than 50 characters";

    // Only letters and spaces
    if (!/^[A-Za-z\s]+$/.test(value))
      return "Name can only contain letters and spaces";

    // No multiple consecutive spaces
    if (/\s{2,}/.test(value))
      return "Name cannot contain multiple spaces in a row";

    // At least first + last name (optional but recommended)
    if (value.split(" ").length < 2)
      return "Please enter both first and last name";

    return "";
  },

  phone: (v) => {
    const value = v.trim();
    if (!value) return "Phone number is required";
    if (!/^\d{10}$/.test(value)) return "Must be exactly 10 digits";
    if (/^0+$/.test(value)) return "Invalid phone number";
    return "";
  },

  email: (v) => {
    const value = v.trim();
    if (!value) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
      return "Enter a valid email address";
    return "";
  },

  location: (v) =>
    !v.trim() ? "Location is required" : "",

  pincode: (v) => {
    const value = v.trim();
    if (!value) return "Pincode is required";
    if (!/^\d{6}$/.test(value)) return "Must be exactly 6 digits";
    if (value === "000000") return "Invalid pincode";
    return "";
  },

  password: (v) => {
    if (!v) return "Password is required";
    if (v.length < 8) return "Minimum 8 characters required";
    if (!/[A-Z]/.test(v)) return "At least one uppercase letter required";
    if (!/[a-z]/.test(v)) return "At least one lowercase letter required";
    if (!/[0-9]/.test(v)) return "At least one number required";
    if (!/[!@#$%^&*]/.test(v))
      return "At least one special character required";
    return "";
  },

  foodSourceName: (v) =>
    !v.trim() ? "Food source name is required" : "",

  foodSourceType: (v) =>
    !v ? "Please select a food source type" : "",

  foodSourceLocation: (v) =>
    !v.trim() ? "Food source location is required" : "",

  foodSourcePinCode: (v) => {
    const value = v.trim();
    if (!value) return "Pincode is required";
    if (!/^\d{6}$/.test(value)) return "Must be exactly 6 digits";
    return "";
  },
};

/* ── Icon turns red when field has error ── */
function FieldIcon({ icon: Icon, hasError }) {
  return (
    <Icon sx={{ fontSize: 17, color: hasError ? "#dc2626" : "#3b5bdb" }} />
  );
}

/* ── Input sx changes ring colour on error ── */
const makeInputSx = (hasError) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    transition: "box-shadow 0.2s ease",
    "&:hover fieldset": { borderColor: hasError ? "#dc2626" : "#3b5bdb" },
    "&.Mui-focused fieldset": {
      borderColor: hasError ? "#dc2626" : "#3b5bdb",
      borderWidth: "2px",
    },
    "&.Mui-focused": {
      boxShadow: hasError
        ? "0 0 0 3px rgba(220,38,38,0.12)"
        : "0 0 0 3px rgba(59,91,219,0.12)",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: hasError ? "#dc2626" : "#3b5bdb",
  },
});

export default function Signupform() {
  const [isFoodSource, setIsFoodSource] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [registerData, setRegisterData] = useState(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  /* ── Validate one field on blur ── */
  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const value =
      name === "foodSourceType"
        ? registerData.foodSourceType
        : (registerData[name] ?? "");
    const msg = validators[name]?.(value) ?? "";
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  /* ── Live-clear error once user starts correcting ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validators[name]?.(value) ?? "",
      }));
    }
  };

  const handleSourceChange = (e) => {
    const checked = e.target.checked;
    setIsFoodSource(checked);
    setRegisterData((prev) => ({ ...prev, isFoodSource: checked }));
    if (!checked) {
      setErrors((prev) => {
        const next = { ...prev };
        [
          "foodSourceName",
          "foodSourceType",
          "foodSourceLocation",
          "foodSourcePinCode",
        ].forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  /* ── Touch + validate all fields on submit attempt ── */
  const validateAll = () => {
    const fields = [
      "name",
      "phone",
      "email",
      "location",
      "pincode",
      "password",
    ];
    if (isFoodSource) {
      fields.push(
        "foodSourceName",
        "foodSourceType",
        "foodSourceLocation",
        "foodSourcePinCode",
      );
    }
    const newErrors = {};
    const newTouched = {};
    fields.forEach((f) => {
      newTouched[f] = true;
      const value =
        f === "foodSourceType"
          ? registerData.foodSourceType
          : (registerData[f] ?? "");
      const msg = validators[f]?.(value) ?? "";
      if (msg) newErrors[f] = msg;
    });
    setTouched(newTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateAll()) return;

    try {
      const response = await fetch("http://127.0.0.1:3000/api/donor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          location: registerData.location,
          pincode: registerData.pincode,
          password: registerData.password,
          foodSource: isFoodSource
            ? {
                sourceType: registerData.foodSourceType,
                sourceName: registerData.foodSourceName,
                sourceLocation: registerData.foodSourceLocation,
                pincode: registerData.foodSourcePinCode,
              }
            : undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => navigate("/login"), 1800);
      } else {
        setApiError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    }
  };

  const showErr = (name) => !!(touched[name] && errors[name]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#3b5bdb] flex items-center justify-center shadow-md">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              Meal<span className="text-[#3b5bdb]">Connect</span>
            </span>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">
              Nourishing Communities
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: "20px",
            border: "1px solid #f1f5f9",
            boxShadow:
              "0 8px 40px rgba(59,91,219,0.10), 0 2px 8px rgba(0,0,0,0.04)",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow:
                "0 16px 56px rgba(59,91,219,0.16), 0 4px 16px rgba(0,0,0,0.06)",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <HowToReg sx={{ color: "#3b5bdb", fontSize: 22 }} />
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#1a1a2e", fontFamily: "'DM Sans', sans-serif" }}
              >
                Create your account
              </Typography>
            </div>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: "30px", mb: 3 }}
            >
              Join our community of food donors today
            </Typography>

            {/* API error banner */}
            <Collapse in={!!apiError}>
              <Alert
                severity="error"
                icon={<ErrorOutline fontSize="small" />}
                onClose={() => setApiError("")}
                sx={{
                  mb: 2.5,
                  borderRadius: "10px",
                  border: "1px solid #fecaca",
                  background: "#fff5f5",
                  fontSize: "0.83rem",
                }}
                role="alert"
              >
                {apiError}
              </Alert>
            </Collapse>

            <form onSubmit={handleSubmit} noValidate aria-label="Signup form">
              <div className="flex flex-col gap-3">
                {/* Full Name */}
                <TextField
                  label="Full Name"
                  name="name"
                  value={registerData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  error={showErr("name")}
                  helperText={showErr("name") ? errors.name : " "}
                  fullWidth
                  size="small"
                  autoComplete="name"
                  inputProps={{ "aria-label": "Full name" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FieldIcon icon={Person} hasError={showErr("name")} />
                      </InputAdornment>
                    ),
                  }}
                  sx={makeInputSx(showErr("name"))}
                />

                {/* Phone + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phone")}
                    error={showErr("phone")}
                    helperText={showErr("phone") ? errors.phone : " "}
                    fullWidth
                    size="small"
                    autoComplete="tel"
                    inputProps={{ "aria-label": "Phone number", maxLength: 10 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FieldIcon icon={Phone} hasError={showErr("phone")} />
                        </InputAdornment>
                      ),
                    }}
                    sx={makeInputSx(showErr("phone"))}
                  />
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={registerData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    error={showErr("email")}
                    helperText={showErr("email") ? errors.email : " "}
                    fullWidth
                    size="small"
                    autoComplete="email"
                    inputProps={{ "aria-label": "Email address" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FieldIcon icon={Email} hasError={showErr("email")} />
                        </InputAdornment>
                      ),
                    }}
                    sx={makeInputSx(showErr("email"))}
                  />
                </div>

                {/* Location + Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label="Location"
                    name="location"
                    value={registerData.location}
                    onChange={handleChange}
                    onBlur={() => handleBlur("location")}
                    error={showErr("location")}
                    helperText={showErr("location") ? errors.location : " "}
                    fullWidth
                    size="small"
                    autoComplete="address-level2"
                    inputProps={{ "aria-label": "Location" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FieldIcon
                            icon={LocationOn}
                            hasError={showErr("location")}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={makeInputSx(showErr("location"))}
                  />
                  <TextField
                    label="Pincode"
                    name="pincode"
                    value={registerData.pincode}
                    onChange={handleChange}
                    onBlur={() => handleBlur("pincode")}
                    error={showErr("pincode")}
                    helperText={showErr("pincode") ? errors.pincode : " "}
                    fullWidth
                    size="small"
                    autoComplete="postal-code"
                    inputProps={{ "aria-label": "Pincode", maxLength: 6 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FieldIcon
                            icon={PinDrop}
                            hasError={showErr("pincode")}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={makeInputSx(showErr("pincode"))}
                  />
                </div>

                {/* Password with show/hide */}
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={registerData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  error={showErr("password")}
                  helperText={
                    showErr("password")
                      ? errors.password
                      : "Minimum 6 characters"
                  }
                  fullWidth
                  size="small"
                  autoComplete="new-password"
                  inputProps={{ "aria-label": "Password" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FieldIcon icon={Lock} hasError={showErr("password")} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: 17 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 17 }} />
                          )}
                        </button>
                      </InputAdornment>
                    ),
                  }}
                  sx={makeInputSx(showErr("password"))}
                />

                {/* Food Source Toggle */}
                <div
                  className={`rounded-xl border border-dashed px-4 py-3 transition-all duration-200 ${
                    isFoodSource
                      ? "border-blue-300 bg-blue-50/70"
                      : "border-blue-200 bg-blue-50/40"
                  }`}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isFoodSource}
                        onChange={handleSourceChange}
                        sx={{
                          color: "#3b5bdb",
                          "&.Mui-checked": { color: "#3b5bdb" },
                        }}
                        aria-label="Register as a food source"
                      />
                    }
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        I represent a food source{" "}
                        <span className="text-xs text-blue-500 font-normal">
                          (hotel, restaurant, etc.)
                        </span>
                      </span>
                    }
                  />
                </div>

                {/* Food Source Fields */}
                {isFoodSource && (
                  <div className="flex flex-col gap-3 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 animate-fadeIn">
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{
                        color: "#3b5bdb",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Food Source Details
                    </Typography>

                    <TextField
                      label="Food Source Name"
                      name="foodSourceName"
                      value={registerData.foodSourceName}
                      onChange={handleChange}
                      onBlur={() => handleBlur("foodSourceName")}
                      error={showErr("foodSourceName")}
                      helperText={
                        showErr("foodSourceName") ? errors.foodSourceName : " "
                      }
                      fullWidth
                      size="small"
                      inputProps={{ "aria-label": "Food source name" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FieldIcon
                              icon={Storefront}
                              hasError={showErr("foodSourceName")}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={makeInputSx(showErr("foodSourceName"))}
                    />

                    <FormControl
                      size="small"
                      error={showErr("foodSourceType")}
                      fullWidth
                      sx={makeInputSx(showErr("foodSourceType"))}
                    >
                      <InputLabel id="food-source-type-label">
                        Food Source Type
                      </InputLabel>
                      <Select
                        labelId="food-source-type-label"
                        value={registerData.foodSourceType}
                        label="Food Source Type"
                        onChange={(e) => {
                          setRegisterData((prev) => ({
                            ...prev,
                            foodSourceType: e.target.value,
                          }));
                          if (touched.foodSourceType) {
                            setErrors((prev) => ({
                              ...prev,
                              foodSourceType: validators.foodSourceType(
                                e.target.value,
                              ),
                            }));
                          }
                        }}
                        onBlur={() => handleBlur("foodSourceType")}
                        startAdornment={
                          <InputAdornment position="start">
                            <FieldIcon
                              icon={Category}
                              hasError={showErr("foodSourceType")}
                            />
                          </InputAdornment>
                        }
                        sx={{ borderRadius: "10px" }}
                        aria-label="Food source type"
                      >
                        {FOOD_SOURCE_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {showErr("foodSourceType") && (
                        <FormHelperText>{errors.foodSourceType}</FormHelperText>
                      )}
                    </FormControl>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <TextField
                        label="Food Source Location"
                        name="foodSourceLocation"
                        value={registerData.foodSourceLocation}
                        onChange={handleChange}
                        onBlur={() => handleBlur("foodSourceLocation")}
                        error={showErr("foodSourceLocation")}
                        helperText={
                          showErr("foodSourceLocation")
                            ? errors.foodSourceLocation
                            : " "
                        }
                        fullWidth
                        size="small"
                        inputProps={{ "aria-label": "Food source location" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FieldIcon
                                icon={LocationOn}
                                hasError={showErr("foodSourceLocation")}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={makeInputSx(showErr("foodSourceLocation"))}
                      />
                      <TextField
                        label="Food Source Pincode"
                        name="foodSourcePinCode"
                        value={registerData.foodSourcePinCode}
                        onChange={handleChange}
                        onBlur={() => handleBlur("foodSourcePinCode")}
                        error={showErr("foodSourcePinCode")}
                        helperText={
                          showErr("foodSourcePinCode")
                            ? errors.foodSourcePinCode
                            : " "
                        }
                        fullWidth
                        size="small"
                        inputProps={{
                          "aria-label": "Food source pincode",
                          maxLength: 6,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FieldIcon
                                icon={PinDrop}
                                hasError={showErr("foodSourcePinCode")}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={makeInputSx(showErr("foodSourcePinCode"))}
                      />
                    </div>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  aria-label="Submit signup form"
                  startIcon={submitted ? <CheckCircleOutline /> : <HowToReg />}
                  sx={{
                    mt: 0.5,
                    py: 1.4,
                    borderRadius: "12px",
                    background: submitted
                      ? "linear-gradient(135deg, #22c55e, #16a34a)"
                      : "linear-gradient(135deg, #3b5bdb, #4f46e5)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(59,91,219,0.35)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      background: submitted
                        ? "linear-gradient(135deg, #22c55e, #16a34a)"
                        : "linear-gradient(135deg, #2f4ac7, #4338ca)",
                      boxShadow: "0 6px 20px rgba(59,91,219,0.45)",
                      transform: "translateY(-1px)",
                    },
                    "&:active": { transform: "translateY(0px)" },
                  }}
                >
                  {submitted ? "Registered! Redirecting…" : "Create Account"}
                </Button>

                {/* Login link */}
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    underline="hover"
                    sx={{ color: "#3b5bdb", fontWeight: 600 }}
                    aria-label="Go to login page"
                  >
                    Sign in
                  </Link>
                </Typography>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography
          variant="caption"
          display="block"
          align="center"
          color="text.disabled"
          sx={{ mt: 3 }}
        >
          By registering, you agree to our{" "}
          <Link href="#" underline="hover" sx={{ color: "#94a3b8" }}>
            Terms
          </Link>
          {" & "}
          <Link href="#" underline="hover" sx={{ color: "#94a3b8" }}>
            Privacy Policy
          </Link>
        </Typography>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease forwards; }
      `}</style>
    </div>
  );
}
