import React from "react";
import "./style.scss";
import { ArrowBackIcon } from "../../../assets/Esvgs";
import { Msg } from "../../../util/massages";
import { objectInterface } from "../../../util/interface";

const HeaderTextLayout = (props: objectInterface) => {
  const {
    arrowBack,
    arrowBackClick,
    title,
    data,
    children,
    className,
    dataLength,
  } = props;

  return (
    <div
      className="card-header header__helper" style={{ alignItems: "center" }}>
      <div className={className} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: !arrowBack ? "none" : "" }}>
          <img
            src={ArrowBackIcon}
            style={{
              marginRight: "15px",
              height: "2rem",
              cursor: "pointer",
            }}
            alt={Msg.NOT_FOUND}
            onClick={arrowBackClick} />
        </div>
        <div>
          <span className="data__text">{title}</span>
          <p className="data_count" style={{ fontSize: "13px" }}>
            {dataLength > 0 && dataLength < 10 ? "0".concat(data) : data}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default HeaderTextLayout;
