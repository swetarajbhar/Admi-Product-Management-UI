import { ReactComponent as VideoIcon } from '../../assets/SVG/videocam.svg';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Button from '../../components/Button/Button';
import styles from './Notification.module.scss';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { clearAllNotifications, getNotificationList } from '../../api/notification';

interface NotificationData {
    [key: string]: string | number | undefined | null;
}

const Notification = (): JSX.Element => {
    const [data, setData] = useState<Array<NotificationData>>([]);

    useEffect(() => {
        notificationList();
    }, []);

    const notificationList = async () => {
        const res = await getNotificationList();
        if(res.status === 200) {
            setData(res.data || []);
        } else {
            console.error('error',res.error);
        }
    };

    const onClearAllClick = () => {
        const notificationId: any = [];
        data.forEach((x) => {
            !x.isSeen && notificationId.push(x.id);
        });
        if(notificationId.length > 0) {
            clearAllNotifications({notification_id: notificationId})
            .then(() => {
                notificationList();
              }).catch((err) => {
                console.error('err', err);
              });  
        }      
    };

    return (
        <>
            <div className={styles.title}>
                <Breadcrumb />
                <Button id='clearNotification' styleClass={styles.clearAll} onClick={onClearAllClick}>
                    Clear all Notifications
                </Button>
            </div>
            <div className={styles.content}>
                {data.map((x, i) => (
                    <div key={i} className={styles.notification}>
                        <div className={cx(styles.notificationText, {[styles.grayText]: x.isSeen})}>
                            <VideoIcon className={cx(styles.videoIcon, {[styles.grayBg]: x.isSeen})} />
                            {x.notification}
                        </div>
                        <div className={styles.grayText}>{x.createdAt}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Notification;