import styles from './Tag.module.scss';
import { useEffect, useState } from 'react';

type TagProp = {
    data: any
    onTagChange: (string: any) => void
    placeholder: string
    disabled?: boolean
}

const Tag = ({ data, onTagChange, placeholder, disabled = false }: TagProp): JSX.Element => {

    const [newTag, setNewTag] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    useEffect(()=>{
        data && setTags(data);
    },[data]);

    const onChange = (e: any) => {
        setNewTag(e.target.value);
    };

    const onKeyDown = (e: any) => {        
        const key = e.keyCode;
        // backspace
        if (key === 8 && !newTag) {
            const updatedTags = tags;
            const tag = updatedTags.pop();
            setNewTag(tag || '');
            setTags(updatedTags);
            onTagChange(updatedTags);
        }
    };

    const onKeyUp = (e: any) => {
        const key = e.keyCode;
        // enter key
        if (key === 13) {
            const tag = newTag.trim();
            if (!tag) return;
            
            const oldTag = tags;
            const updatedTags = [...oldTag, tag];
            setTags(updatedTags);
            setNewTag('');
            onTagChange(updatedTags);
        }
    };

    return (
        <div className={styles.container}>
            {tags.map((x: any) => x).join(', ')}
            {!disabled && (
            <input type="text"
                className={styles.inputStyle}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                placeholder={placeholder}
                value={newTag}
                disabled={disabled}
            />)}
        </div>
    );
};

export default Tag;
