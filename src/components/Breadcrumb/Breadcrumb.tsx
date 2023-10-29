
import { useLocation } from 'react-router-dom';
import isEmpty from '../../utils/isEmpty';
import styles from './Breadcrumb.module.scss';

const Breadcrumb = (): JSX.Element => {
    const pathName = useLocation().pathname;
    const pathNames = isEmpty(pathName) ? [] : pathName.split('/').filter(x => x).map(x => x.replace('-',' '));
    return (
        <div className={styles.container}>
            <label className={styles.heading}>{pathNames.splice(0,1)} {pathNames.length > 0 && <>&gt;</>} </label>
            <label>{pathNames.map((x) => x).join(' > ')}</label>
        </div>
    );
};

export default Breadcrumb;
