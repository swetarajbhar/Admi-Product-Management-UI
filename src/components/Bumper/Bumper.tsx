import { ReactComponent as AddBumperIcon } from '../../assets/SVG/addBumper.svg';
import styles from './Bumper.module.scss';

const Bumper = (): JSX.Element => {
    return (
        <>
            <div className={styles.container}>
                <AddBumperIcon />
                <h5>Change Bumper</h5>
            </div>
        </>
    );
};

export default Bumper;
