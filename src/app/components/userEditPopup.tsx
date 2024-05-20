'use client'
import Input from 'react-phone-number-input/input';
import {useState} from 'react';
import './userEditPopup.css'
import {User} from '@/app/components/user';
import {editUser, addUser} from '@/app/components/fetch';
import {ErrorPopup} from '@/app/components/errorPopup';
import {emptyUser} from '@/app/components/emptyUser';

function TextField({propName, value, onValueChanged}: {
    propName: string,
    value: string,
    onValueChanged: (prop: string) => any
}) {
    const [inputValue, setInputValue] = useState(value);
    const [valueChanged, setValueChanged] = useState(false);

    function changeValue(v: string) {
        setInputValue(v);
        setValueChanged(true);
    }

    return (
        <tr>
            <td>
                <p className='cell1'>{propName}</p>
            </td>
            <td>
                <input className='inp' value={valueChanged ? inputValue : value} onChange={(e) => {
                    onValueChanged(e.target.value);
                    changeValue(e.target.value)
                }}></input>
            </td>
        </tr>
    )
}

export function UserEditPopup({user, hidden, onCloseButtonClicked, onUserCreated}: {
    user: User,
    hidden: boolean,
    onCloseButtonClicked: () => any,
    onUserCreated: (user: User) => any
}) {
    const [mobilePhoneNumber, setMobilePhoneNumber] = useState(user.mobilePhoneNumber);
    const [isError, setIsError] = useState(false);
    const [mobilePhoneNumberChanged, setMobilePhoneNumberChanged] = useState(false);
    const [workPhoneNumber, setWorkPhoneNumber] = useState(user.workPhoneNumber);
    const [workPhoneNumberChanged, setWorkPhoneNumberChanged] = useState(false);

    function setUserProperty(property: string, value: string) {
        (user as any)[property] = value;
    }

    function saveUser() {
        let promise = null;
        if (mobilePhoneNumberChanged) {
            user.mobilePhoneNumber = mobilePhoneNumber;
        }
        if (workPhoneNumberChanged) {
            user.workPhoneNumber = workPhoneNumber;
        }
        if (user.id != -1) {
            promise = editUser(user);
        } else {
            promise = addUser(user);
        }
        promise.then((response) => {
            if (response.status === 200) {
                if (user.id == -1) {
                    onUserCreated(user);
                }
                user = emptyUser;
                onCloseButtonClicked();
                setMobilePhoneNumberChanged(false);
                setWorkPhoneNumberChanged(false);
            }
        }).catch(() => {
            setIsError(true);
            setTimeout(() => {
                setIsError(false)
            }, 5000);
        })
    }

    return (
        <div className={'backdrop ' + (hidden ? 'hiddenDiv' : '')}>
            <div className='popupContainer'>
                <button onClick={() => {
                    onCloseButtonClicked();
                    setMobilePhoneNumberChanged(false)
                }} className='controlButton'>Закрыть
                </button>
                <table className='data'>
                    <tbody>
                    <TextField key={user.id + 9} propName='Username' value={user.username} onValueChanged={(e) => {
                        setUserProperty('username', e)
                    }}></TextField>
                    <TextField key={user.id} propName='Имя' value={user.firstName} onValueChanged={(e) => {
                        setUserProperty('firstName', e)
                    }}></TextField>
                    <TextField key={user.id + 1} propName='Фамилия' value={user.lastName} onValueChanged={(e) => {
                        setUserProperty('lastName', e)
                    }}></TextField>
                    <TextField key={user.id + 2} propName='Отчество' value={user.fatherName} onValueChanged={(e) => {
                        setUserProperty('fatherName', e)
                    }}></TextField>
                    <tr>
                        <td>
                            <p className='cell1'>
                                Рабочий номер
                            </p>
                        </td>
                        <td>
                            <Input key={user.id + 17}
                                   value={user.workPhoneNumber}
                                   onChange={(e) => {
                                       setWorkPhoneNumber(e as string);
                                       setWorkPhoneNumberChanged(true)
                                   }}
                                   className='inp'/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className='cell1'>
                                Мобильный номер
                            </p>
                        </td>
                        <td>
                            <Input key={user.id + 16}
                                   value={user.mobilePhoneNumber}
                                   onChange={(e) => {
                                       setMobilePhoneNumber(e as string);
                                       setMobilePhoneNumberChanged(true)
                                   }}
                                   className='inp'/>
                        </td>
                    </tr>

                    <TextField key={user.id + 4} propName='Дирекция' value={user.directorate} onValueChanged={(e) => {
                        setUserProperty('directorate', e)
                    }}/>
                    <TextField key={user.id + 5} propName='Департамент' value={user.department} onValueChanged={(e) => {
                        setUserProperty('department', e)
                    }}/>
                    <TextField key={user.id + 6} propName='Отдел' value={user.unit} onValueChanged={(e) => {
                        setUserProperty('unit', e)
                    }}/>
                    <TextField key={user.id + 7} propName='Служба' value={user.service} onValueChanged={(e) => {
                        setUserProperty('service', e)
                    }}/>
                    <TextField key={user.id + 8} propName='Должность' value={user.jobTitle} onValueChanged={(e) => {
                        setUserProperty('jobTitle', e)
                    }}/>
                    </tbody>
                </table>
                <button className='controlButton' onClick={saveUser}>Сохранить пользователя</button>
                <ErrorPopup hidden={!isError} errorMessage="Не удалось сохранить пользователя"
                            onCloseButtonClicked={() => {
                                setIsError(false)
                            }}></ErrorPopup>
            </div>
        </div>
    )
}