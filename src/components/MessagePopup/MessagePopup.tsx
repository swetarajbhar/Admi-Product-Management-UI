import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import styles from './MessagePopup.module.scss';


type ModalProps = {
    message: string,
    onCloseClick: () => void,
    buttonText?: string
}

const MessagePopup = ({ message, onCloseClick, buttonText = 'Close' }: ModalProps): JSX.Element => {
    return (
        <Modal divId="fullscreenModal">
            <div className={styles.container}>
                <div>{message}</div>
                <Button id="closePreviewModal" buttonType='secondary' styleClass={styles.closePopup} onClick={onCloseClick}>
                    {buttonText}
                </Button>
            </div>
        </Modal>        
    );
};

export default MessagePopup;
