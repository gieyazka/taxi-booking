import { Alert, Snackbar } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";

export interface State {
  open: boolean;
  vertical: string;
  horizontal: string;
  message?: string;
  type: any;
}
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.aapico.com/">
        AAPICO ITS
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export function SignIn() {
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
  });
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let email: string = "";
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get("email") === "") {
      setState({
        ...state,
        open: true,
        message: "Please input data",
        type: "warning",
      });
      return;
    }

    if (data.get("email") !== "") {
      email = data.get("email") as string;
      if (email[0] === "0" && !email.includes("@")) {
        email = email.replace("0", "+66");
      }
    }
    axios
      .post("http://147.50.144.212/newtaxi/public/v1/user/login", {
        username: email,
        device_token: "test",
        login_by: "android",
        login_method: "manual",
        social_unique_id: "a",
        new_flow: true,
      })
      .then((res) => {
        if (res.data.success) {
          setState({
            ...state,
            open: true,
            message: "Login success",
            type: "success",
          });
          console.log(res.data);

          localStorage.setItem("user", JSON.stringify({
            id: res.data.user.id,
            token: res.data.user.token,
          }));

          // <Navigate to="/test" />;
          navigate("/");
        } else {
          setState({
            ...state,
            open: true,
            message: "Login failed",
            type: "error",
          });
        }
      });
  };
  const handleClose = () => {
    setState({ ...state, open: false, message: "" });
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={state.open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={state.message}
        key="topright"
      >
        <Alert severity={state.type}>{state.message}</Alert>
      </Snackbar>

      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            {/* <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              /> */}
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {/* <Grid container>
              <Grid item xs>
              <Link href="#" variant="body2">
              Forgot password?
                </Link>
                </Grid>
                <Grid item>
                <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
                </Link>
                </Grid>
            </Grid> */}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </>
  );
}
