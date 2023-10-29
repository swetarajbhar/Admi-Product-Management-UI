import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { propertyList } from '../../api/property';
import { completeMultipartUpload, deleteTemplateRecord, findTemplateById, getSignedUrl, getTemplateMasterList, getUploadID, saveTemplateData } from '../../api/template';
import { ReactComponent as CalendarIcon } from '../../assets/SVG/calendar.svg';
import { ReactComponent as UploadIcon } from '../../assets/SVG/uploadIcon.svg';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Button from '../../components/Button/Button';
import Entry from '../../components/Entry/Entry';
import MessagePopup from '../../components/MessagePopup/MessagePopup';
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import VideoPreviewModal from '../../components/VideoPreviewModal/VideoPreviewModal';
import CONSTANTS from '../../constants/constants';
import DATE_FORMAT from '../../constants/DATE_FORMAT';
import TStandardObject from '../../types/StandardObject';
import isEmpty from '../../utils/isEmpty';
import cx from 'classnames';
import styles from './Template.module.scss';
import LOCALSTORAGE from '../../constants/LOCALSTORAGE';

interface TableData {
  [key: string]: string | number | undefined | null;
}

const headers = [
  'Sr No',
  'Template ID',
  'Template Name',
  'Property Name',
  'Created By',
  'Created At',
  'Status'
];

const limit = 10;
const initialStartDate = new Date();
initialStartDate.setDate(1);

const Template = (): JSX.Element => {
  const [data, setData] = useState<Array<TableData>>([]);
  const [filterBy, setFilterBy] = useState<string>(CONSTANTS.FILTER_BY.DATE_RANGE);
  const [search, setSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [currentID, setCurrentID] = useState<string | number>('');
  const [action, setAction] = useState('');
  const [template, setTemplate] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [property, setProperty] = useState<any>(null);
  const [propertyData, setPropertyData] = useState<Array<TableData>>([]);
  const [startBumper, setStartBumper] = useState<TStandardObject>({ fileName: '', file: '', newFileUploaded: true, uploadedFromComputer: true });
  const [endBumper, setEndBumper] = useState<TStandardObject>({ fileName: '', file: '', newFileUploaded: true, uploadedFromComputer: true });

  const [renderModal, setRenderTemplateModal] = useState(false);
  const [renderDeleteBox, setRenderDeleteBox] = useState(false);
  const [videoPreviewModal, setVideoPreviewModal] = useState(false);
  const [videoPreviewModal2, setVideoPreviewModal2] = useState(false);

  const [error, setError] = useState({
    template: false,
    property: false,
    startBumper: false,
    endBumper: false,
    fileType1: false,
    fileType2: false,
  });
  const [popupMessage, setPopupMessage] = useState({ show: false, msg: '' });

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   // getPropertyData();
  //     const propData = JSON.parse(localStorage[LOCALSTORAGE.PROPERTY]);
  //     if(propData && propData[0] !== null) {
  //       setPropertyData(propData);
  //     }
  // }, []);

  useEffect(() => {
    getTemplateMasterList({
      limit: 10,
      offset,
      filter_by: filterBy,
      start_date: startDate,
      end_date: endDate,
      search_term: search,
    })
      .then((res) => {
        setData(res.data || []);
        setTotalCount(res.totalRecord);
      }).catch((err) => {
        console.error('err', err);
      });
  }, [startDate, endDate, renderDeleteBox, renderModal, offset, search]);

  const showTemplateModal = () => {
    setRenderTemplateModal((modalState) => !modalState);
    setAction(CONSTANTS.ACTION.ADD);
  };
  const showStartModal=()=>{
    setVideoPreviewModal((modalState)=> !modalState);
  };

  const startPreview=()=>{
    return(<VideoPreviewModal
        uploadedFromComputer={startBumper.uploadedFromComputer}
        fileName={startBumper.fileName}
        videoSrc={startBumper.file|| ''}
        onCloseClick={() => setVideoPreviewModal((modalState)=> !modalState)}
    /> 
    );
  };
  const onTemplate = (e: ChangeEvent<HTMLInputElement>) => {
    setTemplate(e.target.value);
    setError({
      ...error,
      template: isEmpty(e.target.value),
    });
  };

  const onPropertyChange = (e: any) => {
    setProperty(e);
    setError({
      ...error,
      property: false,
    });
  };

  const onStartBumperChange = async (event: any) => {
    const file = event.target.files[0];
    if (file && file.type === 'video/mp4') {
      setStartBumper({ fileName: file.name, file: file, newFileUploaded: true, uploadedFromComputer: true });
      setError({
        ...error,
        startBumper: false,
      fileType1: false
      });
    }else{
      setError({...error, fileType1: true});
    }
  };
  const onEndBumperChange = async (event: any) => {
    const file = event.target.files[0];
    if (file && file.type === 'video/mp4') {
      setEndBumper({ fileName: file.name, file: file, newFileUploaded: true, uploadedFromComputer: true });
      setError({
        ...error,
        endBumper: false,
        fileType2: false
      });
    }else{
     //window.alert('Please select valid .mp4 file');
     setError({...error, fileType2: true});
    }
  };

  const isValid = () => {
    if(!isEmpty(template) && !isEmpty(startBumper.fileName) && !isEmpty(endBumper.fileName) && property !== null) return true;
    return false;
  };

  const onSave = async() => {
    if(isValid()) {
      if(action === CONSTANTS.ACTION.ADD) addTemplate();
      if(action === CONSTANTS.ACTION.EDIT) editTemplate();
      setLoading(true);
    } else {
      setError({
        template: isEmpty(template),
        property: isEmpty(property),
        startBumper: isEmpty(startBumper.fileName),
        endBumper: isEmpty(endBumper.fileName),
        fileType1: false,
        fileType2: false,
        
      });
    }
  };

  const editTemplate = async() => {
    if(startBumper.newFileUploaded) await startMultiPartUpload('startBumper', startBumper.file, templateId);
    if(endBumper.newFileUploaded) await startMultiPartUpload('endBumper', endBumper.file, templateId);
    saveUpdateTemplateData(templateId);
  };

  const addTemplate = async() => {
    const id = await startMultiPartUpload('startBumper', startBumper.file);
    if(id) {
      const resId = await startMultiPartUpload('endBumper', endBumper.file, id.toString());
      if(resId) saveUpdateTemplateData(id); setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const startMultiPartUpload = async(uploadType: string, file: any, tID = '') => {    
    const params: TStandardObject = {};
    params.type = (uploadType === 'startBumper') ? 'start_bumper' : 'end_bumper';
    params.original_file_name = (uploadType === 'startBumper') ? startBumper.fileName : endBumper.fileName;
    params.content_type = file?.type;
    // if(action === CONSTANTS.ACTION.EDIT) params.template_id = templateId.toString();
    // if(action === CONSTANTS.ACTION.ADD && uploadType === 'endBumper') params.template_id = tID;
    params.template_id = tID;

    // get upload ID
    const getUploadIdResponse = await getUploadID(params);
    if (getUploadIdResponse.status === 200) {
        const getUploadIdResponseData = getUploadIdResponse.data;
        if (getUploadIdResponseData) {
            setTemplateId(getUploadIdResponseData.template_id);
            const uploadParams = {
                bucket_name: getUploadIdResponseData.bucket_name,
                file_name: getUploadIdResponseData.file_name,
                upload_id: getUploadIdResponseData.upload_id,
            };
            try {
              const CHUNK_SIZE = 10000000; // 10MB
              const fileSize = file?.size ?? 0;
              const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
              const promisesArray = [];
              let start, end, blob;

              for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
                start = (index - 1) * CHUNK_SIZE;
                end = (index) * CHUNK_SIZE;
                blob = (index < CHUNKS_COUNT) ? file?.slice(start, end) : file?.slice(start);

                const queryParams = {
                    bucket_name: uploadParams.bucket_name,
                    part_number: index,
                    upload_id: uploadParams.upload_id,
                    file_name: uploadParams.file_name,
                };

                // Get presigned URL for each part
                const getSignedUrlResponse = await getSignedUrl(queryParams);
                if (getSignedUrlResponse.status === 200) {
                    const getSignedUrlResponseData = getSignedUrlResponse.data;
                    const presignedUrl = getSignedUrlResponseData;
                    // Send part aws server
                    const uploadResp = axios.put(presignedUrl, blob, {
                        headers: { 'Content-Type': file?.type }
                    });
                    promisesArray.push(uploadResp);
                } else {
                    // console.log('getSignedUrlResponse error :>> ', getSignedUrlResponse.error);
                }

                const resolvedArray = await Promise.all(promisesArray);

                const uploadPartsArray: Array<{ [key: string]: any }> = [];
                resolvedArray.forEach((resolvedPromise, index) => {
                    uploadPartsArray.push({
                        ETag: resolvedPromise.headers.etag,
                        PartNumber: index + 1
                    });
                });

                // CompleteMultipartUpload in the backend server
                const completeUploadParams = {
                    bucket_name: uploadParams.bucket_name,
                    file_name: uploadParams.file_name,
                    upload_id: uploadParams.upload_id,
                    parts: uploadPartsArray,
                    type: params.type,
                };
                const completeUploadResp = await completeMultipartUpload(completeUploadParams);
                if (completeUploadResp.data) {
                   return getUploadIdResponseData.template_id;
                }
            }

          } catch (err) {
              console.log(err);
          }
        }
    } else {
      // console.log('getUploadID error');
      return null;
    }
  };

  const saveUpdateTemplateData = async(templateID: any) => {
    const saveTemplateParams = {
        template_name: template,
        template_id: templateID.toString(),
        property: property.map((x: any) => ({ id: x.id, name: x.value }))
    };
    const saveTemplateResponse = await saveTemplateData(saveTemplateParams);
    if (saveTemplateResponse.status === 200) {
        setLoading(false);
        setRenderTemplateModal(false);
        setStartBumper({ fileName: '', file: '', newFileUploaded: false, uploadedFromComputer: true});
        setEndBumper({ fileName: '', file: '', newFileUploaded: false, uploadedFromComputer: true });
        setProperty(null);
        setTemplate('');
        setTemplateId('');
        setPopupMessage({ show: true, msg: 'Template saved successfully' });
    } else {
      setLoading(false);
      console.log('error', saveTemplateResponse.error);
    }
  };

  const onCancel = () => {
    setRenderTemplateModal(false);
    setStartBumper({ fileName: '', file: '', newFileUploaded: false, uploadedFromComputer: true });
    setEndBumper({ fileName: '', file: '', newFileUploaded: false, uploadedFromComputer: true });
    setProperty(null);
    setTemplate('');
    setTemplateId('');
    setLoading(false);
    setError({
      startBumper: false,
      endBumper: false,
      template: false,
      property: false,
      fileType1: false,
      fileType2: false,
    });
  };

  const onActionClick = async(actionType: string, index: any) => {
    if (index && index !== '-') {
      if (actionType === CONSTANTS.ACTION.EDIT) {
        setTemplateId(index.toString());
        setAction(CONSTANTS.ACTION.EDIT);
        const response = await findTemplateById(index);
        if (response.status === 200) {
          const prop = response.data?.property?.map((x: any) => ({ id: x?.id, value: x?.name, label: x?.name }));
          setProperty(prop);
          setTemplate(response.data?.template_name);
          // setTemplateId(response.data?.template_id);
          setStartBumper({
            fileName: response.data?.start_bumper?.name || '',
            file: response.data?.start_bumper?.s3_url || '',
            newFileUploaded: false,
            uploadedFromComputer: false
          });
          setEndBumper({
            fileName: response.data?.end_bumper?.name || '',
            file: response.data?.end_bumper?.s3_url || '',
            newFileUploaded: false,
            uploadedFromComputer: false
          });
          setRenderTemplateModal(true);
        }
      }

      if (actionType === CONSTANTS.ACTION.DELETE) {
        setCurrentID(index);
        setRenderDeleteBox(true);
      }
    }
  };

  const onDelete = async () => {
    if (currentID) {
        const response = await deleteTemplateRecord(currentID);
        if (response.status === 200) {
            setRenderDeleteBox(false);
        }
    }
  };

  const onDeleteCancel = () => {
    setRenderDeleteBox(false);
  };

  const onMenuClick = (value: string) => {
    setSearch(value);
    setFilterBy(CONSTANTS.FILTER_BY.SEARCH_TEXT);
  };

  const onPaginatonClick = (currentPage: any) => {
    setCurrentPage(currentPage);
    setOffset((currentPage - 1) * limit);
  };

  const onSearch = (value: string) => {
      setOffset(0);
      setCurrentPage(1);
      setSearch(value);
      setFilterBy(CONSTANTS.FILTER_BY.SEARCH_TEXT);
  };

  const dateSearch = (dateType: string, date: Date) => {
    setOffset(0);
    setCurrentPage(1);
    dateType === 'startDate' && setStartDate(date);
    dateType === 'endDate' && setEndDate(date);
    setFilterBy(CONSTANTS.FILTER_BY.DATE_RANGE);
  };

  const renderAddModal = () => {
    return (
      <Modal divId="fullscreenModal">
        <div className={styles.modalContainer}>
          <div className={styles.headingStyle}>Add New Template</div>
          <div className={styles.rows}>
            <div>
              <Entry
                id="template"
                type="text"
                styleClass={styles.inputStyle}
                placeholder="Enter Template Name"
                value={template}
                onChange={onTemplate}
              />
              {error.template && <small className={styles.error}>Please enter template name</small>}
            </div>
            <div>
              <Select
                isMulti
                onChange={onPropertyChange}
                value={property}
                placeholder="Select Property"
                options={propertyData}
              />
              {error.property && <small className={styles.error}>Please select property</small>}
            </div>
          </div>
          <div className={styles.rows}>
            <div className={styles.startbumper}>
              <label>Upload Start Bumper</label>
              <br />
              <div className={styles.uploadFileWrapper}>
                {/**style={{ border: error.uploadFile ? '1px solid red' : '' }} */}
                <input
                  className={styles.fileName}
                  value={startBumper.fileName}
                  disabled
                />
                <label className={styles.upload}>
                  <input
                    type="file"
                    onChange={(e) => onStartBumperChange(e)}
                    accept='video/mp4'
                  />
                  <UploadIcon />
                </label>
                <Button
                  id="preview"
                  buttonType="secondary"
                  styleClass={styles.previewBtnStyle}
                  onClick={showStartModal}
                > Preview
                </Button>
              </div>
              {error.startBumper && <small className={styles.error}>Please select a file</small>}
              {error.fileType1 && <small className={styles.error}>Please select valid .mp4 file</small>}
                
            </div>
            <div className={styles.endbumper}>
              <label>Upload End Bumper</label>
              <br />
              <div className={styles.uploadFileWrapper}>
                <input
                  className={styles.fileName}
                  value={endBumper.fileName}
                  disabled
                />
                <label className={styles.upload}>
                  <input
                    type="file"
                    onChange={(e) => onEndBumperChange(e)}
                    accept='video/mp4'
                  />
                  <UploadIcon />
                </label>
                <Button
                  id="preview"
                  buttonType="secondary"
                  styleClass={styles.previewBtnStyle}
                  onClick={() => setVideoPreviewModal2((state) => !state)}>
                  Preview
                </Button>
              </div>
              {error.endBumper && <small className={styles.error}>Please select a file</small>}
              {error.fileType2 && <small className={styles.error}>Please select valid .mp4 file</small>}
            </div>
          </div>
          <div className={styles.rows}>
            <div id='buttonWrapper'>
              <Button
                id="save"
                buttonType="primary"
                disabled={loading}
                styleClass={styles.modalButtonStyle}
                onClick={onSave }
                showLoader={loading}
              >
                Save
              </Button>
              
              <Button
                id="cancel"
                buttonType="secondary"
                styleClass={styles.modalButtonStyle}
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <Breadcrumb />
          <Entry
            id="search"
            styleClass={styles.searchBar}
            value={search}
            onChange={(e) => { onSearch(e.target.value); }}
          />
          <div className={styles.datePickerWrapper}>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) =>
                date && dateSearch('startDate', date)
              }
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat={DATE_FORMAT.SHORT_DATE_FORMAT}
              placeholderText={DATE_FORMAT.STANDARD_DATE_FORMAT}
              className={`${styles.startDate} ${styles.datepickerInput}`}
              maxDate={new Date()}
            />
            <span style={{ paddingRight: '0.8em' }}>-</span>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) =>
                date && dateSearch('endDate', date)
              }
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat={DATE_FORMAT.SHORT_DATE_FORMAT}
              placeholderText={DATE_FORMAT.STANDARD_DATE_FORMAT}
              className={styles.datepickerInput}
              maxDate={new Date()}
            />
            <CalendarIcon className={styles.calendarIcon} />
          </div>

          <Button
            buttonType="primary"
            styleClass={styles.addNewTemplateButton}
            id={'addnewtemplates'}
            onClick={showTemplateModal}
          >
            Add New Template
          </Button>
        </div>
        <Table
          headerData={headers}
          data={data}
          limit={limit}
          onActionClick={onActionClick}
          onMenuClick={onMenuClick}
          onPaginatonClick={onPaginatonClick}
          paginationButtonNo={3}
          showActionColumn
          showViewAction={false}
          showPagination
          currentPage={currentPage}
          totalRecords={totalCount}
          showStatusMenu={false}
        />
      </div>
      {renderModal && renderAddModal()}

      {renderDeleteBox && <Modal divId={'fullscreenModal'}>
          <div className={styles.deleteContainer}>
              <h4>
                  Are you sure you want to delete this template?
              </h4>
              <div className="deleteSplit">
                  <Button id={styles.delete} buttonType={'primary'} onClick={onDelete}>
                      Yes
                  </Button>
                  <Button id={styles.cancelDelete} buttonType={'secondary'} onClick={onDeleteCancel}>
                      Cancel
                  </Button>
              </div>
          </div>
      </Modal>}
      {videoPreviewModal && startPreview()}
      {videoPreviewModal2 && (
        <VideoPreviewModal
            uploadedFromComputer={endBumper.uploadedFromComputer}
            fileName={endBumper.fileName}
            videoSrc={endBumper.file|| ''}
            onCloseClick={() => setVideoPreviewModal2((state) => !state)}
        />
      )}
            
      {popupMessage.show && (
          <MessagePopup message={popupMessage.msg} onCloseClick={() => setPopupMessage({ show: false, msg: '' })} />
      )}
     
    </>
  );
};

export default Template;
