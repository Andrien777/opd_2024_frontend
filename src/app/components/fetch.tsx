import axios from "axios";
import {User} from "./user";
import {AxiosResponse} from 'axios'
import {FilterProps} from "../dashboard/filter";


export class Oauth_token {
    token: string;
    refresh_token: string;
    expires_in: number;
    created: number;

    constructor(token: string, refresh_token: string, expires_in: number) {
        this.token = token;
        this.refresh_token = refresh_token;
        this.expires_in = expires_in;
        this.created = Date.now();
    }

    is_valid() {
        return (Date.now() - this.created) / 1000 < this.expires_in;
    }

    jsonify() {
        return JSON.stringify(this);
    }

    static fromJSON(json: string) {
        let my_token = JSON.parse(json);
        let token = new Oauth_token(my_token.token, my_token.refresh_token, my_token.expires_in);
        token.created = my_token.created;
        return token;
    }
}

export async function get_token(username: string, password: string): Promise<Oauth_token> {
    let token = undefined;
    const response = await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_AUTH_URL_BASE + "token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT,
            username: username,
            password: password,
            grant_type: "password"
        }
    });
    if (response.status === 200) {
        return Promise.resolve(new Oauth_token(response.data.access_token, response.data.refresh_token, response.data.expires_in));
    } else {
        return Promise.reject(response.status);
    }
}

export async function getValidToken(): Promise<Oauth_token> {
    let token: Oauth_token | null = null;
    if (localStorage.getItem("token") != null) {
        token = Oauth_token.fromJSON((localStorage.getItem("token") as string));
        if (!token.is_valid()) {
            let new_token = await refresh_token(token.refresh_token);
            token = new_token;
            localStorage.setItem("token", token.jsonify());
        }
        return Promise.resolve(token);
    } else {
        return Promise.reject(token);
    }
}

export async function getAllUsersData(page: number, pageSize: number, filters: FilterProps[]): Promise<AxiosResponse<any, any>> {
    const base = process.env.NEXT_PUBLIC_API_URL_BASE;
    let token = await getValidToken();
    return axios({
        method: "POST",
        url: base + "getAllUsersData",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + (token ? token.token : ""),
        },
        params: {
            "page": page,
            "page-size": pageSize
        }, data: filters
    });
}

export async function searchUsers(page: number, pageSize: number, searchText: string): Promise<AxiosResponse<any, any>> {
    const base = process.env.NEXT_PUBLIC_API_URL_BASE;
    let token = await getValidToken();
    return axios({
        method: "POST",
        url: base + "searchUsers",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + (token ? token.token : ""),
        },
        params: {
            "page": page,
            "page-size": pageSize
        }, data: searchText
    });
}

export async function getUserData(): Promise<AxiosResponse<any, any>> {
    const base = process.env.NEXT_PUBLIC_API_URL_BASE;
    let token = await getValidToken();

    return axios({
        method: "GET",
        url: base + "getUser",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + (token ? token.token : ""),
        }
    });
}

export async function updatePhoneNumber(updatedPhoneNumber: string): Promise<AxiosResponse<any, any>> {
    let token = await getValidToken();
    const base = process.env.NEXT_PUBLIC_API_URL_BASE;
    return axios({
        method: "POST",
        url: base + "updatePhoneNumber",
        headers: {
            "Content-Type": "text/plain",
            "Authorization": "Bearer " + (token ? token.token : ""),
        }, data: updatedPhoneNumber
    });
}

export async function editUser(user: User): Promise<AxiosResponse<any, any>> {
    let token = await getValidToken();
    const base = process.env.NEXT_PUBLIC_API_URL_BASE;
    return axios({
        method: "POST",
        url: base + "editUser",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + (token ? token.token : ""),
        }, data: user
    });
}

export async function addUser(user: User): Promise<AxiosResponse<any, any>> {
    let token = await getValidToken();

    const userWithoutId = {
        'username': user.username,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'fatherName': user.fatherName,
        'workPhoneNumber': user.workPhoneNumber,
        'mobilePhoneNumber': user.mobilePhoneNumber,
        'directorate': user.directorate,
        'department': user.department,
        'unit': user.unit,
        'service': user.service,
        'jobTitle': user.jobTitle
    }

    const base = process.env.NEXT_PUBLIC_API_URL_BASE;
    return axios({
        method: "POST",
        url: base + "addUser",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + (token ? token.token : ""),
        }, data: userWithoutId
    });
}

export async function refresh_token(refresh_token: string): Promise<Oauth_token> {
    let token = undefined;
    let response = await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_AUTH_URL_BASE + "token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT,
            refresh_token: refresh_token,
            grant_type: "refresh_token"
        }
    });
    if (response.status === 200) {
        return Promise.resolve(new Oauth_token(response.data.access_token, response.data.refresh_token, response.data.expires_in));
    } else {
        alert(response.statusText);
    }
    return Promise.reject(token);
}

export async function logout_auth(): Promise<AxiosResponse> {
    let token = await getValidToken();
    let response = await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_AUTH_URL_BASE + "logout",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT,
            refresh_token: token.refresh_token,
        }
    });
    return response;
}
