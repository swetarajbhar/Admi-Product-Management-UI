import { useState } from 'react';
import { ReactComponent as DownArrowIcon } from '../../assets/SVG/downArrow.svg';
import { ReactComponent as DownArrowBlackIcon } from '../../assets/SVG/downArrowBlack.svg';
import Button from '../Button/Button';
import styles from './Menu.module.scss';

interface MenuData {
    id: string,
    value: string,
    label: string,
}

type MenuProps = {
    id: string,
    data: Array<MenuData>,
    onMenuItemClick: (value: string) => void,
    blackIcon: boolean,
}

const Menu = ({ id, onMenuItemClick, data, blackIcon }: MenuProps): JSX.Element => {

    const [ showMenu, setShowMenu] = useState(false);

    const showMenuItems = () => {
        return (
            <ul className={styles.menuItemContainer}>
                {data.map((x) => (
                    <li key={x.id} className={styles.menuItem} onClick={() => { setShowMenu(!showMenu); onMenuItemClick(x.value); }}>{x.label}</li>
                ))}
            </ul>
        );
    };
    return (
        <div key={id} className={styles.container} >
            <Button id={id} onClick={() => setShowMenu(!showMenu)}>
                {blackIcon ? <DownArrowBlackIcon /> : <DownArrowIcon height={25} />}                 
            </Button>
            {showMenu && showMenuItems()}
        </div>
    );
};

export default Menu;
