import cx from "classnames";
import { lazy, Suspense, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import LOCALSTORAGE from "../../constants/LOCALSTORAGE";
import { DEFAULT, LOGIN, PRODUCT_MASTER } from "../../utils/routes";
import styles from "./Masterpage.module.scss";

const Login = lazy(() => import("../Login/Login"));
const Product = lazy(() => import("../Product/Product"));

const Masterpage = (): JSX.Element => {
  const [displayHeaderAndSidebar, setDisplayHeaderAndSidebar] = useState(true);

  useEffect(() => {
    const pathname = window.location.pathname.split("/")[1];
    const requiresAuthentication = ![DEFAULT, LOGIN].includes("/" + pathname);
    setDisplayHeaderAndSidebar(requiresAuthentication);
  }, []);

  const checkAuthentication = () => {
    if (
      localStorage.length !== 0 &&
      localStorage.getItem(LOCALSTORAGE.IS_AUTHENTICATED) !== null &&
      localStorage.getItem(LOCALSTORAGE.IS_AUTHENTICATED) === "true"
    ) {
      setDisplayHeaderAndSidebar(true);
      return true;
    }
    localStorage.setItem(LOCALSTORAGE.IS_AUTHENTICATED, "false");
    setDisplayHeaderAndSidebar(false);
    return false;
  };

  const PrivateRoute = ({ component: Component, ...rest }: any) => (
    <Route
      {...rest}
      render={(props) =>
        checkAuthentication() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: LOGIN }} />
        )
      }
    />
  );

  return (
    <>
      <Router>
        <>
          <div className={styles.masterContainer}>
            {displayHeaderAndSidebar && <Header />}
            {displayHeaderAndSidebar && <Sidebar />}
            <Suspense fallback={"Loading"}>
              <main className={cx({ [styles.auth]: !displayHeaderAndSidebar })}>
                <Switch>
                  <Route exact path={DEFAULT} component={Login} />
                  <Route exact path={LOGIN} component={Login} />
                  <PrivateRoute
                    exact
                    path={PRODUCT_MASTER}
                    component={Product}
                  />
                  <PrivateRoute
                    path="*"
                    component={() => (
                      <h4 style={{ textAlign: "center" }}>404 NOT FOUND</h4>
                    )}
                  />
                </Switch>
              </main>
            </Suspense>
          </div>
        </>
      </Router>
    </>
  );
};

export default Masterpage;
