import moment from "moment";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import { useHistory } from "react-router";
import Select from "react-select";
import { propertyList } from "../../api/property";
import {
  deleteUserRecord,
  findUserById,
  saveUserData,
  userList,
} from "../../api/user";
import { ReactComponent as CalendarIcon } from "../../assets/SVG/calendar.svg";
import { ReactComponent as ExportIcon } from "../../assets/SVG/export.svg";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Button from "../../components/Button/Button";
import CustomCheckbox from "../../components/customCheckbox/CustomCheckbox";
import Entry from "../../components/Entry/Entry";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import CONSTANTS from "../../constants/constants";
import DATE_FORMAT from "../../constants/DATE_FORMAT";
import TStandardObject from "../../types/StandardObject";
import isEmpty from "../../utils/isEmpty";
import { isPassword } from "../../utils/regexCheck";
import styles from "./User.module.scss";
import MessagePopup from "../../components/MessagePopup/MessagePopup";
interface TableData {
  [key: string]: string | number | undefined | null;
}

const initialStartDate = new Date();
initialStartDate.setDate(1);

const User = (): JSX.Element => {
  const [data, setData] = useState<Array<TStandardObject>>([]);
  const [filterBy, setFilterBy] = useState<string>(
    CONSTANTS.FILTER_BY.DATE_RANGE
  );
  const [search, setSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [offset, setOffset] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [property, setProperty] = useState<any>(null);
  const [propertyData, setPropertyData] = useState<Array<TableData>>([]);
  const [password, setPassword] = useState("");
  const [action, setAction] = useState("");
  const [userID, setUserID] = useState("");
  const [error, setError] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    property: false,
    password: false,
    duplicateEmail: false,
  });
  const [popupMessage, setPopupMessage] = useState({
    show: false,
    msg: "",
  });
  const [modal, setModal] = useState({ show: false });
  const [csvData, setCsvData] = useState<Array<TableData>>([]);
  const [changePassword, setChangePassword] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentID, setCurrentID] = useState<string | number>("");
  const [renderDeleteBox, setRenderDeleteBox] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const limit = 10;

  useEffect(() => {
    getPropertyData();
  }, []);

  const getPropertyData = async () => {
    const response = await propertyList();
    if (response.status === 200) {
      const responseData = response?.data ?? [];
      const data = responseData.map((item: any) => ({
        id: item._id,
        value: item.property_name,
        label: item.property_name,
        liveUrl: item.live_url,
      }));
      setPropertyData(data);
    } else {
      setPropertyData([]);
    }
  };

  const addUser = () => {
    setModal({ show: true });
    setAction(CONSTANTS.ACTION.ADD);
    setChangePassword(true);
  };

  const onName = (e: any) => {
    setName(e.target.value);
    setError({
      ...error,
      name: isEmpty(e.target.value),
    });
  };

  const onEmail = (e: any) => {
    setEmail(e.target.value);
    setError({
      ...error,
      email: isEmpty(e.target.value),
      duplicateEmail: false,
    });
  };

  const onPhoneNumber = (e: any) => {
    setPhoneNumber(e.target.value);
    setError({
      ...error,
      phoneNumber: isEmpty(e.target.value),
    });
  };

  const onPropertyChange = (e: any) => {
    setProperty(e);
    setError({
      ...error,
      property: false,
    });
  };

  const onPassword = (e: any) => {
    setPassword(e.target.value);
    setError({
      ...error,
      password: isEmpty(e.target.value),
    });
  };

  const isValidEmail = () => {
    const emailPattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
    return emailPattern.test(String(email));
  };

  const isValidPhoneNo = () => {
    return phoneNumber !== "" && phoneNumber.length === 10;
  };

  const isValidPassword = () => {
    if (changePassword && isEmpty(password)) return false;
    return true;
  };

  const isValid = () => {
    if (
      isValidEmail() &&
      isValidPhoneNo() &&
      !isEmpty(name) &&
      isValidPassword() &&
      !isEmpty(property) &&
      property.length > 0
    )
      return true;
    return false;
  };

  const onSave = async () => {
    if (isValid()) {
      const props = property.map((x: any) => ({
        property_id: x.id,
        property_name: x.value,
        live_url: x.liveUrl,
      }));
      const userParam: TStandardObject = {
        full_name: name,
        email: email,
        phone_number: phoneNumber,
        role_id: "6138f2263e3ba105b4313c78",
        role_name: "Admin",
        property: props,
      };
      if (action === CONSTANTS.ACTION.EDIT)
        userParam.user_id = userID.toString();
      if (changePassword) userParam.password = password;

      const response = await saveUserData(userParam);
      if (response.status === 200) {
        setModal({ show: false });
        setUserID("");
        setName("");
        setEmail("");
        setPhoneNumber("");
        setProperty(null);
        setPassword("");
        setLoading(false);
      } else if (response.status === 409) {
        setError({
          ...error,
          duplicateEmail: true,
        });
        setLoading(false);
      } else {
        setPopupMessage({
          show: true,
          msg: "Some Error Occured Please Try Again Later!",
        });
        setLoading(false);
      }
    } else {
      setError({
        name: isEmpty(name),
        email: !isValidEmail(),
        phoneNumber: !isValidPhoneNo(),
        property: isEmpty(property) || property.length === 0,
        password: !isValidPassword(),
        duplicateEmail: false,
      });
      setLoading(false);
    }
  };

  const onCancel = () => {
    setModal({ show: false });
    setUserID("");
    setName("");
    setEmail("");
    setPhoneNumber("");
    setProperty(null);
    setPassword("");
    setLoading(false);
    setError({
      name: false,
      email: false,
      phoneNumber: false,
      property: false,
      password: false,
      duplicateEmail: false,
    });
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
          <small className={styles.error}>Please enter name</small>
        )}
      </div>
    );
  };

  const renderEmailField = () => {
    return (
      <div>
        <Entry
          id="Email"
          type="text"
          styleClass={styles.inputStyle}
          placeholder="Email"
          value={email}
          onChange={onEmail}
        />
        {error.email && (
          <small className={styles.error}>Please enter valid email</small>
        )}
        {error.duplicateEmail && (
          <small className={styles.error}>This Email Already Exists</small>
        )}
      </div>
    );
  };

  const renderPhoneNumberField = () => {
    return (
      <div>
        <Entry
          id="phoneNumber"
          type="number"
          styleClass={styles.inputStyle}
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={onPhoneNumber}
          onInput={(e) => (e.target.value = e.target.value.slice(0, 10))}
        />
        {error.phoneNumber && (
          <small className={styles.error}>
            Please enter valid phone number
          </small>
        )}
      </div>
    );
  };

  const renderPropertyDropdown = () => {
    return (
      <div>
        <Select
          isMulti
          closeMenuOnSelect
          onChange={onPropertyChange}
          value={property}
          placeholder="Select Property"
          options={propertyData}
        />
        {error.property && (
          <small className={styles.error}>Please select property</small>
        )}
      </div>
    );
  };

  const renderPasswordField = () => {
    return (
      <div>
        <Entry
          id="password"
          placeholder="Password"
          type="password"
          styleClass={styles.inputStyle}
          value={password}
          onChange={onPassword}
          disabled={!changePassword}
        />
        {error.password && (
          <small className={styles.error}>Please enter password</small>
        )}
        {!isPassword(password) && changePassword ? (
          <span className={styles.error}>
            Password should contain at least one upper case, lower case, special
            character, number and at least 8 characters
          </span>
        ) : (
          ""
        )}
      </div>
    );
  };

  const renderAddModal = () => {
    return (
      <Modal divId="fullscreenModal">
        <div className={styles.modalContainer}>
          <div className={styles.headingStyle}>Add New User</div>
          <div className={styles.rows}>
            {renderNameField()}
            {renderEmailField()}
          </div>
          <div className={styles.rows}>
            {renderPhoneNumberField()}
            {renderPropertyDropdown()}
          </div>
          <div className={styles.rows}>
            {renderPasswordField()}
            <div style={{ marginTop: "0.5em" }}>
              {action === CONSTANTS.ACTION.EDIT && (
                <CustomCheckbox
                  id="changePassword"
                  value="Change Password"
                  checked={changePassword}
                  onChange={() => setChangePassword(!changePassword)}
                />
              )}
            </div>
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
    "User ID",
    "User Name",
    "Email Address",
    "Phone Number",
    "Property Name",
    "Created By",
    "Status",
  ];

  const csvHeaders = [
    { label: "User ID", key: "userId" },
    { label: "User Name", key: "userName" },
    { label: "Email Address", key: "email" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Property Name", key: "propertyName" },
    { label: "Created By", key: "ceatedBy" },
    //{ label: 'Created At', key: 'ceatedAt' },
    { label: "Status", key: "isActive" },
  ];

  async function onActionClick(actionType: string, index: any) {
    const userId = index;

    if (userId && userId !== "-") {
      if (actionType === CONSTANTS.ACTION.EDIT) {
        setAction(CONSTANTS.ACTION.EDIT);
        setChangePassword(false);
        const response = await findUserById(userId);
        if (response.status === 200) {
          setUserID(userId);
          setModal({ show: true });
          setName(response.data?.full_name || "");
          setEmail(response.data?.email || "");
          setPhoneNumber(response.data?.phone_number || "");
          const prop = isEmpty(response.data.property)
            ? null
            : response.data.property.map((x: any) => ({
                id: x.property_id,
                value: x.property_name,
                label: x.property_name,
                liveUrl: x.live_url,
              }));
          setProperty(prop);
          setPassword(response.data?.password || "");
        } else {
          setUserID("");
          setModal({ show: false });
        }
      }

      if (actionType === CONSTANTS.ACTION.DELETE) {
        setCurrentID(userId);
        setRenderDeleteBox(true);
      }
    }
  }

  const onMenuClick = (value: string) => {
    setSearch(value);
    setFilterBy(CONSTANTS.FILTER_BY.SEARCH_TEXT);
  };

  const onPaginatonClick = (currentPage: any) => {
    setCurrentPage(currentPage);
    setOffset((currentPage - 1) * limit);
  };

  const onSearch = (value: string) => {
    setOffset(0);
    setCurrentPage(1);
    setSearch(value);
    setFilterBy(CONSTANTS.FILTER_BY.SEARCH_TEXT);
  };

  const dateSearch = (dateType: string, date: Date) => {
    setOffset(0);
    setCurrentPage(1);
    dateType === "startDate" && setStartDate(date);
    dateType === "endDate" && setEndDate(date);
    setFilterBy(CONSTANTS.FILTER_BY.DATE_RANGE);
  };

  const getUserList = async (isBulk: boolean) => {
    const params = {
      limit,
      offset,
      filter_by: filterBy,
      search_term: search,
      start_date: moment(startDate).format(DATE_FORMAT.SEARCH_DATE_FORMAT),
      end_date: moment(endDate).format(DATE_FORMAT.SEARCH_DATE_FORMAT),
    };
    const response = await userList(isBulk ? { offset: 0 } : params);
    if (response.status === 200) {
      const formatedData: Array<{
        [key: string]: string | number | undefined | null;
      }> = [];
      const data = response?.data ?? [];
      data.forEach((data: any, index: number) => {
        formatedData.push({
          srNo: index + 1 + offset,
          userId: data.user_id || "-",
          userName: data.full_name || "-",
          email: data.email || "-",
          phoneNumber: data.phone_number || "-",
          propertyName: isEmpty(data.property)
            ? "-"
            : data?.property.map((x: any) => x?.property_name).join(", "),
          ceatedBy: data.created_name || "-",
          isActive: data.is_active ? "Active" : "Inactive",
        });
      });
      if (isBulk) {
        setCsvData(formatedData);
      } else {
        setTotalCount(response?.totalRecord);
        setData(formatedData);
      }
    } else {
      if (isBulk) {
        setCsvData([]);
      } else {
        setTotalCount(0);
        setData([]);
      }
    }
  };

  useEffect(() => {
    getUserList(true);
  }, []);

  useEffect(() => {
    if (modal.show === false) {
      getUserList(false);
    }
  }, [modal.show, search, startDate, endDate, offset, renderDeleteBox]);

  const onDelete = async () => {
    if (currentID) {
      const response = await deleteUserRecord(currentID);
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
          <Entry
            id="search"
            styleClass={styles.searchBar}
            value={search}
            onChange={(e) => {
              onSearch(e.target.value);
            }}
          />
          <div className={styles.datePickerWrapper}>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) =>
                date && dateSearch("startDate", date)
              }
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat={DATE_FORMAT.SHORT_DATE_FORMAT}
              placeholderText={DATE_FORMAT.STANDARD_DATE_FORMAT}
              className={`${styles.startDate} ${styles.datepickerInput}`}
              maxDate={new Date()}
            />
            <span style={{ paddingRight: "0.8em" }}>-</span>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) =>
                date && dateSearch("endDate", date)
              }
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat={DATE_FORMAT.SHORT_DATE_FORMAT}
              placeholderText={DATE_FORMAT.STANDARD_DATE_FORMAT}
              className={styles.datepickerInput}
              maxDate={new Date()}
            />
            <CalendarIcon className={styles.calendarIcon} />
          </div>
          <CSVLink
            className={styles.exportButton}
            data={csvData}
            headers={csvHeaders}
          >
            Export <ExportIcon />
          </CSVLink>

          <Button
            buttonType="primary"
            styleClass={styles.addUserButton}
            id={"addnewuser"}
            onClick={addUser}
          >
            Add New User
          </Button>
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
            <h4>Are you sure you want to delete this user?</h4>
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
      {popupMessage.show && (
        <MessagePopup
          message={popupMessage.msg}
          onCloseClick={() => setPopupMessage({ show: false, msg: "" })}
        />
      )}
    </>
  );
};

export default User;
