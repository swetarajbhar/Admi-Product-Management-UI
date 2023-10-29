import { ChangeEvent, ReactNode, useRef } from 'react';
import styles from './FileUpload.module.scss';

interface IFileUploadProps {
    children?: ReactNode;
    onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
    fileType: 'video/*,.mp4' | 'image/*,.jpg/png';
}

const FileUpload = ({ children, onFileSelect, fileType }: IFileUploadProps): JSX.Element => {
    const fileUpload = useRef<HTMLInputElement | null>(null);

    const onClick = () => {
        fileUpload.current?.click();
    };

    return (
        <>
            <div className={styles.container}>
                <input
                    ref={fileUpload}
                    type="file"
                    name="file"
                    id="file"
                    accept={fileType}
                    onChange={onFileSelect}
                />
            </div>
            {children}
        </>
    );
};

export default FileUpload;
