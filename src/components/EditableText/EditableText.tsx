import styles from './EditableText.module.scss';
import { useEffect, useState } from 'react';

type TextProp = {
    id: number,
    data: any
    onSubtitleChange: (id: number, text: any) => void
}

const EditableText = ({ id, data = '', onSubtitleChange }: TextProp): JSX.Element => {

    const [text, setText] = useState('');
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        data && setText(data);
    }, [data]);

    const onChange = (e: any) => {
        setText(e.target.value);
    };

    const onKeyUp = (e: any) => {
        const key = e.keyCode;
        // enter key
        if (key === 13) {
            const newText = text.trim();
            if (!newText) return;

            setText(newText);
            setEditable(false);
            onSubtitleChange(id, newText);
        }
    };

    const onClick = (e: any) => {
        // for double click event
        if (e.detail === 2) setEditable(true);
    };

    return (
        <div className={styles.container} onClick={onClick}>
            {editable ? (
                <input
                    id={id.toString()}
                    type="text"
                    className={styles.inputStyle}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    value={text}
                />
            ) : (
                text
            )}
        </div>
    );
};

export default EditableText;
