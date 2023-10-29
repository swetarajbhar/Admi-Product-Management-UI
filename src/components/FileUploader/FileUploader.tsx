import { ChangeEvent } from 'react';
import styles from './FileUploader.module.scss';
import { ReactComponent as UploadIcon } from '../../assets/SVG/uploadIcon.svg';

interface IFileUploader {
    error?: boolean
    fileName: string
    accept: string
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const FileUploader = ({ error = false, fileName, accept, onChange }: IFileUploader): JSX.Element => {

    return (
        <div className={styles.uploadFileWrapper} style={{ border: error ? '1px solid red' : '' }}>
            <input className={styles.fileName} value={fileName} disabled />
            <label className={styles.upload}>
                <input type="file" onChange={onChange} accept={accept} />
                <UploadIcon />
            </label>
        </div>
    );
};

export default FileUploader;
