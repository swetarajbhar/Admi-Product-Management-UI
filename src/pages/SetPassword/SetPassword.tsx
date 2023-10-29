import cx from 'classnames';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { setPassword } from '../../api/auth';
import OttohmLogo from '../../assets/PNG/ottohmLogo.png';
import { ReactComponent as ZeeNewsLogo } from '../../assets/SVG/logo.svg';
import Button from '../../components/Button/Button';
import Entry from '../../components/Entry/Entry';
import isEmpty from '../../utils/isEmpty';
import { LOGIN } from '../../utils/routes';
import styles from './SetPassword.module.scss';
import { isPassword } from '../../utils/regexCheck';
import MessagePopup from '../../components/MessagePopup/MessagePopup'; 
interface TSetPasswordForm {
    newPassword: string
    confirmNewPassword: string
}

let token = '';

const ForgotPassword = (): JSX.Element => {
    const [form, setForm] = useState<TSetPasswordForm>({ newPassword: '', confirmNewPassword: '' });
    const [errors, setErrors] = useState<Array<keyof TSetPasswordForm | 'diffentPassword'|'NewPassword'>>([]);
    const [popupMessage, setPopupMessage] = useState({
        show: false,
        msg: '',
    });
    const history = useHistory();
    token = useLocation().pathname.split('/')[2].split('=')[1] || '';

    const onChange = (name: keyof TSetPasswordForm, value: string) => {
        setForm((state) => ({
            ...state,
            [name]: value
        }));
        if (errors.includes(name)) {
            setErrors([...[...errors].filter(x => x !== name)]);
        }
    };

    const isValid = () => {
        const errors: Array<keyof TSetPasswordForm | 'diffentPassword'|'NewPassword'> = [];
        if (isEmpty(form.newPassword)||(!isPassword(form.newPassword))) {
            errors.push('newPassword');}
        if (isEmpty(form.confirmNewPassword)) {
            errors.push('confirmNewPassword');
        } else if (form.confirmNewPassword !== form.newPassword) {
            errors.push('diffentPassword');
        }
        return errors;
    };

    const onSubmitClick = async () => {
        const _errors = isValid();
        if (isEmpty(_errors.length)) {
            const response = await setPassword(token, { password: form.newPassword, confirm_password: form.confirmNewPassword });
            if (response.status === 200) {
                history.push(LOGIN);
            } else {
                setPopupMessage({ show: true, msg: 'Some Error Occured Please Try Again Later!' });
            }
        } else {
            setErrors([..._errors]);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.setPasswordContainer}>
                    <section>
                        {/* <ZeeNewsLogo /> */}
                        <div className={styles.body}>
                            <h3>Set Password</h3>
                            <div>
                            <Entry
                                id='newPassword'
                                type='password'
                                label={'New Password'}
                                value={form.newPassword}
                                errorMessage={errors.includes('newPassword') ? 'New password cannot be empty' 
                                :''}
                                onChange={(e) => onChange('newPassword', e.target.value)}
                               
                            />
                            {(!isPassword(form.newPassword))
                                ? <span className={styles.error}>
                                    Password should contain at least one upper case, lower case, special character,
                                    number and at least 8 characters
                                  </span>
                                : '' }
                            </div>
                            
                            <Entry
                                id='confirmNewPassword'
                                type='password'
                                label={'Confirm New Password'}
                                value={form.confirmNewPassword}
                                errorMessage={
                                    errors.includes('confirmNewPassword')
                                        ? 'Confirm password cannot be empty'
                                        : errors.includes('diffentPassword')
                                            ? 'Passwords do not match'
                                            : ''}
                                onChange={(e) => onChange('confirmNewPassword', e.target.value)}
                            />
                            <Button
                                buttonType="primary"
                                id={'login'}
                                onClick={onSubmitClick}>
                                Submit
                            </Button>
                        </div>
                    </section>
                    <div className={cx('logoSplit', styles.ottohmLogo)}>
                        <h5>Powered by</h5> <img src={OttohmLogo} alt="Ottohm Logo" />
                    </div>
                </div>
                
                {popupMessage.show && 
                 (<MessagePopup message={popupMessage.msg} onCloseClick={() => setPopupMessage({ show: false, msg: '' })} />
                )}
            </div>
        </>
    );
};

export default ForgotPassword;
