import {
  Alert,
  Backdrop,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { formData, userEGAT } from "../interface";

import AddressForm from "../components/location";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Review from "../components/review";
import { State } from "./login";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import dayjs from "dayjs";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.aapico.com/">
        AAPICO ITS
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const steps = ["Booking Car", "Booking Review"];

const theme = createTheme();

export function BookingForm() {
  const [allUser, setAllUser] = useState<userEGAT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      await axios
        .post("https://taxi.powermap.live/newtaxi/public/v1/user/get", {
          email: JSON.parse(localStorage.getItem("user") || "").email,
          orgType: JSON.parse(localStorage.getItem("user") || "").orgType,
        })
        .then((r) => {
          setAllUser(r.data.user);
          setLoading(false);
        });
    };
    getUser();
  }, []);

  const [formData, setFormData] = React.useState<formData>({
    is_share: 0,
    no_of_seats: 1,
    paymentOpt: 1,
    datetime: new Date(),
    timezone: "+07:00",
    type: 20,
  });
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
  });
  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <AddressForm
            allUser={allUser}
            handleSubmitForm={handleSubmit}
            setData={setFormData}
            data={formData}
          />
        );
      case 1:
        return (
          <Review
            setData={setFormData}
            allUser={allUser}
            data={formData}
            handleBack={handleBack}
            confirmBook={confirmBook}
          />
        );

      default:
        throw new Error("Unknown step");
    }
  }
  const [activeStep, setActiveStep] = React.useState(0);
  const handleSubmit = async (e: any) => {
    // e.preventDefault();

    // console.log(e);
    e.datetime = dayjs(e.datetime).format("YYYY-MM-DD HH:mm");
    // console.log(e);
    // return;
    //    console.log(e.currentTarget.length);
    setLoading(true);
    let newformData: formData = {
      ...e,
      is_share: 0,
      no_of_seats: 1,
      paymentOpt: 1,

      timezone: "+07:00",
      type: 20,
    };
    setLoading(false);
    // return ;

    const Eta = await axios.post(
      "https://taxi.powermap.live/newtaxi/public/v1/api/eta/new",
      {
        type_id: 20,
        olat: newformData.platitude,
        olng: newformData.plongtitude,
        dlat: newformData.dlatitude,
        dlng: newformData.dlongtitude,
        id: newformData.id,
        datetime: newformData.datetime,
      }
    );

    // console.log(Eta);
    if (!Eta.data.success) {
      console.log("from non 2");

      setState({
        ...state,
        open: true,
        message: Eta.data.error_message,
        type: "error",
      });
      setLoading(false);
      return;
    }
    // console.log(newformData);

    setFormData({
      ...newformData,
      eta_distance: Eta.data.distance,
      eta_distance_price: Eta.data.distance_price,
      eta_time: Eta.data.time,
      eta_time_price: Eta.data.time_price,
      minAmount: Eta.data.min_amount,
    });
    // console.log(Eta.data);
    setLoading(false);

    setActiveStep(activeStep + 1);

    // console.log(e.currentTarget[1]);
  };
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const confirmBook = async () => {
    // console.log(formData);
    // return null
    let userData;
    let regis = false;
    if (allUser.find((d) => d.email === formData.email) === undefined) {
      console.log("register");

      //register
      userData = await axios.post(
        "https://taxi.powermap.live/newtaxi/public/v1/user/signup",
        {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          phone_number: formData.tel?.replace("0", "+66"),
          login_method: "manual",
          login_by: "android",
          gender: "2",
          profile_pic: "",
          device_token: "testtoken",
          country_code: "+66",
          country: "TH",
          social_unique_id: "a",
          time_zone: "+07:00",
          user_login_type: JSON.parse(localStorage.getItem("user") || "")
            .orgType,
        }
      );

      regis = true;
    }

    if (regis) {
      if (!userData?.data.success) {
        setState({
          ...state,
          open: true,
          message: userData?.data.error_message,
          type: "error",
        });
      } else {
        formData.id = userData?.data.user.id;
        formData.token = userData?.data.user.token;
      }
    }
    //  else {
    //   userData = await axios.post(
    //     "https://taxi.powermap.live/newtaxi/public/v1/user/login",
    //     {
    //       username: formData.tel?.replace("0", "+66"),
    //       device_token: "test",
    //       login_by: "android",
    //       login_method: "manual",
    //       social_unique_id: "a",
    //       new_flow: true,
    //     }
    //   );
    // }
    let newRemark = JSON.stringify({
      remark: formData.remark,
      passenger: formData.passenger,
    });

    axios
      .post("https://taxi.powermap.live/newtaxi/public/v1/user/ridelater", {
        book_from: "pc",
        datetime: formData.datetime,
        dlatitude: formData.dlatitude,
        dlocation: formData.dlocation,
        dlongitude: formData.dlongtitude,
        eta_distance: formData.eta_distance,
        eta_distance_price: formData.eta_distance_price,
        eta_time: formData.eta_time,
        eta_time_price: formData.eta_time_price,
        id: formData.id,
        is_share: 0,
        no_of_seats: 1,
        orgReqId: formData.orgReqID,
        paymentOpt: 1,
        platitude: formData.platitude,
        plocation: formData.plocation,
        plongitude: formData.plongtitude,
        timezone: "+07:00",
        type: 20,
        token: formData.token,
        remark: newRemark,
      })
      .then((res) => {
        if (res.data.success) {
          setState({
            ...state,
            open: true,
            message: "จองรถสำเร็จ",
            type: "success",
          });
          setFormData({
            is_share: 0,
            no_of_seats: 1,
            paymentOpt: 1,
            datetime: new Date(),
            timezone: "+07:00",
            type: 20,
          });
          setActiveStep(activeStep - 1);
        } else {
          if (res?.data.error_message === "Token mismatched") {
            setState({
              ...state,
              open: true,
              message:
                "มีการเข้าสู่ระบบจากอุปกรณ์อื่น : กรุณาเข้าสู่ระบบอีกครั้ง",
              type: "error",
            });
          }
        }
      });
  };
  const handleClose = () => {
    setState({ ...state, open: false, message: "" });
  };
  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => setLoading(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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

      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        {/* <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            EGAT
          </Typography>
        </Toolbar> */}
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Booking Taxi
          </Typography>

          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography className=" text-center" variant="h5" gutterBottom>
                  จองรถสำเร็จ
                </Typography>
                {/* <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order
                  confirmation, and will send you an update when your order has
                  shipped.
                </Typography> */}
              </React.Fragment>
            ) : (
              <React.Fragment>{getStepContent(activeStep)}</React.Fragment>
            )}
          </React.Fragment>
        </Paper>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}
