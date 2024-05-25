import React  from 'react';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { objectInterface } from '../../../util/interface';

export function ErrorMessage(props: objectInterface) {
  const { error } = props;
  return (
    <>
      <div style={{ color: "red", marginTop: "8px" }}>
        {error && <WarningAmberIcon style={{ fontSize: "14px" }} />}
        <span style={{ fontSize: "14px", paddingLeft: "10px" }}>
          {error && error}
        </span>
      </div>
    </>
  );
}
