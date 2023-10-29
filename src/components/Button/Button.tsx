import { MouseEvent, ReactNode } from 'react';
import styles from './Button.module.scss';

type ButtonProps = {
    id: string,
    buttonType?: 'primary' | 'secondary' | '',
    styleClass?: string,
    children?: ReactNode,
    disabled?: boolean
    onClick: (e: MouseEvent<HTMLButtonElement>) => void
    showTitle?: boolean,
    showLoader?: boolean,
}

const Button = ({ id, buttonType = '', styleClass = '', disabled = false, children, onClick, showTitle = false, showLoader = false }: ButtonProps): JSX.Element => {
    return (
        <button id={id} className={`${buttonType}Button ${styleClass}`} type="button" onClick={onClick} disabled={disabled} title={(disabled && showTitle) ? 'This record is deleted' : ''}>
            {children}
            
            {showLoader && <div className={styles.loader} />}
        </button>
    );
};

export default Button;
