import cx from 'classnames';
import { ReactNode, useState } from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import styles from './Section.module.scss';

type SectionProps = {
    children: ReactNode,
    onChange: (startTime: number, endTime: number) => void
}

const singleFrameWidth = 80;
const border = 70;
const singleFrameWithBorder = singleFrameWidth + border;
const thumbnailGap = 1;

const Section = ({ children, onChange }: SectionProps): JSX.Element => {
    // const [absoluteHeight, setAbsoluteHeight] = useState(56);
    // const [absoluteTop, setAbsoluteTop] = useState(100);
    const [absoluteWidth, setAbsoluteWidth] = useState(1 * singleFrameWithBorder);
    const [absoluteLeft, setAbsoluteLeft] = useState(0);

    const onResizeAbsolute = (event: any, { element, size, handle }: any) => {
        let newLeft = absoluteLeft;
        const deltaWidth = size.width - absoluteWidth;
        let newWidth = absoluteWidth;
        if (handle[handle.length - 1] === 'w') {
            if (newLeft - deltaWidth >= 0) {
                newLeft -= deltaWidth;
                newWidth = size.width;
            }
        } else if (handle[handle.length - 1] === 'e') {
            // newLeft += deltaWidth;
            newWidth = size.width;
        }
        const endTime = (newLeft + size.width - border - thumbnailGap) / singleFrameWidth;
        const startTime = newLeft / singleFrameWidth;

        // setAbsoluteHeight(size.height);
        setAbsoluteWidth(newWidth);
        setAbsoluteLeft(newLeft);
        onChange(startTime, endTime);
    };

    return (
        <div className={cx('split', styles.container)}>
            <Resizable
                className="box absolutely-positioned"
                height={56}
                width={absoluteWidth}
                onResize={onResizeAbsolute}
                resizeHandles={['w', 'e']}
            >
                <div className={styles.selection} style={{
                    width: absoluteWidth,
                    left: absoluteLeft
                    // margin: `${absoluteTop} 0 0 ${absoluteLeft}`,
                }}>
                    <div className={cx(styles.tracker, styles.leftPanel)} />
                    <div className={cx(styles.background, styles.top)} />
                    <div className={cx(styles.background, styles.bottom)} style={{ width: `${absoluteWidth - 54}px` }} />
                    <div className={cx(styles.tracker, styles.rightPanel)} />
                </div>
            </Resizable>
            {children}
        </div>
    );
};

export default Section;