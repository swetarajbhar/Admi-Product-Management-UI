import { Link } from "react-router-dom";
import { ReactComponent as GreyIcon } from "../../assets/SVG/grey.svg";
import {
  DASHBOARD,
  TEMPLATE_MASTER,
  USER_MASTER,
  VIDEO_LIBRARY_LISTING,
  RECENT_ACTIVITY,
  LIVE_VIDEO,
  PROPERTY_MASTER,
  BULK_VIDEO,
  PRODUCT_MASTER,
} from "../../utils/routes";
import styles from "./Sidebar.module.scss";

const Sidebar = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <div>
        <Link to={PRODUCT_MASTER}>
          <GreyIcon className={styles.greyIcon} />
          Product Library
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
