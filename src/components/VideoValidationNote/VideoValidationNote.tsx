import styles from './VideoValidationNote.module.scss';

const VideoValidationNote = (): JSX.Element => {

    return (
        <>
            <div className={styles.tableWrapper}>
                <h5>Note: If you wish to push this video to Twitter/ Instagram/ YouTube then it should follow below validations:</h5>
                <table className={styles.tableStyle}>
                    <thead>
                        <tr>
                            <th rowSpan={2}>Platform</th>
                            <th rowSpan={2}>File Size</th>
                            <th rowSpan={2}>Duration</th>
                            <th colSpan={2}>
                                Resolution
                            </th>
                        </tr>
                        <tr>
                            <th>Min/Max</th>
                            <th>Recommended</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Twitter</td>
                            <td>512 Mb</td>
                            <td>min: 0.5s/ max: 140s</td>
                            <td>min: 32 x 32 px/ max: 1280 x 1024 px</td>
                            <td>1280 x 720 px/ 720 x 1280 px/ 720 x 720 px</td>
                        </tr>
                        <tr>
                            <td>Instagram</td>
                            <td>100 Mb</td>
                            <td>min: 3s/ max: 59s</td>
                            <td>max: 1920 px (horizontal)</td>
                            <td>Not specified</td>
                        </tr>
                        <tr>
                            <td>YouTube</td>
                            <td>max 2 Gb</td>
                            <td>15 min (unverified users)/ 12 hrs (verified users; file size limit still applies) </td>
                            <td>Not specified</td>
                            <td>3840 x 2160 px/ 2560 x 1440 px/ 1920 x 1080 px/ 1280 x 720 px/ 854 x 480 px/ 640 x 360 px/ 426 x 240 px</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default VideoValidationNote;
