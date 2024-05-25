import React from "react";
import { Msg } from "../../../util/massages";
import "./style.scss";
import { web_logo } from "../../../assets/Esvgs";
import { Colors } from "../../../redux/constants/Colors";
interface AuthOnboardingScreenProps {
  imgheight?: string;
}

const AuthOnboardingScreen = ({ imgheight }: AuthOnboardingScreenProps) => {

  const webTitleStyle: React.CSSProperties = {
    color: Colors.light.white,
    marginTop: "10px",
    fontSize: "18px"
  };
  return (
    <>
      <div className="RightSide_page" >
        <div
          className="backgroundLogo"
          style={{ height: imgheight ? imgheight : "100%" }}>
          <div className="RightSide_page_content" >
            <div className="web_logo" >
              <img
                style={{ height: "4rem" }}
                src={web_logo}
                alt={Msg.NOT_FOUND} />
              <p style={webTitleStyle}>
                {Msg.COMPANY_SLOGAN} <br />
                {Msg.COMPANY_SLOGAN2}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthOnboardingScreen;
