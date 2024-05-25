import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs, ThemeProvider, createTheme } from "@mui/material";
import MyProfile from "./MyProfile";
import { Msg } from "../../util/massages";
import CompanyDetails from "./CompanyDetails";
import { useGetCurrentUserQuery } from "../../api/auth";
import ChangePassword from "./ChangePassword";
import Address from "./Address";
import { useSelector } from "react-redux";
import { permissionsInterface, reduxAuth } from "../../util/interface";
import { pathOr } from 'rambda';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  width?: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#fc8019",
    },
  },
});

function TabPanel(props: TabPanelProps) {
  const { children, value, index, width, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: width || "80%" }}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
function Profile() {

  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const [addressPermission, setAddressPermission] = useState<permissionsInterface>();
  const { refetch } = useGetCurrentUserQuery(null);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    const roleAndPermission = pathOr([], ['roleAndPermission', 'permissions'], currentUser);
    const addressPermission = roleAndPermission?.find((ele: permissionsInterface) => ele.screenName === "address");
    setAddressPermission(addressPermission)
  }, [currentUser])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    refetch();
  }, [refetch])

  return (
    <>

      <ThemeProvider theme={theme}>
        <Box
          sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex" }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{borderRight: 1,borderColor: "divider",minWidth: "100px !important"}}>
            <Tab
              label={Msg.MY_PROFILE}
              {...a11yProps(0)}
              style={{ fontWeight: "600" }} />
            <Tab
              label={Msg.COMPANY_DETAILS}
              {...a11yProps(1)}
              style={{ fontWeight: "600" }} />
            <Tab
              label={Msg.CHANGE_PASSWORD}
              {...a11yProps(0)}
              style={{ fontWeight: "600" }} />
            {addressPermission && (!addressPermission?.isNone) && <Tab
              label={Msg.ADDRESS_LABEL}
              {...a11yProps(0)}
              style={{ fontWeight: "600" }} />}
          </Tabs>
          <TabPanel value={value} index={0}>
            <MyProfile refetch={refetch} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CompanyDetails refetch={refetch} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ChangePassword />
          </TabPanel>
          <TabPanel value={value} index={3} width="85%">
            <Address refetch={refetch} />
          </TabPanel>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default Profile;
