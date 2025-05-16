import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ EmployeeNumber }) => {
    const navigate = useNavigate();

    const handleDetailsClick = () => {
        navigate(`/prediction/prefilled-predictions/${EmployeeNumber}`);
    };

    return (
        <div className="w-60 h-30 bg-cyan-600 rounded-md p-4 text-white shadow-md mb-4">
            <p className="text-lg font-semibold">Employee #: {EmployeeNumber}</p>
            <div className="mt-2">
                <button
                    onClick={handleDetailsClick}
                    className="bg-white text-cyan-600 px-3 py-1 rounded hover:bg-cyan-100"
                >
                    More Details
                </button>
            </div>
        </div>
    );
};

export default Card;
