import React from "react";
import ImageUploading from "react-images-uploading";
import { Alert, Button, ButtonGroup } from "reactstrap";
import "./ImageUploader.css";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";

const ImageUploader = () => {
  const maxNumber = 10;
  const acceptType = ["jpeg", "jpg", "png"];
  const maxFileSize = 5000000;
  const [images, setImages] = React.useState([]);
  const [image, setImage] = React.useState([]);
  const productImage = [];

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
    imageList.map((data) => {
      productImage.push(data.file)
    })
    setImage(productImage)
  };
  const onError = () => {
    setImages([]);
  };

  return (
    <div className="MultipalImages">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        onError={onError}
        maxNumber={maxNumber}
        acceptType={acceptType}
        maxFileSize={maxFileSize}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
          errors,
        }) => (
          <>
            {errors && (
              <Alert color="danger text-start">
                <ul>
                  {errors.maxNumber && (
                    <li>Number of selected images must be less then {maxNumber}</li>
                  )}
                  {errors.acceptType && (
                    <li>Your selected file type is not allow</li>
                  )}
                  {errors.maxFileSize && (
                    <li>Selected file size exceed maxFileSize</li>
                  )}
                </ul>
              </Alert>
            )}

            <div className="upload__image-wrapper">
              <div
                className="upload-container"
                {...dragProps}
                onClick={onImageUpload}
                style={
                  isDragging
                    ? { backgroundColor: "#afafaf", color: "white" }
                    : undefined
                }
              >
                Choose a file or Drag it here
              </div>

              <div className="ImagesDisplay" style={{ textAlign: "left" }}>
                <div className="image-grid">
                  {imageList.map((image, index) => (
                    <div
                      key={index}
                      className="image-item  "
                      style={{
                        width: "150px",
                        marginRight: "10px",
                        display: "inline-block",
                      }}
                    >
                      <img
                        src={image["data_url"]}
                        alt=""
                        style={{ width: "100%" }}
                      />
                      <div className="image-item__btn-wrapper mt-1">
                        <ButtonGroup size="sm" style={{ width: "100%" }}>
                          <Button
                            className="update"
                            color="primary"
                            onClick={() => onImageUpdate(index)}
                          >
                            <RateReviewOutlinedIcon />
                          </Button>
                          <Button
                            className="delete"
                            color="danger"
                            onClick={() => onImageRemove(index)}
                          >
                            <DeleteOutlinedIcon />
                          </Button>
                        </ButtonGroup>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {images.length > 0 && (
                <>
                  <div className="text-start delete-all p-2">
                    <Button
                      className="delete"
                      onClick={onImageRemoveAll}
                      color="danger"
                    >
                      Remove All Images
                    </Button>
                  </div>
                  <pre className="text-start" id="jsonprint"></pre>
                </>
              )}
            </div>
          </>
        )}
      </ImageUploading>
    </div>
  );
};

export default ImageUploader;
