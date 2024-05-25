import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { privateRoutes } from "../constants/arrays";
import { RoutesList } from "../RoutesList";
import { objectInterface, reduxAuth } from "../util/interface";
import Cookies from "js-cookie";
import { Datakey } from "../util/massages";
interface AuthHandlerProps {
  children: React.ReactNode;
}

const AuthHandler = ({ children }: AuthHandlerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const isLoading = useSelector((state: reduxAuth) => state.auth.isLoading);
  const showRoutes = [...RoutesList.filter((ele: objectInterface) => {
    return currentUser?.roleAndPermission?.permissions?.find((e: objectInterface) => ["profile"].includes(ele.screen) || (e.screenName === ele.screen && !e.isNone))
  })].sort((a: objectInterface, b: objectInterface) => a.screenOrder - b.screenOrder)

  useEffect(() => {
    if (Cookies.get(Datakey.COOKIE_NAME)) {
      if (currentUser && !currentUser?.company && !pathname.includes("/confirm-registration")) {
        navigate("/company")
      }
      else if ((![...privateRoutes].includes(pathname)) && currentUser?.company && !pathname.includes("/confirm-registration")) {
        currentUser?.company ? navigate(`/${showRoutes?.length !== 0 && (showRoutes[0].path || "dashboard")}`) : navigate("/company")
      }
      else return;
    } else if (!pathname.includes("/reset-password") && !pathname.includes("/register") && !pathname.includes("/confirm-registration")
      && !Cookies.get(Datakey.COOKIE_NAME) && !pathname.includes("/forgetPassword") && !currentUser && isLoading === false) {
      navigate("/login");
    }
  }, [currentUser, isLoading]);
  return children;
};

export default AuthHandler;
