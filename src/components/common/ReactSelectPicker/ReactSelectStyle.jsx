export const ReactSelectStyle = (bgColor, isMulti, SearchWithBtn, height, width) => {
    return {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected && !isMulti ? "#e5effa" : "#fff",
            color: "#000",
            paddingTop: "3px",
            "&:hover": {
                background: "#f2f5f7",
                color: "#000",
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            maxWidth: '110px',
        }),
        placeholder: (base) => ({
            ...base,
            fontSize: "0.9rem",
            fontWeight: "normal",
        }),
        control: (styles) => ({
            ...styles,
            paddingTop: "0.4rem",
            zIndex: "1",
            borderRadius: '8px',
            boxShadow: "none",
            backgroundColor: "white",
            borderColor: "#dadada",
            fontSize: "1rem",
            overflowY: "auto",
            borderRight: SearchWithBtn && "none",
            borderTopRightRadius: SearchWithBtn && "0 !important",
            borderBottomRightRadius: SearchWithBtn && "0 !important",
            height: height,
            width: width,
            "&:hover": {
                borderColor: "#dadada",
            },
        }),
        menu: (styles) => ({
            ...styles,
            fontSize: "1rem",
            zIndex: 9999,
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: 0,
        }),
        clearIndicator: (base) => ({
            ...base,
            padding: 0,
        }),
    };
};
