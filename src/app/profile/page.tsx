'use client'
import Input from 'react-phone-number-input/input';
import {useState, useEffect} from 'react';
import './profile.css'
import {Header} from '@/app/components/header'
import {useRouter} from "next/navigation";
import {emptyUser} from '@/app/components/emptyUser';
import {getUserData, updatePhoneNumber} from '@/app/components/fetch';
import {ErrorPopup} from '@/app/components/errorPopup';

function TableField({name, value}: { name: string, value: string }) {
    return (
        <tr>
            <td>
                <p className='cell1'>{name}</p>
            </td>
            <td>
                <p className='cell2'>{value}</p>
            </td>
        </tr>
    )
}

export default function editProfile() {
    const [errorMessageText, setErrorMessageText] = useState('');
    const [isError, setIsError] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [mobilePhoneNumber, setMobilePhoneNumber] = useState('');
    const [initialPhoneNumber, setInitialPhoneNumber] = useState('');
    const router = useRouter();
    useEffect(() => {
        let promise = getUserData();
        promise.then((response) => {
            setUser(response.data);
            setSaveButtonDisabled(false);
            setInitialPhoneNumber(response.data.mobilePhoneNumber);
            setMobilePhoneNumber(response.data.mobilePhoneNumber);
            setIsError(false);
        }).catch((error) => {
            setErrorMessageText(error.message);
            setIsError(true);
            router.replace("/login");
        })
    }, [])

    function saveMode() {
        let promise = updatePhoneNumber(mobilePhoneNumber);
        promise.then((response) => {
            setUser(response.data);
            setInitialPhoneNumber(response.data.mobilePhoneNumber);
            setSaveButtonDisabled(true);

        }).catch((error) => {
            setErrorMessageText(error.message);
            setIsError(true);
        })
    }

    function onMobilePhoneNumberChanged(e: any) {
        setMobilePhoneNumber(e)
    }

    return (
        <div>

            <title>Профиль</title>

            <Header username={user.username}></Header>
            <ErrorPopup errorMessage={errorMessageText} onCloseButtonClicked={() => {
                setIsError(false)
            }} hidden={!isError}></ErrorPopup>
            <button className={'saveMode' + (saveButtonDisabled ? ' disabledButton' : '')} onClick={() => {
                if (!saveButtonDisabled) {
                    saveMode()
                }
            }}>Сохранить
            </button>
            <table className='data'>
                <tbody>
                <TableField name='Фамилия' value={user.lastName}/>
                <TableField name='Имя' value={user.firstName}/>
                <TableField name='Отчество' value={user.fatherName}/>
                <TableField name='Рабочий номер' value={user.workPhoneNumber}/>
                <tr>
                    <td><p className='cell1'>
                        Мобильный телефон
                    </p>
                    </td>
                    <td>
                        <Input
                            value={initialPhoneNumber}
                            onChange={onMobilePhoneNumberChanged}
                            className='inp'/>
                    </td>
                </tr>
                <TableField name='Дирекция' value={user.directorate}/>
                <TableField name='Департамент' value={user.department}/>
                <TableField name='Отдел' value={user.unit}/>
                <TableField name='Служба' value={user.service}/>
                <TableField name='Должность' value={user.jobTitle}/>
                </tbody>
            </table>
        </div>
    )
}