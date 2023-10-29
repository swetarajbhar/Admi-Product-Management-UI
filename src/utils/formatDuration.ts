import moment from 'moment';
    
const getTwoDigit = (x: number) => (x.toString().length < 2) ? '0' + x : x.toString();

export const formatTime = (duration: number) => {
    const result: any = moment.duration(duration, 'seconds');
    const ms = getTwoDigit(Math.floor(result._data.milliseconds));
    const newMs = ms.length > 2 ? ms.slice(0, -1) : ms;
    const formatedTime = getTwoDigit(result._data.hours) + ':' + getTwoDigit(result._data.minutes) + ':' + getTwoDigit(result._data.seconds) + ':' + newMs;
    return formatedTime;
};