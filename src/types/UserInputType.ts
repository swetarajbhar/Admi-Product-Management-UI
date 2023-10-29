import { ChangeEvent } from 'react';

type TUserInputType = {
    id: string;
    value: string;
    name?: string;
    styleClass?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyUp?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default TUserInputType;