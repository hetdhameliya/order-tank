/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const app_logo: string = require("../svg/app_logo.svg").default;
const web_logo: string = require("../svg/web_logo.svg").default;
const email_unveified: string = require("../svg/email_unveified.svg").default;
const CheckIcon: string = require("../svg/CheckIcon.svg").default;
const CloseIcon: string = require("../svg/CloseIcon.svg").default;
const ArrowBackIcon: string = require("../svg/ArrowBack.svg").default;
const overviewIcon: string = require("../svg/overviewIcon.svg").default;
const logo_with_text: string = require("../svg/logo_with_text.svg").default;
const logo: string = require("../svg/logo.svg").default;
const Company_logo: string = require("../svg/Company_logo.svg").default;
const UserProfileImg: string = require("../images/UserProfileImg.png");
const DefaultProductImg: string = require("../images/product.png");
const BuyerImg: string = require("../images/Buyer.png");
const CompanyLogoImg: string = require("../images/Company.png");

const categoryCsv: any = require("../csvfile/category.csv");
const ProductCsv: any = require("../csvfile/product.csv");

export {
  web_logo,
  app_logo,
  email_unveified,
  CheckIcon,
  CloseIcon,
  ArrowBackIcon,
  overviewIcon,
  UserProfileImg,
  logo_with_text,
  logo,
  Company_logo,
  DefaultProductImg,
  categoryCsv,
  ProductCsv,
  BuyerImg,
  CompanyLogoImg
};
