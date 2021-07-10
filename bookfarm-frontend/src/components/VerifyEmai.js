import React, { useState, useEffect } from "react";
import { useLocation, Redirect } from "react-router-dom";
import server from "../apis/server";
import Spinner from "react-bootstrap/Spinner";
import createNotification from "./util/Notification";

const VerifyEmail = () => {
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");
  const [verificationStatus, setVerificationStatus] = useState(0);

  useEffect(() => {
    server
      .post("/auth/verify-email/", {
        token: token,
      })
      .then((response) => {
          
        createNotification( "Email Verified Successfully!", 'success');
        setTimeout(() => {
          setVerificationStatus(1);
        }, 500);
      })
      .catch((err) => {
          console.log(err)
        setVerificationStatus(-1);
      });
  }, []);

  if (verificationStatus === 0) {
    return (
      <div className="container">
        <Spinner
          animation="border"
          variant="primary"
          size="lg"
          style={{ position: "absolute", top: "50%", left: "50%" }}
        />
      </div>
    );
  } else if (verificationStatus === 1) {
    return (
      <div className="container">
        <Redirect to="/" />
      </div>
    );
  } else {
    return (
      <div className="container">
        <div
          className="alert alert-danger p-3"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          Invalid token. Please try again.
        </div>
      </div>
    );
  }
};

export default VerifyEmail;
