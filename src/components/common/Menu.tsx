import React from 'react';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Header from "./Header";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Company_logo, } from "../../assets/Esvgs";
import { Datakey, Msg } from "../../util/massages";
import { useEffect, useState } from "react";
import "./menu.scss";
import { Colors } from "../../redux/constants/Colors";
import LogoutIcon from "@mui/icons-material/Logout";
import { Tooltip } from "@mui/material";
import { actions } from "../../redux/store/store";
import { useSelector } from "react-redux";
import { privateRoutes, publicRoutes } from "../../constants/arrays";
import LogoutModal from "../shared/customModal/LogoutModal";
import { RoutesList } from "../../RoutesList";
import { objectInterface, reduxAuth } from '../../util/interface';
import Cookies from "js-cookie";
import { pathOr } from 'rambda';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
interface MenuProps {
  children: React.ReactNode;
  statusCode: number | string | undefined | null
}

const Menu = (props: MenuProps) => {
  const { children, statusCode } = props;
  const { pathname } = useLocation(); 0
  const [open, setOpen] = useState(false);
  const drawerWidth = open ? 240 : 60;
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const [permission, setPermission] = useState<objectInterface[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const roleAndPermission = pathOr([], ['roleAndPermission', 'permissions'], currentUser);
    setPermission(roleAndPermission)
  }, [currentUser])

  // TODO: optimize below code, here link https://www.perplexity.ai/search/Optimize-this-code-Wr0kTrs9TySZZ.ViJbHQbw
  // if (currentUser === undefined && (!["/login", "/forgetPassword",].includes(pathname)) && !pathname.includes("/register") && !pathname.includes("/reset-password") && !pathname.includes("/confirm-registration")) {
  //   return (
  //     <div className='center_div'>
  //       {statusCode !== 504 ? "" : <InternalServerErrorPage />}
  //     </div>
  //   );
  // } else if ((currentUser === undefined || currentUser) && (!privateRoutes.includes(pathname)) && Cookies.get(Datakey.COOKIE_NAME) && !pathname.includes("/company")) {
  //   return (
  //     <div className='center_div'>
  //       {statusCode !== 504 ? "" : <InternalServerErrorPage />}
  //     </div>
  //   )
  // }
  const isLoginPage = ["/login", "/forgetPassword"].includes(pathname);
  const isRestrictedPage = pathname.includes("/register") || pathname.includes("/reset-password") || pathname.includes("/confirm-registration");
  const isPrivateRoute = privateRoutes.includes(pathname);
  const isCompanyPage = pathname.includes("/company");

  if (currentUser === undefined && !isLoginPage && !isRestrictedPage) {
    return (
      <div className='center_div'>
        {statusCode === 504 && <InternalServerErrorPage />}
      </div>
    );
  } else if ((currentUser === undefined || currentUser) && !isPrivateRoute && Cookies.get(Datakey.COOKIE_NAME) && !isCompanyPage) {
    return (
      <div className='center_div'>
        {statusCode === 504 && <InternalServerErrorPage />}
      </div>
    );
  }

  const showRoutes = [...RoutesList.filter((ele: objectInterface) => {
    return permission?.find((e: objectInterface) => ["profile"].includes(ele.screen) || (e.screenName === ele.screen && !e.isNone))
  })].sort((a: objectInterface, b: objectInterface) => a.screenOrder - b.screenOrder)

  const drawerStyles = {
    width: drawerWidth,
    transition: "width 0.4s ease-in",
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      boxSizing: "border-box",
      width: `${drawerWidth}px`,
      overflow: "hidden",
      transition: "0.4s ease-in",
    },
    "& .MuiPaper-root": {
      backgroundColor: Colors.light.white,
    },
  };

  return (
    <>
      {
        [...privateRoutes, ...publicRoutes, "/company"].includes(pathname) && pathname.trim() !== "/" || pathname.includes("/reset-password") || pathname.includes("/confirm-registration") || pathname.includes("/register") ? (
          <>
            {![...publicRoutes, "/company"].includes(pathname) && !pathname.includes("/reset-password") && !pathname.includes("/confirm-registration") && !pathname.includes("/register") ? (
              <Box className="menu_bar" sx={{ display: "flex" }} >
                <Header open={open} setOpen={setOpen} />
                <Drawer
                  variant="permanent"
                  sx={drawerStyles}
                  anchor="left"
                  open>
                  <div>
                    <Toolbar>
                      <img
                        src={Company_logo}
                        style={{ marginLeft: "-1rem" }}
                        alt={Msg.NOT_FOUND} />
                    </Toolbar>
                    <Divider />
                    <List>
                      {showRoutes.map(({ path, Icon, name }, index) => (
                        <NavLink
                          to={`/${path}`}
                          className={({ isActive }) =>
                            `navItem ${isActive || pathname.includes(path) ? "activeNavItem" : ""}`
                          }
                          key={index}>
                          <List className="active_list_item" style={{ display: "flex", alignItems: "center" }}>
                            {
                              <Tooltip PopperProps={{ className: 'custom-tooltip-main' }} title={name} placement="right"
                                disableHoverListener={open && true}>
                                <Icon className="navIcon" />
                              </Tooltip>
                            }
                            <span className="navLabel">{name}</span>
                          </List>
                        </NavLink>
                      ))}
                    </List>

                    <div className="logout_div" onClick={() => actions.modal.openLogoutModal({})}>
                      <Tooltip
                        title={"Logout"} placement="right"
                        disableHoverListener={open && true}
                        PopperProps={{ className: 'custom-tooltip-logout' }}>
                        <LogoutIcon className="Logout_icon" />
                      </Tooltip>
                      {open && <span className="logout_label">{Msg.LOGOUT_MENU}</span>}
                    </div>
                  </div>
                </Drawer>
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` }
                  }}>
                  <Toolbar />
                  <div style={{ backgroundColor: "#fefefe" }}>{children}</div>
                </Box>
              </Box >
            ) : (
              <div>{children}</div>
            )}
          </>
        ) : (
          navigate("/dashboard")
        )
      }
      <LogoutModal />
    </>
  );
}

export default Menu;

const InternalServerErrorPage = () => {
  return (
    <div className='erro_page_div'>
      <div className='error_heading'>
        <ReportProblemIcon className='heading_icon' />
        <h3>{Msg.ERROR_HEADING}</h3>
      </div>
      <span className='error_dec'>{Msg.ERROR_DEC}</span>
    </div>
  )
}