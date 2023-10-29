import cx from 'classnames';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { ReactComponent as PasswordLookUpIcon } from '../../assets/SVG/passwordPeek.svg';
import TUserInputType from '../../types/UserInputType';
import Button from '../Button/Button';
import styles from './Entry.module.scss';

type EntryProps = {
    label?: string;
    type?: 'text' | 'password'|'number';
    errorMessage?: string;
    placeholder?: string;
    disabled?: boolean;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
    onKeyUp?: (e: any) => void
    onInput?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Entry = ({
    id,
    name,
    label = '',
    value,
    type = 'text',
    styleClass = '',
    errorMessage = '',
    onChange,
    onFocus,
    onKeyDown,
    onKeyUp,
    onInput,
    placeholder,
    disabled }: EntryProps & TUserInputType): JSX.Element => {

    const [inferredType, setInferredType] = useState(type);

    const onClick = () => {
        if (type === 'password') {
            setInferredType(inferredType === 'password' ? 'text' : 'password');
        }
    };

    return (
        <>
            <div className={cx(styles.container, { [styles.isActive]: value })}>
                {label && <label htmlFor={id}>{label}</label>}
                <input
                    id={id}
                    className={styleClass}
                    name={name}
                    type={inferredType}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    onFocus={onFocus}
                    disabled={disabled}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    onInput={onInput}
                />
                {/*TODO: make button tag absolute and not SVG */}
                {type === 'password' && <Button id='password' onClick={onClick}><PasswordLookUpIcon fill={inferredType === 'password' ? '#dfdfdf' : 'black' } /></Button>}
                {errorMessage && <span style={{ marginTop: '0.2em'}}>{errorMessage}</span>}
            </div>
        </>
    );
};

export default Entry;
