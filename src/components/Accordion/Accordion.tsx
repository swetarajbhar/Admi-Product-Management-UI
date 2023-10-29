import { useState } from "react";
import styles from './Accordion.module.scss';
import cx from 'classnames';
import { ReactComponent as DownArrow } from '../../assets/SVG/downArrow.svg';

interface IAccordionProps {
    title: string
    id: string
    children: JSX.Element
    roundedBorder?: boolean
}

const Accordion = ({ children, id, title, roundedBorder = false }: IAccordionProps): JSX.Element => {

    const [showContent, setShowContent] = useState(true);

    return (
        <div id={id} className={cx(styles.container, { [styles.roundedBorder]: roundedBorder })}>
            <div className={cx(styles.accordionTitle, { [styles.open]: showContent })} onClick={() => setShowContent(!showContent)} >
                {title}
                <DownArrow className={cx({ [styles.upArrow]: showContent })} />
            </div>
            <div className={cx(styles.accordionItem, { [styles.collapsed]: !showContent })}>
                <div className={styles.accordionContent}>{children}</div>
            </div>
        </div>
    );
};

export default Accordion;
