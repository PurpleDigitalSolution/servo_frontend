import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useLocation } from "react-router-dom";

const SessionChecker = () => {
  const lastCheckTimeRef = React.useRef<number>(0);
  const location = useLocation();
  const isCheckingRef = React.useRef<boolean>(false);
  const { checkAuthentication } = useAuthStore();
  useEffect(() => {

    let isMounted = true;

    const performSessionCheck = async (force = false) => {
      const now = Date.now();

      if (
        !force &&
        (isCheckingRef.current || now - lastCheckTimeRef.current < 9000)
      ) {
        return;
      }
      if (!isMounted || isCheckingRef.current) return;

      isCheckingRef.current = true;
      lastCheckTimeRef.current = now;

      try {
        await checkAuthentication();

      } catch (error) {
        console.log("Session check failed:", error);
      } finally {
        if (isMounted) {
          isCheckingRef.current = false;
        }
      }
    };
    performSessionCheck();
    const interval = setInterval(() => performSessionCheck(), 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [location.pathname, checkAuthentication]);

  return null;
};

export default SessionChecker;
