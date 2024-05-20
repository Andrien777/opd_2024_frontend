'use client'
import {User} from '../components/user';
import {Header} from '@/app/components/header'
import {useState, useEffect, ChangeEvent} from 'react'
import {Filters} from './filters'
import {ErrorPopup} from '@/app/components/errorPopup';
import {FilterProps} from './filter';
import {getAllUsersData, searchUsers} from '@/app/components/fetch';
import './dashboard.css'
import {emptyUser} from '@/app/components/emptyUser';
import {UserEditPopup} from '@/app/components/userEditPopup';
import {Oauth_token} from "@/app/components/fetch";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";

function TableCell({content}: { content: string }) {
    return (<td className="tableElement">
        <p>{content}</p>
    </td>);
}

function TableHeader({headers}: { headers: Array<string> }) {
    const headerItems = headers.map((header: string) =>
        <td className="tableHeader" key={header}>{header}</td>
    )
    return (
        <tr>
            {headerItems}
        </tr>
    );
}

function TableRow({user, onTableRowClicked}: { user: User, onTableRowClicked: (user: User) => any }) {
    return (
        <tr key={user.id} onClick={() => {
            onTableRowClicked(user)
        }}>
            <TableCell content={user.firstName}></TableCell>
            <TableCell content={user.lastName}></TableCell>
            <TableCell content={user.fatherName}></TableCell>
            <TableCell content={user.workPhoneNumber}></TableCell>
            <TableCell content={user.mobilePhoneNumber}></TableCell>
            <TableCell content={user.directorate}></TableCell>
            <TableCell content={user.department}></TableCell>
            <TableCell content={user.unit}></TableCell>
            <TableCell content={user.service}></TableCell>
            <TableCell content={user.jobTitle}></TableCell>
        </tr>

    )
}

function SearchBar({hidden, onSearchClicked, onTextChange}: {
    hidden: boolean,
    onSearchClicked: () => any,
    onTextChange: (text: string) => any
}) {
    function onChangeWrapper(event: ChangeEvent<HTMLInputElement>) {
        onTextChange(event.target.value);
    }

    if (!hidden) {
        return (
            <div className='searchBarContainer'>
                <input type="text" className="searchBarInput" onChange={onChangeWrapper}></input>
                <button className="tableControlButton lowProfileButton" onClick={onSearchClicked}>Искать</button>
            </div>
        );
    }
    return (<div></div>);
}

export default function Dashboard() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState(emptyUser);
    const router = useRouter();
    useEffect(() => {
        fetchUsers(0, pageSize);
        const jsonToken = localStorage.getItem("token");
        if (jsonToken !== null) {
            const token = Oauth_token.fromJSON(jsonToken);
            const decoded: JSON = jwtDecode(token.token);
            const roles: string[] = (Array)((decoded as any)['realm_access']['roles'])[0];
            if (roles.includes("ADMIN")) {
                setIsAdmin(true);
            }
        } else {
            router.replace("/login");
        }
    }, [])
    const headers = ["Имя", "Фамилия", "Отчество", "Рабочий номер", "Мобильный номер", "Дирекция", "Департамент", "Отдел", "Служба", "Должность"]
    const userItems = users.map((user: User) =>
        <TableRow user={user} key={user.id} onTableRowClicked={(user) => {
            if (isAdmin) {
                setSelectedUser(user);
                setEditPopupHidden(false)
            }
        }}></TableRow>
    )
    const [searchBarHidden, setSearchBarHidden] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [filterBarHidden, setFilterBarHidden] = useState(true);
    const [filters, setFilterState] = useState(new Map());
    const [errorMessageText, setErrorMessageText] = useState('');
    const [isError, setIsError] = useState(false);
    const [editPopupHidden, setEditPopupHidden] = useState(true);

    function fetchUsers(page: number, pageSize: number, filters: FilterProps[] = []) {
        let promise = getAllUsersData(page, pageSize, filters);
        promise.then((response) => {
            if (response.status === 200) {
                setUsers(response.data)
            }
        }).catch((error) => {
            setErrorMessageText(error.message);
            setIsError(true);
        })
    }

    function fetchSearchedUsers(page: number, pageSize: number, searchText: string) {
        let promise = searchUsers(page, pageSize, searchText);
        promise.then((response) => {
            if (response.status === 200) {
                setUsers(response.data)
            }
        }).catch((error) => {
            setErrorMessageText(error.message);
            setIsError(true);
        })
    }

    function onSearchButtonClicked() {
        setSearchBarHidden(!searchBarHidden);
    }

    function onFilterButtonClicked() {
        setFilterBarHidden(!filterBarHidden);
    }

    function nextPage() {
        fetchUsers(page + 1, pageSize)
        setPage(page + 1);
    }

    function previousPage() {
        if (page > 0) {
            fetchUsers(page - 1, pageSize)
            setPage(page - 1);
        }
    }

    function onFiltersChanged(filterKey: string, filterText: string, id: number) {
        if (filterKey != "") {
            setFilterState(filters.set(id, {'key': filterKey, 'value': filterText, 'operation': '='}));
        } else {
            filters.delete(id);
            setFilterState(filters);
        }
    }

    function onSearchTextChanged(newText: string) {
        setSearchText(newText);
    }

    function onFilterApplyButtonClicked() {
        const f: FilterProps[] = Array.from(filters.values());
        fetchUsers(page, pageSize, f);
    }

    function setSearchedUsers() {
        fetchSearchedUsers(page, pageSize, searchText);
    }

    function addUserPopup() {
        if (isAdmin) {
            setSelectedUser(emptyUser);
            setEditPopupHidden(false);
        }
    }

    return (
        <div>
            <title>Все пользователи</title>
            <Header username=""></Header>
            <ErrorPopup errorMessage={errorMessageText} onCloseButtonClicked={() => {
                setIsError(false)
            }} hidden={!isError}></ErrorPopup>
            <UserEditPopup user={selectedUser} hidden={editPopupHidden} onCloseButtonClicked={() => {
                setEditPopupHidden(true)
            }} onUserCreated={(user) => {
                setUsers([...users as any, user])
            }}></UserEditPopup>

            <div className="centered">
                <div className="buttonControl">
                    <button className="filterButton tableControlButton" onClick={onFilterButtonClicked}>Фильтры</button>
                    <button className="searchButton tableControlButton" onClick={onSearchButtonClicked}>Поиск</button>
                    <button className='tableControlButton filterButton' onClick={addUserPopup}
                            hidden={!isAdmin}>Добавить
                        пользователя
                    </button>
                </div>
                <SearchBar hidden={searchBarHidden} onSearchClicked={setSearchedUsers}
                           onTextChange={onSearchTextChanged}></SearchBar>
                <Filters onFilterChange={onFiltersChanged} hidden={filterBarHidden}
                         onApplyButtonClicked={onFilterApplyButtonClicked}></Filters>
                <div className="tableSurround">
                    <table className='userTable'>
                        <tbody>
                        <TableHeader headers={headers}></TableHeader>
                        {userItems}
                        </tbody>
                    </table>
                    <div className="pageSelectorContainer">
                        <button className="nobackground" onClick={previousPage}><img src="/arrow-backward.svg"
                                                                                     width="20" height="20"
                                                                                     alt={"back"}></img>
                        </button>
                        <p className="pageNumber">{page + 1}</p>
                        <button className="nobackground" onClick={nextPage}><img src="/arrow-forward.svg" width="20"
                                                                                 height="20" alt={"next"}></img>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
