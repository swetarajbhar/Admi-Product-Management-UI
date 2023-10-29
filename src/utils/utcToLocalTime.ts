import moment from 'moment';

// dateTime in 2023-07-18 05:06:53 format
export const utcToLocal = (dateTime: string): string => {
    if (!dateTime) return '';
    const dateObj = moment.utc(dateTime).toDate();
    const local = moment(dateObj).local().format('YYYY-MM-DD HH:mm:ss');
    return local;
};