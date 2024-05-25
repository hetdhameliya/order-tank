import { objectInterface } from "../../../../util/interface";

export const ReactSelectStyle = (width: string | number) => {
  return {
    placeholder: (base: objectInterface) => ({
      ...base,
      fontSize: "0.9rem",
      fontWeight: "normal",
    }),
    control: (styles: objectInterface) => ({
      ...styles,
      borderRadius: "30px",
      boxShadow: "none",
      height: "50px",
      "&:hover": {
        borderColor: "#cfd7e1",
      },
      borderColor: "#cfd7e1",
      fontSize: "1rem",
      width: width || ""
    }),
    menu: (styles: objectInterface) => ({
      ...styles,
      fontSize: "1rem",
      zIndex: 9999
    }),
    option: (provided: objectInterface, state: objectInterface) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#e5effa" : "#fff",
      color: "black",
      "&:hover": {
        backgroundColor: "#e5effa"
      }
    }),
  };
};
