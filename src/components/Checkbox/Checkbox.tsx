import TUserInputType from '../../types/UserInputType';
import './Checkbox.module.scss';

type CheckBoxProps = {
    checked: boolean
}

const Checkbox = ({
    id,
    name,
    value,
    onChange,
    onFocus,
    checked }: CheckBoxProps & TUserInputType): JSX.Element => {
    return (
        <>
            <div className="split">
                <input
                    id={id}
                    checked={checked}
                    type="checkbox"
                    name={name}
                    onChange={onChange}
                    onFocus={onFocus}
                />
                <label htmlFor={id}>{value}</label>
            </div>
        </>
    );
};

export default Checkbox;
