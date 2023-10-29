import cx from 'classnames';
import styles from './Thumbnail.module.scss';

type ThumbnailProp = {
    selectedThumbnail: string
    onClick: (string: any) => void
    thumbnailData: any
}

const Thumbnail = ({ selectedThumbnail, onClick, thumbnailData }: ThumbnailProp): JSX.Element => {

    const onThumbnailClick = (s3Url: string) => {
        onClick(s3Url);
    };

    return (
        <div className={styles.container}>
            {thumbnailData.map((x: any) => (
                <div key={x} className={cx(styles.thumbnailItem, { [styles.selectedDiv]: x.s3_url === selectedThumbnail  })} onClick={() => onThumbnailClick(x.s3_url)}>
                    <img src={x.s3_url} alt={x.image_name} height='64' width='78' />
                    <label>{x.image_name}</label>
                </div>
            ))}
        </div>
    );
};

export default Thumbnail;
