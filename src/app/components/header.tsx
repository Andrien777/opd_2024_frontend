'use client'
import './header.css'
import {useRouter} from "next/navigation";
import Image from "next/image";
import {logout_auth} from './fetch';

export function Header({username}: { username: String }) {
    function logout() {
        logout_auth();
        localStorage.removeItem("token");
        router.replace("/login");
    }

    const router = useRouter();
    return (
        <div className="header">
            <div className="userProfileContainer">
                <div className="profileIconContainer" onClick={() => {
                    router.push("/profile");
                }}>
                    <Image
                        className=""
                        src="/profile-icon.svg"
                        alt="Profile Logo"
                        width={50}
                        height={50}
                        priority
                    />
                </div>
                <div className="profileIconContainer" onClick={() => {
                    router.push("/dashboard");
                }}>
                    <Image
                        className=""
                        src="/dashboard-icon.svg"
                        alt="Profile Logo"
                        width={50}
                        height={50}
                        priority
                    />
                </div>
                <p className="username">{username}</p>
            </div>
            <button className="logoutButton" onClick={logout}>Выйти</button>
        </div>
    );
}