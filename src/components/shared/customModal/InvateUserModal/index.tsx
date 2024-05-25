import React from 'react';
import { Box, Modal, Radio } from '@mui/material'
import { useSelector } from 'react-redux'
import { Colors } from '../../../../redux/constants/Colors'
import { useEffect, useState } from 'react'
import "./style.scss"
import ButtonComp from '../../../common/Button'
import { actions } from '../../../../redux/store/store'
import { useSendInvitationMutation, useUpdateCompanyUserMutation } from '../../../../api/companyUser'
import { toast } from 'react-toastify'
import { Msg } from '../../../../util/massages'
import { apiDataInterface, objectInterface, reduxModal } from '../../../../util/interface';
import { map } from 'rambda';
export interface permissionsInterface {
    id?: number | string;
    isAdd?: boolean;
    isDelete?: boolean;
    isNone?: boolean;
    isRead?: boolean;
    isUpdate?: boolean;
    screenName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InvateUserModal = ({ handleresetForm }: any) => {
    const InvateUser = useSelector((state: reduxModal) => state.modal.InvateUser);
    const [SendInvitation] = useSendInvitationMutation();
    const [EditCompanyUser] = useUpdateCompanyUserMutation();
    const screens = ["dashboard", "category", "product", "user", "buyer", "order", "address"];
    const [permissions, setPermissions] = useState<permissionsInterface[]>([]);
    const [allNone, setAllNone] = useState<permissionsInterface[]>([]);

    useEffect(() => {
        if (InvateUser?.id?.id) {
            setPermissions(InvateUser?.id?.role?.permissions)
        } else {
            setPermissions([])
        }
    }, [InvateUser])

    const handleRadioChange = (screen: string, permission: string[]) => {
        let updatedPermision: permissionsInterface[] = [...permissions];
        const findpermision = permissions?.find((permission: objectInterface) => permission.screenName.trim() === screen.trim())
        if (!findpermision) {
            updatedPermision.push({
                screenName: screen,
                isAdd: permission.includes("isAdd") || permission.includes("isAdmin"),
                isUpdate: permission.includes("isUpdate") || permission.includes("isAdmin"),
                isDelete: permission.includes("isDelete") || permission.includes("isAdmin"),
                isRead: permission.includes("isRead") || permission.includes("isAdmin"),
                isNone: permission.includes("isNone") || permission.includes("isNone")
            })
        } else {
            updatedPermision = permissions.filter((permission: objectInterface) => permission.screenName.trim() !== screen.trim())
            updatedPermision.push({
                screenName: screen,
                isAdd: permission.includes("isAdd") || permission.includes("isAdmin"),
                isUpdate: permission.includes("isUpdate") || permission.includes("isAdmin"),
                isDelete: permission.includes("isDelete") || permission.includes("isAdmin"),
                isRead: permission.includes("isRead") || permission.includes("isAdmin"),
                isNone: permission.includes("isNone") || permission.includes("isNone")
            })
        }
        setPermissions(updatedPermision)
    };

    const handleClose = () => {
        actions.modal.closeInvateUserModal(null);
    };

    useEffect(() => {
        const isNonFalseArray = permissions.filter((permission: objectInterface) => permission.isNone !== true);
        setAllNone(isNonFalseArray)
    }, [permissions])


    const SendInvitations = async () => {
        if (InvateUser?.id?.id) {
            const body = {
                id: InvateUser?.id?.id,
                body: {
                    role: {
                        permissions: permissions.map((permission: objectInterface) => ({
                            isAdd: permission.isAdd,
                            isDelete: permission.isDelete,
                            isRead: permission.isRead,
                            isUpdate: permission.isUpdate,
                            isNone: permission.isNone,
                            screenName: permission.screenName
                        }))
                    }
                }
            }
            actions.auth.setLoading(true);
            const result: apiDataInterface = await EditCompanyUser(body);
            const error = result?.error?.data?.message
            actions.auth.setLoading(true);
            if (result?.data?.statusCode === 200) {
                handleresetForm(true)
                handleClose();
                toast.success(result?.data?.message);

            } else {
                toast.error(result?.data?.message || error);
            }
            actions.auth.setLoading(false);
        } else {
            const body = {
                email: InvateUser?.id,
                role: {
                    permissions: permissions,
                }
            }
            actions.auth.setLoading(true);
            const result: apiDataInterface = await SendInvitation(body);
            const error = result?.error?.data?.message
            actions.auth.setLoading(true);
            if (result?.data?.statusCode === 200) {
                handleresetForm(true)
                handleClose();
                toast.success(result?.data?.message);

            } else {
                toast.error(result?.data?.message || error);
            }
            actions.auth.setLoading(false);
        }
    }

    const buttonCompSendStyle: React.CSSProperties = {
        textTransform: "capitalize",
        color: Colors.light.white,
        border: "1px solid",
        backgroundColor: permissions.length === 0 || allNone.length === 0 || permissions.length !== screens.length ? "#EAEAEB" : "#fc8019",
        marginLeft: "10px",
        width: "100px"
    };

    return (
        <>
            <Modal
                className='invate_modal'
                open={InvateUser?.open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description" >
                <Box
                    sx={boxStyle}>
                    <span className='table_heading'>{InvateUser?.id?.id ? "Edit the permission" : "Give the permission"}</span>
                    <table style={{ borderCollapse: 'collapse', border: '0.5px solid gray', borderRadius: "5px", marginTop: "0.7rem" }}>
                        <thead className='table_head' style={{ borderRadius: "20px" }} >
                            <tr >
                                <th className='table_heading' >
                                    <span className='table_div_heading'>{Msg.SCEEN_NAME_HEADING}</span>
                                </th>
                                <th className='table_heading'>
                                    <span className='table_div_heading'>{Msg.NONE_HEADING}</span>
                                </th>
                                <th className='table_heading'>
                                    <span className='table_div_heading'>{Msg.VIEW_HEADING}</span>
                                </th>
                                <th className='table_heading'>
                                    <span className='table_div_heading'>{Msg.VIEW_ADD_HEADING}</span>
                                </th>
                                <th className='table_heading' style={{ width: "15rem" }}>
                                    <span className='table_div_heading'>{Msg.VIEW_ADD_EDIT}</span>
                                </th>
                                <th className='table_heading'>
                                    <span className='table_div_heading'>{Msg.ADMIN_HEADING}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {map(screen => (
                                <tr key={screen}>
                                    <td className='table_first_column table_row' >
                                        <div className='table_div_row'>
                                            {screen}
                                        </div>
                                    </td>
                                    <td className='table_row'>
                                        <div className='table_div_row'>
                                            <Radio
                                                style={{ fontSize: "20px" }}
                                                name={screen}
                                                value="isNone"
                                                checked={permissions?.find((permission: permissionsInterface) => permission?.screenName === screen && permission?.isNone && !permission?.isRead && !permission?.isAdd && !permission?.isUpdate && !permission?.isDelete) ? true : false}
                                                onChange={() => handleRadioChange(screen, ["isNone"])} />
                                        </div>
                                    </td>
                                    <td className='table_row'>
                                        <div className='table_div_row'>
                                            <Radio
                                                style={{ fontSize: "20px" }}
                                                name={screen}
                                                value="isRead"
                                                checked={permissions?.find((permission: permissionsInterface) => permission?.screenName === screen && permission?.isRead && !permission?.isAdd && !permission?.isUpdate && !permission?.isDelete) ? true : false}
                                                onChange={() => handleRadioChange(screen, ["isRead"])} />
                                        </div>
                                    </td>
                                    <td className='table_row'>
                                        <div className='table_div_row'>
                                            <Radio
                                                name={screen}
                                                value="view_edit"
                                                checked={permissions?.find((permission: permissionsInterface) => permission?.screenName === screen && permission?.isRead && permission?.isAdd && !permission?.isUpdate && !permission?.isDelete) ? true : false}
                                                onChange={() => handleRadioChange(screen, ["isRead", "isAdd"])} />
                                        </div>
                                    </td>
                                    <td className='table_row'>
                                        <div className='table_div_row'>
                                            <Radio
                                                name={screen}
                                                value="view_add_edit"
                                                checked={permissions?.find((permission: permissionsInterface) => permission?.screenName === screen && permission?.isRead && permission?.isAdd && permission?.isUpdate && !permission?.isDelete) ? true : false}
                                                onChange={() => handleRadioChange(screen, ["isRead", "isAdd", "isUpdate"])} />
                                        </div>
                                    </td>
                                    <td className='table_row'>
                                        <div className='table_div_row'>
                                            <Radio
                                                name={screen}
                                                value="admin"
                                                checked={permissions?.find((permission: permissionsInterface) => permission?.screenName === screen && permission?.isRead && permission?.isAdd && permission?.isUpdate && permission?.isDelete) ? true : false}
                                                onChange={() => handleRadioChange(screen, ['isAdmin'])} />
                                        </div>
                                    </td>
                                </tr>
                            ), screens)}
                        </tbody>
                    </table>

                    <div className='modal_buttons'>
                        <ButtonComp
                            btnstyle={buttonCompCancelStyle}
                            title={Msg.CANCEL}
                            btnonclick={handleClose} />
                        <ButtonComp
                            btnstyle={buttonCompSendStyle}
                            isDisabled={permissions.length === 0 || allNone.length === 0 || permissions.length !== screens.length ? true : false}
                            title={InvateUser?.id?.id ? Msg.EDIT : Msg.DONE}
                            btnonclick={SendInvitations} />
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default InvateUserModal;

const boxStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: Colors.light.white,
    boxShadow: "24",
    borderRadius: "14px",
    padding: "1rem 2rem"
}

const buttonCompCancelStyle: React.CSSProperties = {
    textTransform: "capitalize",
    color: Colors.dark.black,
    border: "1px solid #808080",
    backgroundColor: Colors.light.white,
    width: "100px"
};