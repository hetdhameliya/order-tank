import React from "react";
import ButtonComp from "../Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ErrorMessage } from "../../shared/form";
import CloseIcon from "@mui/icons-material/Close";
import { Loader } from 'rsuite';
import { objectInterface } from "../../../util/interface";

const ImagePicker = (props: objectInterface) => {
  const {
    image,
    imageInputRef,
    imgonchange,
    imageDeselectClick,
    Image_container,
    selectedImg_class,
    img_notSelected_iconClass,
    ImageUploadTitle,
    ImageUpdateTitle,
    ImageErr,
    ImgErrClassname,
    onImageClick,
    isImageUpload,
  } = props;
  return (
    <>
      <div className={Image_container}>
        <input
          hidden
          ref={imageInputRef}
          type="file"
          accept="image/png, image/jpeg"
          onChange={imgonchange} />
        <div>
          {
            isImageUpload ? (
              <Loader size="md" />
            ) : (
              image ? (
                <>
                  <div className={`d-flex ${selectedImg_class}`}>
                    <img
                      onClick={onImageClick}
                      src={image}
                      alt="Not Found..."
                      width="150px"
                      height="150px"
                      style={{ borderRadius: "50%", border: "1px solid #C0C0C0" }} />
                    <CloseIcon
                      style={{ cursor: "pointer" }}
                      onClick={imageDeselectClick}
                    />
                  </div>
                  <ButtonComp
                    variant="outlined"
                    size="small"
                    className="mt-2 me-3 mb-2"
                    btnonclick={() => imageInputRef.current.click()}
                    title={ImageUpdateTitle} />
                </>
              ) : (
                <>
                  <div
                    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <CloudUploadIcon
                      onClick={() => {
                        !image && imageInputRef.current.click();
                      }}
                      className={img_notSelected_iconClass} />
                    <ButtonComp
                      variant="outlined"
                      size="small"
                      btnonclick={() => !image && imageInputRef.current.click()}
                      title={ImageUploadTitle} />
                  </div>
                </>
              )
            )
          }
        </div>
      </div>
      {
        ImageErr && (
          <div className={ImgErrClassname}>
            <ErrorMessage error={ImageErr} />
          </div>
        )
      }
    </>
  );
}

export default ImagePicker;
