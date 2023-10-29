import { emailRegex, floatRegex, intRegex,passwordRegex } from '../constants/regex';
import isEmpty from './isEmpty';

export const isInteger = (string: string): boolean => intRegex.test(string) || isEmpty(string);

export const isFloat = (string: string): boolean => floatRegex.test(string) || isEmpty(string);

export const isEmail = (string: string): boolean => emailRegex.test(string) || isEmpty(string);

export const isPassword=(string: string): boolean =>passwordRegex.test(string) || isEmpty(string);