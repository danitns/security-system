import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CurrentUserContext } from "../ReactContexts/currentUserContext";

const PrivateRoute = (props) => {
  const { currentUser } = useContext(CurrentUserContext);
  return currentUser.session ? props.children : <Navigate to="/login" />;
};

export default PrivateRoute;
