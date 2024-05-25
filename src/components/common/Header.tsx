import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@rsuite/icons/Menu";
import { Msg } from "../../util/massages";
import { Colors } from "../../redux/constants/Colors";
import { objectInterface } from "../../util/interface";

const Header = (props: objectInterface) => {
  const { open, setOpen } = props;
  const drawerWidth = open ? 240 : 60;

  const appBarStyles = {
    width: `calc(100% - ${drawerWidth}px)`,
    ml: `${drawerWidth}px`,
    bgcolor: Colors.light.white,
    color: Colors.dark.black,
    transition: "0.4s ease-in",
  };

  const menuIconStyles = {
    color: "black",
    cursor: "pointer"
  };

  const headerTextStyles = {
    marginLeft: "10px",
    color: "black"
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={appBarStyles}
        elevation={1}>
        <Toolbar>
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <MenuIcon
                onClick={() => setOpen(!open)}
                style={menuIconStyles} />
              <h4 style={headerTextStyles}>
                {Msg.HEADER_MESSAGE}
              </h4>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
