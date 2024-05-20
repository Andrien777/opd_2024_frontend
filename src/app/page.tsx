'use client'
import {useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";
import {Oauth_token} from "@/app/components/fetch";

export default function Home() {
    const router = useRouter();
    const jsonToken = localStorage.getItem("token");
    if (jsonToken !== null) {
        const token = Oauth_token.fromJSON(jsonToken);
        const decoded: JSON = jwtDecode(token.token);
        const roles: string[] = (Array)((decoded as any)['realm_access']['roles'])[0];
        if (roles.includes("ADMIN")) {
            router.replace("/dashboard");
        } else {
            router.replace("/profile");
        }
    } else {
        router.replace("/login");
    }
    return (

        <div>

            <title>Boarding</title>

        </div>
    );
}
