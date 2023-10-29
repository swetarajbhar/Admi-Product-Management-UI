
import { useEffect, useState } from 'react';
import CONSTANTS from '../../constants/constants';
import TStandardObject from '../../types/StandardObject';
import styles from './PropertyDetail.module.scss';
import { useHistory } from 'react-router';
import { PROPERTY_MASTER } from '../../utils/routes';
import Select from 'react-select/src/Select';
import Entry from '../../components/Entry/Entry';
import isEmpty from '../../utils/isEmpty';
import Button from '../../components/Button/Button';
import { getPropertyDetail, saveProperty } from '../../api/property';
import MessagePopup from '../../components/MessagePopup/MessagePopup';

const PropertyDetail = (props: TStandardObject): JSX.Element => {

    const [property, setProperty] = useState('');
    const [liveUrl, setLiveUrl] = useState('');
    const [videoSection, setVideoSection] = useState('');
    const [videoSectionData, setVideoSectionData] = useState<string[]>([]);
    const [error, setError] = useState({
        property: false,
        // liveUrl: false,
        videoSection: false,
    });

    const [loading, setLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ show: false, msg: '' });

    // const [videoDetail, setVideoDetail] = useState<Partial<VideoDetail>>({});

    const history = useHistory();

    useEffect(() => {
        const { id, action } = props.location.state;
        if (action === CONSTANTS.ACTION.EDIT) {
            getPropertyDetail({ property_id: id })
                .then((res) => {
                    if (res) {
                        const { propertyName, videoSectionData, liveUrl } = res.data;
                        setProperty(propertyName);
                        setVideoSectionData(videoSectionData);
                        setLiveUrl(liveUrl);
                    }
                })
                .catch((err) => {
                    console.error('err :>> ', err);
                });
        }
    }, []);

    const onPropertyChange = (e: any) => {
        const val = e.target.value;
        setProperty(val);
        setError({
            ...error,
            property: isEmpty(val)
        });
    };

    // const onLiveUrlChange = (e: any) => {
    //     const val = e.target.value;
    //     setLiveUrl(val);
    //     setError({
    //         ...error,
    //         liveUrl: isEmpty(e.target.value)
    //     });
    // };

    const onVideoSectionChange = (e: any) => {
        const val = e.target.value;
        setVideoSection(val);
        // setError({
        //     ...error,
        //     videoSection: isEmpty(e.target.value)
        // });
    };

    const onKeyUp = (e: any) => {
        const key = e.keyCode;
        // enter key
        if (key === 13 && videoSection && !isEmpty(videoSection)) {
            const tag = videoSection.trim();
            if (!isEmpty(tag)) {
                const oldTag = videoSectionData;
                const updatedTags = [...oldTag, tag];
                setVideoSection('');
                setVideoSectionData(updatedTags);
            }
        }
    };

    const deleteTag = (i: number) => {
        const arr = [...videoSectionData];
        arr.splice(i, 1);
        setVideoSectionData(arr);
    };

    const onAddClick = async() => {
        const invalidProperty = isEmpty(property);
        // const invalidLiveUrl = isEmpty(liveUrl);
        // const invalidVideoSection = videoSectionData.length < 1;
        if (invalidProperty) {
            setError({
                ...error,
                property: invalidProperty,
                // liveUrl: invalidLiveUrl
                // videoSection: invalidVideoSection
            });
        } else {
            const { id, action } = props.location.state;
            const bodyParam: TStandardObject = {
                property_name: property,
                video_section: videoSectionData,
                live_url: liveUrl,
                is_active: true
            };
            if (action === CONSTANTS.ACTION.EDIT) bodyParam.id = id;
            setLoading(true);
            const res = await saveProperty(bodyParam);
            if(res.status === 200) {
                // setLoading(false);
                // setPopupMessage({
                //     show: true,
                //     msg: 'Property saved successfully'
                // });
                history.push(PROPERTY_MASTER);
            } else if(res.status === 409) {
                setPopupMessage({
                    show: true,
                    msg: 'This property already exists'
                });
                setLoading(false);
            } else if(res.status === 404) {
                setPopupMessage({
                    show: true,
                    msg: res.error
                });
                setLoading(false);
            }  else {
                setPopupMessage({
                    show: true,
                    msg: 'Some Error Occured Please Try Again Later!'
                });
                setLoading(false);
            }
        }
    };

    const { action } = props.location.state;

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                {action === CONSTANTS.ACTION.EDIT ? 'Edit' : 'Add'} Property
            </div>
            <div className={styles.content}>
                <div className={styles.inputWrapper}>
                    <Entry
                        id='property'
                        type='text'
                        styleClass={styles.inputStyle}
                        placeholder='Property Name'
                        value={property}
                        onChange={onPropertyChange}
                        disabled={action === CONSTANTS.ACTION.EDIT}
                    />
                    {error.property && <small className={styles.errorMessage}>Please enter property name</small>}
                    <div>
                        <h5 style={{ marginTop: '0.8em' }}>
                            Note: Please make sure the property name which you&apos;re entering is same as ID of Channel in MediaPackage.
                        </h5>
                    </div>
                </div>
                {/* <div className={styles.inputWrapper}>
                    <Entry
                        id='liveUrl'
                        type='text'
                        styleClass={styles.inputStyle}
                        placeholder='Live URL'
                        value={liveUrl}
                        onChange={onLiveUrlChange}
                    />
                    {error.liveUrl && <small className={styles.errorMessage}>Please enter live URL</small>}
                </div> */}
                <div className={styles.inputWrapper}>
                    <Entry
                        id='videoSection'
                        type='text'
                        styleClass={styles.inputStyle}
                        placeholder='Video Section'
                        value={videoSection}
                        onChange={onVideoSectionChange}
                        onKeyUp={onKeyUp}
                    />
                    {/* {error.videoSection && <small className={styles.errorMessage}>Please enter video section</small>} */}
                </div>
                <div className={styles.tagsWrapper}>
                    {videoSectionData.map((x, i) => (
                        <div className={styles.tags} key={`${x}_${i}`}>
                            {x}
                            <Button id='deleteTag' styleClass={styles.deleteIconStyle} onClick={() => deleteTag(i)}>
                                X
                            </Button>
                        </div>
                    ))}
                </div>
                <Button
                    id="uploadAndContinue"
                    buttonType="primary"
                    styleClass={styles.addBtn}
                    onClick={onAddClick}
                    showLoader={loading}
                    disabled={loading}
                >
                    {action === CONSTANTS.ACTION.EDIT ? 'Update' : 'Add'} Property
                </Button>
            </div>            

            {popupMessage.show && <MessagePopup message={popupMessage.msg} onCloseClick={() => setPopupMessage({ show: false, msg: '' })} />}
        </div>
    );
};

export default PropertyDetail;
