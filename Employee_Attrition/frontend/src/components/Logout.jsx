import React from 'react'
import { useNavigate } from "react-router-dom";

function Logout({setIsLoggedIn}) {
    const navigate = useNavigate();
    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/");
    };
    return (
        <>
            <button
                onClick={handleLogout}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
            >
                Logout
            </button>
        </>
    )
}

export default Logout
