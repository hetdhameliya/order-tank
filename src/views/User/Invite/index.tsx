import React, { useEffect, useState } from 'react'
import { actions } from '../../../redux/store/store';
import { useGetCompanyUserQuery } from '../../../api/companyUser';
import TableInfo from '../../../components/Table';
import { inviteUserColumns } from '../../../constants/columns';
import useWindowDimensions from '../../../components/common/WindowDimensions';
import { calculatInviteUserHeight } from '../../../constants/extras/calculatTableHeight';
import RejectInviteUserModal from '../../../components/shared/customModal/RejectInviteUserModal';
import { useSelector } from 'react-redux';
import ResendInviteUserModal from '../../../components/shared/customModal/ResendInviteUserModal';
import { permissionsInterface, reduxAuth } from '../../../util/interface';
import { pathOr } from 'rambda';
interface Props {
    handleInviteUserLength: (length: number) => void;
}

const Invite = ({ handleInviteUserLength }: Props) => {
    const { data: companyUserData, isFetching: companyUserLoading } = useGetCompanyUserQuery({ isRequested: true }, {
        refetchOnMountOrArgChange: true,
    });
    const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
    const [companyPermission, setCompanyPermission] = useState<permissionsInterface>();
    const [compantUser, setCompanyUser] = useState([]);
    const { width } = useWindowDimensions();
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const roleAndPermission = pathOr([], ['roleAndPermission', 'permissions'], currentUser);
        const companyPermission = roleAndPermission?.find((ele: permissionsInterface) => ele.screenName === "user");
        setCompanyPermission(companyPermission)
    }, [currentUser])

    useEffect(() => {
        if (!companyUserData?.result) {
            setCompanyUser([])
        } else {
            const resultData = pathOr([], ['result'], companyUserData);
            setCompanyUser(resultData);
            handleInviteUserLength(resultData.length);
        }
    }, [companyUserData, companyUserLoading]);

    useEffect(() => {
        actions.auth.setLoading(false);
    }, [])

    return (
        <div className='main_invite'>
            <div>
                <div style={{ marginTop: "1rem" }}>
                    <div style={{ marginTop: "0.5rem" }}>
                        <TableInfo
                            tableData={compantUser}
                            column={inviteUserColumns(companyPermission)}
                            page={page}
                            setPage={setPage}
                            height={calculatInviteUserHeight(width)}
                            Loader={companyUserLoading}
                            shortTypes={"ascCategory"} />
                    </div>
                </div>
            </div>
            <RejectInviteUserModal />
            <ResendInviteUserModal />
        </div>
    )
}
export default Invite;