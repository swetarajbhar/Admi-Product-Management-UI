import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { forgotPassword } from '../../api/auth';
import OttohmLogo from '../../assets/PNG/ottohmLogo.png';
import { ReactComponent as ZeeNewsLogo } from '../../assets/SVG/logo.svg';
import Button from '../../components/Button/Button';
import Entry from '../../components/Entry/Entry';
import Modal from '../../components/Modal/Modal';
import LOCALSTORAGE from '../../constants/LOCALSTORAGE';
import isEmpty from '../../utils/isEmpty';
import { isEmail } from '../../utils/regexCheck';
import { LOGIN } from '../../utils/routes';
import styles from './ForgotPassword.module.scss';

interface TForgotPasswordForm {
    email: string
}

const ForgotPassword = (): JSX.Element => {
    const [form, setForm] = useState<TForgotPasswordForm>({ email: '' });
    const [displayModal, setDisplayModal] = useState(false);
    const [errors, setErrors] = useState<Array<keyof TForgotPasswordForm>>([]);
    const history = useHistory();

    useEffect(() => {
        if (localStorage.length !== 0 && localStorage.getItem(LOCALSTORAGE.IS_AUTHENTICATED) !== null && localStorage.getItem(LOCALSTORAGE.IS_AUTHENTICATED) === 'true') {
            localStorage.clear();
            localStorage.setItem(LOCALSTORAGE.IS_AUTHENTICATED, 'false');
        }
    },[]);

    const onChange = (name: keyof TForgotPasswordForm, value: string) => {
        setForm((state) => ({
            ...state,
            [name]: value
        }));
        if (errors.includes(name)) {
            setErrors([...[...errors].filter(x => x !== name)]);
        }
    };

    const onCancelClick = () => {
        history.push(LOGIN);
    };

    const isValid = () => {
        const errors: Array<keyof TForgotPasswordForm> = [];
        if (isEmpty(form.email) || !isEmail(form.email)) {
            errors.push('email');
        }
        return errors;
    };

    const onSubmitClick = async () => {
        const _errors = isValid();
        if (isEmpty(_errors.length)) {
            const response = await forgotPassword({ email: form.email });
            if (response.status === 200) {
                setDisplayModal(true);
            } else {
                // TODO: show error message
            }
        } else {
            setErrors([..._errors]);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.forgotPasswordContainer}>
                    <section>
                        {/* <ZeeNewsLogo /> */}
                        <div className={styles.body}>
                            <h3>Forgot Password</h3>
                            <h5>Please Enter Your Email Address for reset your password.</h5>
                            <Entry id='emailID'
                                label={'Email Address'}
                                value={form.email}
                                errorMessage={errors.includes('email') ? 'Please enter valid Email ID' : ''}
                                onChange={(e) => onChange('email', e.target.value)}
                            />
                            <Button
                                buttonType="primary"
                                id={'login'}
                                onClick={onSubmitClick}>
                                Submit
                            </Button>
                            <Button
                                buttonType="secondary"
                                id={'login'}
                                onClick={onCancelClick}>
                                Cancel
                            </Button>
                        </div>
                    </section>
                    <div className={cx('split', styles.ottohmLogo)}>
                        <h5>Powered by</h5> <img src={OttohmLogo} alt="Ottohm Logo" />
                    </div>
                </div>
            </div>
            {displayModal && (
                <Modal divId="fullscreenModal">
                    <div className={styles.linkSentContainer}>
                        <h2>Link Sent Successfully</h2>
                        <h5>Reset password link has been sent to the entered email address.</h5>
                        <Button id={'close'} buttonType="primary" onClick={() => { setDisplayModal((state) => !state); }}>
                            Close
                        </Button>
                    </div>
                </Modal>)
            }
        </>
    );
};

export default ForgotPassword;
