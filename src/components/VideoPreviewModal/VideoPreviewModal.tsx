import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import styles from './VideoPreviewModal.module.scss';


type ModalProps = {
    fileName: string,
    videoSrc: any,
    uploadedFromComputer?: boolean,
    onCloseClick: () => void,
}

const VideoPreviewModal = ({ fileName, videoSrc, uploadedFromComputer = false, onCloseClick }: ModalProps): JSX.Element => {
    return (
        <Modal divId="fullscreenModal"> 
            <div className={styles.videoPreviewContainer}>
                {videoSrc !== '' ? (
                    <video width='100%' height='100%' controls key={fileName}>
                        <source src={uploadedFromComputer ? URL.createObjectURL(videoSrc) : videoSrc}/>
                    </video>
                ) : <h5 style={{ color: 'red',  display: 'flex', justifyContent:'center', marginTop: '40vh' }}>Video preview is not available</h5>}
                <Button id="closePreviewModal" styleClass={styles.closePreviewModal} onClick={onCloseClick} />
            </div>
        </Modal>        
    );
};

export default VideoPreviewModal;
