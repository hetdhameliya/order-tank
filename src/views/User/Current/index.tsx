import React, { useEffect, useState } from 'react'
import TableInfo from '../../../components/Table'
import { CurrentUserColumns } from '../../../constants/columns'
import { calculatCurrentUserHeight } from '../../../constants/extras/calculatTableHeight'
import useWindowDimensions from '../../../components/common/WindowDimensions';
import RejectInviteUserModal from '../../../components/shared/customModal/RejectInviteUserModal';
import InvateUserModal from '../../../components/shared/customModal/InvateUserModal';
import { useGetCompanyUserQuery } from '../../../api/companyUser';
import { useSelector } from 'react-redux';
import { permissionsInterface, reduxAuth } from '../../../util/interface';
import { pathOr } from 'rambda';
interface Props {
    handleCurrentUserLength: (length: number) => void;
}
const Current = ({ handleCurrentUserLength }: Props) => {

    const currentUsers = useSelector((state: reduxAuth) => state.auth.currentUser);
    const [companyPermission, setCompanyPermission] = useState<permissionsInterface>();
    const { width } = useWindowDimensions();
    const [page, setPage] = useState<number>(1);
    const [currentUser, setCurrentUser] = useState([]);

    const { data: currentUserData, isFetching: currentUserLoading } = useGetCompanyUserQuery({ currentUser: true }, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        const roleAndPermission = pathOr([], ['roleAndPermission', 'permissions'], currentUsers);
        const companyPermission = roleAndPermission?.find((ele: permissionsInterface) => ele.screenName === "user");
        setCompanyPermission(companyPermission)
    }, [currentUsers])

    useEffect(() => {
        if (!currentUserData?.result) {
            setCurrentUser([])
        } else {
            const resultData = pathOr([], ['result'], currentUserData);
            setCurrentUser(resultData);
            handleCurrentUserLength(resultData.length);
        }
    }, [currentUserData, currentUserLoading]);

    return (
        <>
            <div style={{ marginTop: "1rem" }}>
                <div style={{ marginTop: "0.5rem" }}>
                    <TableInfo
                        tableData={currentUser}
                        column={CurrentUserColumns(companyPermission, currentUsers)}
                        page={page}
                        setPage={setPage}
                        height={calculatCurrentUserHeight(width)}
                        Loader={currentUserLoading}
                        shortTypes={"ascCategory"} />
                </div>
            </div>
            <RejectInviteUserModal inviteUser={true} />
            <InvateUserModal />
        </>
    )
}

export default Current;