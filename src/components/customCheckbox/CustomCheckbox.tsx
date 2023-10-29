import TUserInputType from '../../types/UserInputType';
import styles from './CustomCheckbox.module.scss';
import { ReactComponent as CheckboxChecked } from '../../assets/SVG/checkboxChecked.svg';
import { ReactComponent as CheckboxUnchecked } from '../../assets/SVG/checkbocUnchecked.svg';


type CheckBoxProps = {
    checked: boolean,
    disabled?: boolean,
}

const CustomCheckbox = ({
    id,
    value,
    onChange,
    checked,
    disabled = false }: CheckBoxProps & TUserInputType): JSX.Element => {
    return (
        <>
            <label className={styles.checkboxWrapper}>
                {checked ? <CheckboxChecked /> : <CheckboxUnchecked />}
                {value}
                <input type="checkbox" id={id} className={styles.hideCheckbox} checked={checked} onChange={onChange} disabled={disabled} />
            </label>
        </>
    );
};

export default CustomCheckbox;
