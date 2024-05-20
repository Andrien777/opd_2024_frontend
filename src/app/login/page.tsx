'use client'
import {useEffect, useState} from "react";
import {LoginTextInput} from "@/app/login/loginTextInput";
import {useRouter} from "next/navigation";
import {get_token} from "@/app/components/fetch";
import './login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [ok, setOk] = useState(true);
    const router = useRouter();

    useEffect(() => {
        document.title = 'Вход';
    }, []);

    function tryLogin() {
        const response = get_token(username, password)
            .then((token: { jsonify: () => string; }) => {
                localStorage.setItem("token", token.jsonify());
                router.push("/dashboard");
            })
            .catch(() => {
                setOk(false);
            });
    }

    return (
        <div className={"loginParent"}>
            <div className={'main'}>Вход</div>
            <div className={'container'}>Имя пользователя: <LoginTextInput type={'text'} onChangeValid={setUsername}/>
            </div>
            <div className={'container'}>Пароль: <LoginTextInput type={'password'} onChangeValid={setPassword}/></div>
            {!ok ? <div className={"err"}>Неверное имя пользователя или пароль</div> : ""}
            <div className={'container'}>
                <button onClick={tryLogin} className={'submitButton'}>Войти</button>
            </div>
        </div>
    )
}