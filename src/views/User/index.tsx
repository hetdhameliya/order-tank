import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Tab, Tabs, ThemeProvider, createTheme } from "@mui/material";
import { Msg } from "../../util/massages";
import { useGetCurrentUserQuery } from "../../api/auth";
import Invite from "./Invite";
import Current from "./Current";
import { useFormik } from "formik";
import * as Yup from "yup";
import { actions } from "../../redux/store/store";
import Regex from "../../util/regex";
import { Form } from "rsuite";
import InputField from "../../components/common/TextField/InputField";
import ButtonComp from "../../components/common/Button";
import { ErrorMessage } from "../../components/shared/form";
import { useSelector } from "react-redux";
import InvateUserModal from "../../components/shared/customModal/InvateUserModal";
import "./style.scss"
import { useCheckUserMutation } from "../../api/companyUser";
import { toast } from "react-toastify";
import { apiDataInterface, permissionsInterface, reduxAuth } from "../../util/interface";
import { pathOr } from 'rambda';

const theme = createTheme({
    palette: {
        primary: {
            main: "#fc8019",
        },
    },
});

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface invite {
    email: string
}

const User = () => {
    const currentUsers = useSelector((state: reduxAuth) => state.auth.currentUser);
    const [companyPermission, setCompanyPermission] = useState<permissionsInterface>();
    const [checkUser, { isLoading }] = useCheckUserMutation();
    const [inviteUser, setInviteUser] = useState<number>();
    const [currentUser, setCurrentUser] = useState<number>();
    const [resetForm, setResetForm] = useState<boolean>();
    const { refetch } = useGetCurrentUserQuery(null);
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        const roleAndPermission = pathOr([], ['roleAndPermission', 'permissions'], currentUsers);
        const companyPermission = roleAndPermission?.find((ele: permissionsInterface) => ele.screenName === "user");
        setCompanyPermission(companyPermission)
    }, [currentUsers])

    useEffect(() => {
        formik.resetForm();
    }, [resetForm])

    useEffect(() => {
        refetch();
    }, [refetch])

    const handleInviteUserLength = (data: number) => {
        setInviteUser(data);
    };

    const handleCurrentUserLength = (data: number) => {
        setCurrentUser(data);
    };

    const handleresetForm = (data: boolean) => {
        setResetForm(data);
    };


    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required(Msg.EMAIL)
                .matches(Regex.VALID_MAIL, Msg.INVALID_EMAIL).trim(),
        }),
        onSubmit: async (values: invite) => {
            if (values?.email) {
                const body = {
                    email: values?.email
                }
                const result: apiDataInterface = await checkUser(body);
                const error = result?.error?.data?.message
                if (result?.data?.statusCode === 200) {
                    actions.modal.openInvateUserModal(values?.email)

                } else {
                    toast.error(result?.data?.message || error);
                }
            }
        }
    });

    return (
        <>
            <Form
                onSubmit={() => {
                    formik.handleSubmit()
                }}
                fluid>
                <div className="user_main_div">
                    <div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {companyPermission?.isAdd && <div style={{ display: "flex", alignItems: "center" }}>
                                <div className="user_invite_div">
                                    <span className="user_invite_title">
                                        {Msg.ENTER_EMAIL_TITLE}
                                    </span>
                                    <InputField
                                        outline={true}
                                        borderColor={true}
                                        inputname="email"
                                        inputvalue={formik.values.email}
                                        inputonchange={(value: string) =>
                                            formik.setFieldValue("email", value)
                                        }
                                        onblur={formik.handleBlur}
                                        height="45px"
                                        width="20rem"
                                        borderRadius="12px 0px 0px 12px" />
                                </div>
                                <div style={{ marginTop: "-0.5rem" }}>
                                    <ButtonComp
                                        isDisabled={isLoading}
                                        endIcon={isLoading && <CircularProgress size={20} style={{ color: "white" }} />}
                                        type="submit"
                                        className="invate_btn"
                                        title={Msg.SEND_INVITE_BTN}
                                        size="large" />
                                </div>
                            </div>}
                            <div style={{ marginLeft: "256px", marginTop: "-7px" }}>
                                {formik.touched.email &&
                                    formik.errors.email &&
                                    formik.errors.email &&
                                    <ErrorMessage error={formik.errors.email} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Form>

            <ThemeProvider theme={theme}>
                <Box sx={{ width: '100%', marginTop: "0.5rem" }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab
                                label={`${Msg.INVITE_USER_TITEL} ${value === 0
                                    ? `(${inviteUser !== undefined && inviteUser < 10 ? `0${inviteUser}` : inviteUser || 0})`
                                    : ''
                                    }`}
                                {...a11yProps(0)}
                                style={{ fontWeight: '600' }} />
                            <Tab
                                label={`${Msg.CURRENT_USER_TITEL} ${value === 1
                                    ? `(${currentUser !== undefined && currentUser < 10 ? `0${currentUser}` : currentUser || 0})`
                                    : ''
                                    }`}
                                {...a11yProps(1)}
                                style={{ fontWeight: '600' }} />

                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0} >
                        <Invite handleInviteUserLength={handleInviteUserLength} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Current handleCurrentUserLength={handleCurrentUserLength} />
                    </TabPanel>
                </Box>
            </ThemeProvider>
            {!formik.errors.email && <InvateUserModal handleresetForm={handleresetForm} />}
        </>
    );
}

export default User;
