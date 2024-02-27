// Number.jsx

import React from 'react';
import { Bs0Circle, Bs0CircleFill, Bs1Circle, Bs1CircleFill, Bs2Circle, Bs2CircleFill, Bs3Circle, Bs3CircleFill, Bs4Circle, Bs4CircleFill, Bs5Circle, Bs5CircleFill, Bs6Circle, Bs6CircleFill, Bs7Circle, Bs7CircleFill, Bs8Circle, Bs8CircleFill, Bs9Circle, Bs9CircleFill } from "react-icons/bs";
import './Number.css';

const Number = ({page}) => {
    


    // 클릭 기능 일단 없앰
    // const [activeNumber, setActiveNumber] = useState(page);
    // const handleNumberClick = (number) => {
    //     setActiveNumber(number);
    // };

    return (
        <div className="number">
            <div className="up">
                {page !== 1 ? <Bs1Circle /> : <Bs1CircleFill />}
                {page !== 2 ? <Bs2Circle /> : <Bs2CircleFill />}
                {page !== 3 ? <Bs3Circle /> : <Bs3CircleFill />}
                {page !== 4 ? <Bs4Circle /> : <Bs4CircleFill />}
                {page !== 5 ? <Bs5Circle /> : <Bs5CircleFill />}
            </div>
            <div className="down">
                {page !== 6 ? <Bs6Circle /> : <Bs6CircleFill />}
                {page !== 7 ? <Bs7Circle /> : <Bs7CircleFill />}
                {page !== 8 ? <Bs8Circle /> : <Bs8CircleFill />}
                {page !== 9 ? <Bs9Circle /> : <Bs9CircleFill />}
                {page !== 10 ? <Bs0Circle /> : <Bs0CircleFill />}
            </div>
        </div>
    );
};

export default Number;

