
import SelectBulkVideo from '../../components/SelectBulkVideo/SelectBulkVideo';
import TStandardObject from '../../types/StandardObject';
import styles from './BulkVideo.module.scss';


const BulkVideo = (): JSX.Element => {
    // const history = useHistory();
    return (
        <div className={styles.container}>
            {/* <Steps steps={steps} currentStep={step} /> */}
            <SelectBulkVideo
                // propertyData={null}
                // templateData={null}
                // title={''}
                // onRedirect={updateStep}
                // updateContentIdAndProperty={updateContentIdAndProperty}
            />
        </div>
    );
};

export default BulkVideo;
