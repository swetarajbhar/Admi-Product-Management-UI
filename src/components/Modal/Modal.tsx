import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import isEmpty from '../../utils/isEmpty';

interface IModalProps {
    divId: string
    children: JSX.Element
}

const createElementIfEmpty = (divID: string) => {
    if (isEmpty(document.getElementById(divID)?.innerHTML)) {
        const modalElement = document.createElement('div');
        modalElement.id = divID;
        document.getElementById('root')?.appendChild(modalElement);
    }
};

const Modal = ({ children, divId }: IModalProps): JSX.Element => {

    const removeActiveClass = () => {
        (document.getElementById(divId) as HTMLElement).classList.remove('active');
    };

    useEffect(() => {
        if (children && !isEmpty(document.getElementById(divId)?.innerHTML)) {
            (document.getElementById(divId) as HTMLElement).className = 'active';
        } else {
            removeActiveClass();
        }
        return () => {
            removeActiveClass();
        };
    }, [children]);

    createElementIfEmpty(divId);

    return <>{ReactDOM.createPortal(children, (document.getElementById(divId) as HTMLElement))}</>;
};

export default Modal;
