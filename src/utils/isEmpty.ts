/**
 * Returns true if value is empty or undefined or null or zero
 * @param {string | null | undefined | number} value
 */
const isEmpty = (value: string | null | undefined | number): boolean =>
    value === '' ||
    value === undefined ||
    value === null ||
    value === 0;

export default isEmpty;