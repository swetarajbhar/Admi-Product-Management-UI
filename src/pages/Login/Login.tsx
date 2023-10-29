import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { loginUser } from "../../api/auth";
import InventoryLogo from "../../assets/PNG/inventoryLogo.png";
import Button from "../../components/Button/Button";
import Entry from "../../components/Entry/Entry";
import LOCALSTORAGE from "../../constants/LOCALSTORAGE";
import isEmpty from "../../utils/isEmpty";
import { isEmail } from "../../utils/regexCheck";
import {
  PRODUCT_MASTER,
  USER_MASTER,
  VIDEO_LIBRARY_LISTING,
} from "../../utils/routes";
import styles from "./Login.module.scss";
import MessagePopup from "../../components/MessagePopup/MessagePopup";

interface TLoginForm {
  email: string;
  password: string;
  loggedIn: boolean;
}

const Login = (): JSX.Element => {
  const [form, setForm] = useState<TLoginForm>({
    email: "",
    password: "",
    loggedIn: false,
  });
  const [errors, setErrors] = useState<Array<keyof TLoginForm>>([]);
  const [popupMessage, setPopupMessage] = useState({
    show: false,
    msg: "",
  });
  const history = useHistory();

  useEffect(() => {
    if (
      localStorage.length !== 0 &&
      localStorage.getItem(LOCALSTORAGE.IS_AUTHENTICATED) !== null &&
      localStorage.getItem(LOCALSTORAGE.IS_AUTHENTICATED) === "true"
    ) {
      localStorage.clear();
      localStorage.setItem(LOCALSTORAGE.IS_AUTHENTICATED, "false");
      window.location.reload();
    }
  }, []);

  const onChange = (name: keyof TLoginForm, value: string | boolean) => {
    setForm((state) => ({
      ...state,
      [name]: value,
    }));
    if (errors.includes(name)) {
      setErrors([...[...errors].filter((x) => x !== name)]);
    }
  };

  const isValid = () => {
    const errors: Array<keyof TLoginForm> = [];
    if (isEmpty(form.email) || !isEmail(form.email)) {
      errors.push("email");
    }
    if (isEmpty(form.password)) {
      errors.push("password");
    }
    return errors;
  };

  const onLoginClick = async () => {
    const _errors = isValid();
    if (isEmpty(_errors.length)) {
      const response = await loginUser({
        email: form.email,
        password: form.password,
      });
      if (response.status === 200) {
        // history.push(VIDEO_LIBRARY_LISTING);
        history.push(PRODUCT_MASTER);
      } else if (response.status === 400) {
        setPopupMessage({ show: true, msg: "Invalid Email Id/ Password !" });
      } else {
        setPopupMessage({
          show: true,
          msg: "Some Error Occured Please Try Again Later!",
        });
      }
    } else {
      setErrors([..._errors]);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.loginContainer}>
          <section>
            <img
              className={styles.inventoryLogo}
              src={InventoryLogo}
              alt="Inventory Logo"
            />
            <div className={styles.body}>
              <Entry
                id="emailID"
                label={"Email Address"}
                value={form.email}
                errorMessage={
                  errors.includes("email") ? "Please enter valid Email ID" : ""
                }
                onChange={(e) => onChange("email", e.target.value)}
              />
              <Entry
                id="password"
                type="password"
                label={"Password"}
                value={form.password}
                errorMessage={
                  errors.includes("password")
                    ? "Please enter valid password"
                    : ""
                }
                onChange={(e) => onChange("password", e.target.value)}
              />
              <Button buttonType="primary" id={"login"} onClick={onLoginClick}>
                Login
              </Button>
            </div>
          </section>
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

export default Login;
