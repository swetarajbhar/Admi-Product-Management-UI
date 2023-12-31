import cx from "classnames";
import { useState } from "react";
import { useHistory } from "react-router";
import InventoryLogo from "../../assets/PNG/inventoryLogo.png";
import { ReactComponent as UserIcon } from "../../assets/SVG/userIcon.svg";
import { LOGIN } from "../../utils/routes";
import Menu from "../Menu/Menu";
import styles from "./Header.module.scss";
import { logOut } from "../../api/auth";
import MessagePopup from "../MessagePopup/MessagePopup";

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
      history.push(LOGIN);
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
      performLogout();
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
