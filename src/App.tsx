import "./App.css";

import {
  Link,
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import React, { Fragment } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BookingForm } from "./pages/booking";
import Layout from "./components/Layout";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { SignIn } from "./pages/login";
import Test from "./pages/test";
import reactLogo from "./assets/react.svg";
import { useState } from "react";

const AuthRoute = () => {
  const location = useLocation();
  let token: string | null = null;

  if (localStorage.getItem("user")) {
    token = JSON.parse(localStorage.getItem("user") || "");
  }

  if (token === null) {
    if (location.pathname === "/signin") {
      return <SignIn />;
    }
    return <Navigate to="/signin" />;
  } else if (token !== null && location.pathname === "/signin") {
    return <Navigate to="/" />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
  // return <Route path="/signin" element={<SignIn />} />
};
function App({ children }: any) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Fragment>
            <Routes>
              {/* <Route path="/" element={<AuthRoute />}>
                <Route path="/" element={<BookingForm />} />
                <Route path="/test" element={<Test />} />
              </Route> */}
              {/* <Route path="/signin" element={<AuthRoute />} /> */}
              <Route path="/" element={<BookingForm />} />
              <Route path="*" element={<div>404</div>} />
            </Routes>
          </Fragment>
        </Router>
      </LocalizationProvider>
    </div>
  );
}

export default App;
