import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import styles from "./ImagePreviewModal.module.scss";

type ModalProps = {
  fileName: string;
  imageSrc: any;
  uploadedFromComputer?: boolean;
  contentType: string;
  onCloseClick: () => void;
};

const ImagePreviewModal = ({
  fileName,
  imageSrc,
  uploadedFromComputer = false,
  contentType,
  onCloseClick,
}: ModalProps): JSX.Element => {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (imageSrc && imageSrc.data && imageSrc.data instanceof Array) {
      const uint8Array = new Uint8Array(imageSrc.data);
      const blob = new Blob([uint8Array], { type: contentType });
      const dataURL = URL.createObjectURL(blob);
      setImageUrl(dataURL);
    }
  }, [imageSrc, contentType]);
  return (
    <Modal divId="fullscreenModal">
      <div className={styles.imagePreviewContainer}>
        {imageSrc !== "" ? (
          <img
            src={
              uploadedFromComputer ? URL.createObjectURL(imageSrc) : imageUrl
            }
            alt="Image Preview"
          />
        ) : (
          <h5
            style={{
              color: "red",
              display: "flex",
              justifyContent: "center",
              marginTop: "40vh",
            }}
          >
            Image preview is not available
          </h5>
        )}
        <Button
          id="closePreviewModal"
          styleClass={styles.closePreviewModal}
          onClick={onCloseClick}
        />
      </div>
    </Modal>
  );
};

export default ImagePreviewModal;
