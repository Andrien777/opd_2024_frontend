'use client'


import {ChangeEvent, useState} from "react";

export function LoginTextInput({type, onChangeValid}: { type: string, onChangeValid: (value: string) => void }) {
    const [value, setValue] = useState('')

    function validateAndReturn(event: ChangeEvent<HTMLInputElement>) {
        if ((/^[\w_\-$#@]*$/).test(event.target.value)) {
            setValue(event.target.value);
            onChangeValid(event.target.value);
        }
    }

    return (
        <input type={type} className={'loginTextInput'} value={value} onChange={validateAndReturn}/>
    )
}