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
import {
  DASHBOARD,
  DEFAULT,
  FORGOT_PASSWORD,
  LIVE_VIDEO,
  LOGIN,
  NOTIFICATION,
  RECENT_ACTIVITY,
  SET_PASSWORD,
  TEMPLATE_MASTER,
  USER_MASTER,
  VIDEO_LIBRARY_DETAIL,
  VIDEO_LIBRARY_DETAIL_VIEW,
  VIDEO_LIBRARY_LISTING,
  PROPERTY_MASTER,
  PROPERTY_MASTER_DETAIL,
  BULK_VIDEO,
  PRODUCT_MASTER,
} from "../../utils/routes";
import styles from "./Masterpage.module.scss";

const Login = lazy(() => import("../Login/Login"));
const ForgotPassword = lazy(() => import("../ForgotPassword/ForgotPassword"));
const SetPassword = lazy(() => import("../SetPassword/SetPassword"));
const VideoLibrary = lazy(() => import("../VideoLibrary/VideoLibrary"));
const Dashboard = lazy(() => import("../Dashboard/Dashboard"));
// const Template = lazy(() => import('../Template/Template'));
// const User= lazy(() => import('../User/User'));
const VideoLibraryDetail = lazy(
  () => import("../VideoLibraryDetail/VideoLibraryDetail")
);
const User = lazy(() => import("../User/User"));
const Product = lazy(() => import("../Product/Product"));
const Template = lazy(() => import("../Template/Template"));
const VideoLibraryDetailView = lazy(
  () => import("../VideoLibraryDetailView/VideoLibraryDetailView")
);
const RecentActivity = lazy(() => import("../Activity/RecentActivity"));
const Notification = lazy(() => import("../Notification/Notification"));
const LiveVideo = lazy(() => import("../LiveVideo/LiveVideo"));
const Property = lazy(() => import("../Property/Property"));
const PropertyDetail = lazy(() => import("../PropertyDetail/PropertyDetail"));
const BulkVideo = lazy(() => import("../BulkVideo/BulkVideo"));

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
                    exact
                    path={TEMPLATE_MASTER}
                    component={Template}
                  />
                  {/* <PrivateRoute path={`${VIDEO_LIBRARY_DETAIL_VIEW}/:id?`} component={VideoLibraryDetailView} />
                  <PrivateRoute exact path={RECENT_ACTIVITY} component={RecentActivity} />
                  <PrivateRoute exact path={NOTIFICATION} component={Notification} />
                  <PrivateRoute exact path={LIVE_VIDEO} component={LiveVideo} />
                  <PrivateRoute exact path={PROPERTY_MASTER} component={Property} />
                  <PrivateRoute exact path={PROPERTY_MASTER_DETAIL} component={PropertyDetail} />
                  <PrivateRoute exact path={BULK_VIDEO} component={BulkVideo} /> */}
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
