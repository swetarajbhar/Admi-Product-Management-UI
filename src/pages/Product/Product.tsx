import { useEffect, useState } from "react";
import { ReactComponent as UploadIcon } from "../../assets/SVG/uploadIcon.svg";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Button from "../../components/Button/Button";
import Entry from "../../components/Entry/Entry";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import ImagePreviewModal from "../../components/ImagePreviewModal/ImagePreviewModal";
import CONSTANTS from "../../constants/constants";
import TStandardObject from "../../types/StandardObject";
import isEmpty from "../../utils/isEmpty";
import styles from "./Product.module.scss";
import MessagePopup from "../../components/MessagePopup/MessagePopup";
import {
  productList,
  deleteProductRecord,
  findProductById,
  saveProductData,
  updateProductData,
} from "../../api/product";

const Product = (): JSX.Element => {
  const [data, setData] = useState<Array<TStandardObject>>([]);
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [action, setAction] = useState("");
  const [modal, setModal] = useState({ show: false });
  const [totalCount, setTotalCount] = useState(0);
  const [currentID, setCurrentID] = useState<string | number>("");
  const [renderDeleteBox, setRenderDeleteBox] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [startImagePreviewModal, setStartImagePreviewModal] = useState(false);
  const [midImagePreviewModal, setMidImagePreviewModal] = useState(false);
  const [endImagePreviewModal, setEndImagePreviewModal] = useState(false);

  const [startImage, setStartImage] = useState<TStandardObject>({
    fileName: "",
    file: "",
    newFileUploaded: true,
    uploadedFromComputer: true,
    contentType: "",
  });

  const [midImage, setMidImage] = useState<TStandardObject>({
    fileName: "",
    file: "",
    newFileUploaded: true,
    uploadedFromComputer: true,
    contentType: "",
  });

  const [endImage, setEndImage] = useState<TStandardObject>({
    fileName: "",
    file: "",
    newFileUploaded: true,
    uploadedFromComputer: true,
    contentType: "",
  });

  const [error, setError] = useState({
    name: false,
    price: false,
    duplicateProduct: false,
    startImage: false,
    fileType1: false,
    midImage: false,
    fileType2: false,
    endImage: false,
    fileType3: false,
  });
  const [popupMessage, setPopupMessage] = useState({
    show: false,
    msg: "",
  });

  const limit = 10;

  const onStartImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png")
    ) {
      setStartImage({
        fileName: file.name,
        file: file,
        newFileUploaded: true,
        uploadedFromComputer: true,
        contentType: file.type,
      });
      setError({
        ...error,
        startImage: false,
        fileType1: false,
      });
    } else {
      setError({ ...error, fileType1: true });
    }
  };

  const onMidImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png")
    ) {
      setMidImage({
        fileName: file.name,
        file: file,
        newFileUploaded: true,
        uploadedFromComputer: true,
        contentType: file.type,
      });
      setError({
        ...error,
        midImage: false,
        fileType2: false,
      });
    } else {
      setError({ ...error, fileType2: true });
    }
  };

  const onEndImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png")
    ) {
      setEndImage({
        fileName: file.name,
        file: file,
        newFileUploaded: true,
        uploadedFromComputer: true,
        contentType: file.type,
      });
      setError({
        ...error,
        endImage: false,
        fileType3: false,
      });
    } else {
      setError({ ...error, fileType3: true });
    }
  };

  const addProduct = () => {
    setModal({ show: true });
    setAction(CONSTANTS.ACTION.ADD);
  };

  const onName = (e: any) => {
    setName(e.target.value);
    setError({
      ...error,
      name: isEmpty(e.target.value),
    });
  };

  const onPrice = (e: any) => {
    setPrice(e.target.value);
    setError({
      ...error,
      price: isEmpty(e.target.value),
    });
  };

  const isValidPrice = () => {
    return price !== "";
  };

  const isValid = () => {
    if (
      !isEmpty(name) &&
      !isEmpty(startImage.fileName) &&
      !isEmpty(midImage.fileName) &&
      !isEmpty(endImage.fileName) &&
      !isEmpty(price)
    )
      return true;
    return false;
  };

  const onSave = async () => {
    if (isValid()) {
      const formData = new FormData();
      formData.append("productName", name);
      formData.append("price", price);
      if (startImage.file) {
        formData.append("images", startImage.file);
      }
      if (midImage.file) {
        formData.append("images", midImage.file);
      }
      if (endImage.file) {
        formData.append("images", endImage.file);
      }

      const productParam: TStandardObject = {};
      if (action === CONSTANTS.ACTION.EDIT) {
        productParam.sku = sku.toString();
        const response = await updateProductData(formData, productParam);
        if (response.status === 200) {
          setModal({ show: false });
          setSku("");
          setName("");
          setPrice("");
          setStartImage({
            fileName: "",
            file: "",
            newFileUploaded: false,
            uploadedFromComputer: true,
            contentType: "",
          });
          setMidImage({
            fileName: "",
            file: "",
            newFileUploaded: false,
            uploadedFromComputer: true,
            contentType: "",
          });
          setEndImage({
            fileName: "",
            file: "",
            newFileUploaded: false,
            uploadedFromComputer: true,
            contentType: "",
          });
          setLoading(false);
        } else if (response.status === 409) {
          setError({
            ...error,
            duplicateProduct: true,
          });
          setLoading(false);
        } else {
          setPopupMessage({
            show: true,
            msg: "Some Error Occured Please Try Again Later!",
          });
          setLoading(false);
        }
      }
      if (action === CONSTANTS.ACTION.ADD) {
        const response = await saveProductData(formData);
        if (response.status === 200) {
          setModal({ show: false });
          setSku("");
          setName("");
          setPrice("");
          setStartImage({
            fileName: "",
            file: "",
            newFileUploaded: false,
            uploadedFromComputer: true,
            contentType: "",
          });
          setMidImage({
            fileName: "",
            file: "",
            newFileUploaded: false,
            uploadedFromComputer: true,
            contentType: "",
          });
          setEndImage({
            fileName: "",
            file: "",
            newFileUploaded: false,
            uploadedFromComputer: true,
            contentType: "",
          });
          setLoading(false);
        } else if (response.status === 409) {
          setError({
            ...error,
            duplicateProduct: true,
          });
          setLoading(false);
        } else {
          setPopupMessage({
            show: true,
            msg: "Some Error Occured Please Try Again Later!",
          });
          setLoading(false);
        }
      }
    } else {
      setError({
        name: isEmpty(name),
        price: !isValidPrice(),
        duplicateProduct: false,
        startImage: isEmpty(startImage.fileName),
        fileType1: false,
        midImage: isEmpty(midImage.fileName),
        fileType2: false,
        endImage: isEmpty(endImage.fileName),
        fileType3: false,
      });
      setLoading(false);
    }
  };

  const onCancel = () => {
    setModal({ show: false });
    setSku("");
    setName("");
    setPrice("");
    setStartImage({
      fileName: "",
      file: "",
      newFileUploaded: false,
      uploadedFromComputer: true,
      contentType: "",
    });
    setMidImage({
      fileName: "",
      file: "",
      newFileUploaded: false,
      uploadedFromComputer: true,
      contentType: "",
    });
    setEndImage({
      fileName: "",
      file: "",
      newFileUploaded: false,
      uploadedFromComputer: true,
      contentType: "",
    });
    setLoading(false);
    setError({
      name: false,
      duplicateProduct: false,
      price: false,
      startImage: false,
      fileType1: false,
      midImage: false,
      fileType2: false,
      endImage: false,
      fileType3: false,
    });
  };

  const showStartModal = () => {
    setStartImagePreviewModal((modalState) => !modalState);
  };

  const renderNameField = () => {
    return (
      <div>
        <Entry
          id="Name"
          type="text"
          styleClass={styles.inputStyle}
          placeholder="Name"
          value={name}
          onChange={onName}
        />
        {error.name && (
          <small className={styles.error}>Please enter product name</small>
        )}
      </div>
    );
  };

  const renderPriceField = () => {
    return (
      <div>
        <Entry
          id="price"
          type="number"
          styleClass={styles.inputStyle}
          placeholder="Price"
          value={price}
          onChange={onPrice}
          onInput={(e) => (e.target.value = e.target.value.slice(0, 10))}
        />
        {error.price && (
          <small className={styles.error}>Please enter valid price</small>
        )}
      </div>
    );
  };

  const renderAddModal = () => {
    return (
      <Modal divId="fullscreenModal">
        <div className={styles.modalContainer}>
          <div className={styles.headingStyle}>Add New Product</div>
          <div className={styles.rows}>
            {renderNameField()}
            {renderPriceField()}
          </div>
          <div className={styles.rows}>
            <div className={styles.startImage}>
              <label>Upload Image 1</label>
              <br />
              <div className={styles.uploadFileWrapper}>
                <input
                  className={styles.fileName}
                  value={startImage.fileName}
                  disabled
                />
                <label className={styles.upload}>
                  <input
                    type="file"
                    onChange={(e) => onStartImageChange(e)}
                    accept="image/*"
                  />
                  <UploadIcon />
                </label>
                <Button
                  id="preview"
                  buttonType="secondary"
                  styleClass={styles.previewBtnStyle}
                  onClick={showStartModal}
                >
                  {" "}
                  Preview
                </Button>
              </div>
              {error.startImage && (
                <small className={styles.error}>Please select a file</small>
              )}
              {error.fileType1 && (
                <small className={styles.error}>
                  Please select valid image file
                </small>
              )}
            </div>
            <div className={styles.midImage}>
              <label>Upload Image 2</label>
              <br />
              <div className={styles.uploadFileWrapper}>
                <input
                  className={styles.fileName}
                  value={midImage.fileName}
                  disabled
                />
                <label className={styles.upload}>
                  <input
                    type="file"
                    onChange={(e) => onMidImageChange(e)}
                    accept="image/*"
                  />
                  <UploadIcon />
                </label>
                <Button
                  id="preview"
                  buttonType="secondary"
                  styleClass={styles.previewBtnStyle}
                  onClick={() => setMidImagePreviewModal((state) => !state)}
                >
                  {" "}
                  Preview
                </Button>
              </div>
              {error.midImage && (
                <small className={styles.error}>Please select a file</small>
              )}
              {error.fileType2 && (
                <small className={styles.error}>
                  Please select valid image file
                </small>
              )}
            </div>
          </div>
          <div className={styles.rows}>
            <div className={styles.endImage}>
              <label>Upload Image 3</label>
              <br />
              <div className={styles.uploadFileWrapper}>
                <input
                  className={styles.fileName}
                  value={endImage.fileName}
                  disabled
                />
                <label className={styles.upload}>
                  <input
                    type="file"
                    onChange={(e) => onEndImageChange(e)}
                    accept="image/*"
                  />
                  <UploadIcon />
                </label>
                <Button
                  id="preview"
                  buttonType="secondary"
                  styleClass={styles.previewBtnStyle}
                  onClick={() => setEndImagePreviewModal((state) => !state)}
                >
                  {" "}
                  Preview
                </Button>
              </div>
              {error.endImage && (
                <small className={styles.error}>Please select a file</small>
              )}
              {error.fileType3 && (
                <small className={styles.error}>
                  Please select valid image file
                </small>
              )}
            </div>
            <div></div>
          </div>
          <div className={styles.rows}>
            <div id="buttonWrapper">
              <Button
                id="save"
                buttonType="primary"
                styleClass={styles.modalButtonStyle}
                disabled={loading}
                onClick={onSave}
                showLoader={loading}
              >
                {" "}
                Save
              </Button>
              <Button
                id="cancel"
                buttonType="secondary"
                styleClass={styles.modalButtonStyle}
                onClick={onCancel}
              >
                {" "}
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const headers = [
    "Sr No",
    "Product SKU",
    "Product Name",
    "Product Price",
    "Created By",
  ];

  async function onActionClick(actionType: string, index: any) {
    const sku = index;
    if (sku && sku !== "-") {
      if (actionType === CONSTANTS.ACTION.EDIT) {
        setAction(CONSTANTS.ACTION.EDIT);
        const response = await findProductById(sku);
        if (response.status === 200) {
          setSku(sku);
          setModal({ show: true });
          setName(response.data?.productName || "");
          setPrice(response.data?.price || "");
          setStartImage({
            fileName: response.data?.images[0]?.originalName || "",
            file: response.data?.images[0]?.buffer || "",
            newFileUploaded: false,
            uploadedFromComputer: false,
            contentType: response.data?.images[0]?.contentType || "",
          });
          setMidImage({
            fileName: response.data?.images[1]?.originalName || "",
            file: response.data?.images[1]?.buffer || "",
            newFileUploaded: false,
            uploadedFromComputer: false,
            contentType: response.data?.images[1]?.contentType || "",
          });
          setEndImage({
            fileName: response.data?.images[2]?.originalName || "",
            file: response.data?.images[2]?.buffer || "",
            newFileUploaded: false,
            uploadedFromComputer: false,
            contentType: response.data?.images[2]?.contentType || "",
          });
        } else {
          setSku("");
          setModal({ show: false });
        }
      }
      if (actionType === CONSTANTS.ACTION.DELETE) {
        setCurrentID(sku);
        setRenderDeleteBox(true);
      }
    }
  }

  const onMenuClick = (value: string) => {
    setSearch(value);
  };

  const onPaginatonClick = (currentPage: any) => {
    setCurrentPage(currentPage);
    setOffset((currentPage - 1) * limit);
  };

  const onSearch = (value: string) => {
    setOffset(0);
    setCurrentPage(1);
    setSearch(value);
  };

  const getProductList = async () => {
    const params = {
      limit,
      offset,
      searchTerm: search,
    };
    const response = await productList(params);
    if (response.status === 200) {
      const formatedData: Array<{
        [key: string]: string | number | undefined | null;
      }> = [];
      const data = response?.data ?? [];
      data.forEach((data: any, index: number) => {
        formatedData.push({
          srNo: index + 1 + offset,
          sku: data.sku || "-",
          productName: data.productName || "-",
          price: data.price || "-",
          createdBy: data.created_name || "-",
        });
      });

      setTotalCount(response?.totalRecord);
      setData(formatedData);
    } else {
      setTotalCount(0);
      setData([]);
    }
  };

  useEffect(() => {
    getProductList();
  }, []);

  useEffect(() => {
    if (modal.show === false) {
      getProductList();
    }
  }, [modal.show, search, offset, renderDeleteBox]);

  const startPreview = () => {
    return (
      <ImagePreviewModal
        uploadedFromComputer={startImage.uploadedFromComputer}
        fileName={startImage.fileName}
        imageSrc={startImage.file || ""}
        contentType={startImage.contentType || ""}
        onCloseClick={() =>
          setStartImagePreviewModal((modalState) => !modalState)
        }
      />
    );
  };

  const onDelete = async () => {
    if (currentID) {
      const response = await deleteProductRecord(currentID);
      if (response.status === 200) {
        setRenderDeleteBox(false);
      }
    }
  };

  const onDeleteCancel = () => {
    setRenderDeleteBox(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <Breadcrumb />
          <div className={styles.rightContainer}>
            <Entry
              id="search"
              styleClass={styles.searchBar}
              value={search}
              onChange={(e) => {
                onSearch(e.target.value);
              }}
            />

            <Button
              buttonType="primary"
              styleClass={styles.addProductButton}
              id={"addnewproduct"}
              onClick={addProduct}
            >
              Add New Product
            </Button>
          </div>
        </div>
        <Table
          headerData={headers}
          data={data}
          limit={limit}
          onActionClick={onActionClick}
          onMenuClick={onMenuClick}
          onPaginatonClick={onPaginatonClick}
          paginationButtonNo={3}
          showActionColumn
          showPagination
          currentPage={currentPage}
          showViewAction={false}
          totalRecords={totalCount}
          showStatusMenu={false}
        />
      </div>
      {modal.show && renderAddModal()}

      {renderDeleteBox && (
        <Modal divId={"fullscreenModal"}>
          <div className={styles.deleteContainer}>
            <h4>Are you sure you want to delete this product?</h4>
            <div className="split">
              <Button
                id={styles.delete}
                buttonType={"primary"}
                onClick={onDelete}
              >
                Yes
              </Button>
              <Button
                id={styles.cancelDelete}
                buttonType={"secondary"}
                onClick={onDeleteCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {startImagePreviewModal && startPreview()}
      {midImagePreviewModal && (
        <ImagePreviewModal
          uploadedFromComputer={midImage.uploadedFromComputer}
          fileName={midImage.fileName}
          imageSrc={midImage.file || ""}
          contentType={midImage.contentType || ""}
          onCloseClick={() => setMidImagePreviewModal((state) => !state)}
        />
      )}
      {endImagePreviewModal && (
        <ImagePreviewModal
          uploadedFromComputer={endImage.uploadedFromComputer}
          fileName={endImage.fileName}
          imageSrc={endImage.file || ""}
          contentType={endImage.contentType || ""}
          onCloseClick={() => setEndImagePreviewModal((state) => !state)}
        />
      )}

      {popupMessage.show && (
        <MessagePopup
          message={popupMessage.msg}
          onCloseClick={() => setPopupMessage({ show: false, msg: "" })}
        />
      )}
    </>
  );
};

export default Product;
