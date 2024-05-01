import React, { useEffect, useState } from "react";
import {
  CurrentUserContext,
  ICurrentUser,
  ICurrentUserContext,
} from "./currentUserContext";
import { supabase } from "../../utils/supabase";

interface IContextContainer {
  children: JSX.Element;
}

const ContextContainer: React.FC<IContextContainer> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({} as ICurrentUser);
  const currentUserContextValue = React.useMemo(() => {
    return {
      currentUser: currentUser,
      setCurrentUser: setCurrentUser,
    };
  }, [currentUser, setCurrentUser]) as ICurrentUserContext;

  return (
    <>
      <CurrentUserContext.Provider value={currentUserContextValue}>
        {children}
      </CurrentUserContext.Provider>
    </>
  );
};

export default ContextContainer;
