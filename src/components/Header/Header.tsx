import cx from "classnames";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ReactComponent as ZeeNewsLogo } from "../../assets/SVG/logo.svg";
import InventoryLogo from "../../assets/PNG/inventoryLogo.png";
import { ReactComponent as NoNotificationIcon } from "../../assets/SVG/notificationIcon.svg";
import { ReactComponent as Notifications } from "../../assets/SVG/notifications.svg";
import { ReactComponent as UserIcon } from "../../assets/SVG/userIcon.svg";
import { ReactComponent as VideoIcon } from "../../assets/SVG/videocam.svg";
import { DEFAULT, LOGIN, NOTIFICATION } from "../../utils/routes";
import Menu from "../Menu/Menu";
import styles from "./Header.module.scss";
import Modal from "../Modal/Modal";
import Entry from "../Entry/Entry";
import Button from "../Button/Button";
import { getNotificationList } from "../../api/notification";
import isEmpty from "../../utils/isEmpty";
import { ReactComponent as IconClose } from "../../assets/SVG/iconClose.svg";
import { isPassword } from "../../utils/regexCheck";
import { updatePassword } from "../../api/changePassword";
import { loginUser, logOut } from "../../api/auth";
import MessagePopup from "../MessagePopup/MessagePopup";
import LOCALSTORAGE from "../../constants/LOCALSTORAGE";

interface NotificationData {
  [key: string]: string | number | undefined | null;
}
interface ChangePassword {
  oldpassword: string;
  newpassword: string;
  confirmpassword: string;
}

const Header = (): JSX.Element => {
  const history = useHistory();
  const userName = localStorage.getItem("USER_NAME") || "";
  const userEmail = localStorage.getItem("USER_EMAIL") || "";
  const menuData = [
    { id: "1", label: userEmail, value: "" },
    { id: "2", label: "Log Out", value: "logout" },
  ];
  const [popupMessage, setPopupMessage] = useState({
    show: false,
    msg: "",
  });

  const performLogout = async () => {
    const response = await logOut();
    if (response.status === 200) {
      // history.push(VIDEO_LIBRARY_LISTING);
      // localStorage.clear();
      // Redirect to the login page
      history.push(LOGIN);
      // Refresh the page
      window.location.reload();
    } else {
      setPopupMessage({
        show: true,
        msg: "Some Error Occured Please Try Again Later!",
      });
    }
  };

  const onMenuClick = (value: string) => {
    if (value === "logout") {
      // window.localStorage.clear();
      // localStorage.setItem(LOCALSTORAGE.IS_AUTHENTICATED, 'false');
      performLogout();
      // history.push(LOGIN);
      // window.location.reload();
    }
  };

  return (
    <>
      <div id={"header"} className={styles.container}>
        <div className={styles.logo}>
          <img
            src={InventoryLogo}
            width={86}
            height={40}
            alt="Inventory Logo"
          />
        </div>
        <div className={styles.rightAlign}>
          <div
            className={cx("split", styles.headerItems, styles.profileContainer)}
          >
            <UserIcon />
            <div style={{ padding: "0 0.7em" }}>{userName}</div>
            <Menu
              id="profile_menu"
              blackIcon
              data={menuData}
              onMenuItemClick={(value) => onMenuClick(value)}
            />
          </div>
        </div>
      </div>
      {popupMessage.show && (
        <MessagePopup
          message={popupMessage.msg}
          onCloseClick={() => setPopupMessage({ show: false, msg: "" })}
        />
      )}
    </>
  );
};

export default Header;
