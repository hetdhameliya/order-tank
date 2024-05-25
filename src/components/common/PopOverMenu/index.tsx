/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Dropdown, Popover } from 'rsuite';
import { Msg } from '../../../util/massages';
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import VisibleIcon from "@rsuite/icons/Visible";
import BlockIcon from '@rsuite/icons/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// eslint-disable-next-line @typescript-eslint/ban-types
const PopOverMenu = (props: any, ref: any, onSelect: Function, item: any, elem: any, permission?: any, module?: any) => {
  const { onClose, left, top, className } = props;
  return (
    <>
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={(e: any) => {
          onSelect(e, item);
          onClose();
        }}>
          {(elem?.edit && (permission?.isUpdate && (module === "product" || module === "buyer"))) && <Dropdown.Item eventKey={Msg.EDIT} className="d-flex align-items-center gap-1" >
            <EditIcon style={{ fontSize: "18px", width: "18px" }} />{Msg.EDIT_UPPERCASE}
          </Dropdown.Item>}
          {(elem?.delete && (permission?.isDelete && (module === "product" || module === "buyer"))) && <Dropdown.Item eventKey={Msg.DELETE} className="d-flex align-items-center gap-1">
            <TrashIcon style={{ fontSize: "18px", width: "18px" }} />{Msg.DELETE_UPPERCASE}
          </Dropdown.Item>}
          {elem?.view && <Dropdown.Item eventKey={Msg.VIEW} className="d-flex align-items-center gap-1">
            <VisibleIcon style={{ fontSize: "18px", width: "18px" }} />{Msg.VIEW_UPPERCASE}
          </Dropdown.Item>}
          {(elem?.block && (permission?.isUpdate && module === "buyer")) && <Dropdown.Item eventKey={Msg.INACTIVE} className="d-flex align-items-center gap-1">
            <BlockIcon style={{ fontSize: "16px", width: "16px" }} />{Msg.INACTIVE_UPPERCASE}
          </Dropdown.Item>}
          {(elem?.accepted && (permission?.isUpdate && module === "buyer")) && <Dropdown.Item eventKey={Msg.ACTIVE} className="d-flex align-items-center gap-2">
            <CheckCircleOutlineIcon style={{ fontSize: "20px", width: "20px" }} />{Msg.ACTIVE_UPPERCASE}
          </Dropdown.Item>}
        </Dropdown.Menu>
      </Popover>
    </>
  )
}

export default PopOverMenu
