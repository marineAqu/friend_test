// Number.jsx

import React from 'react';
import { Bs0Circle, Bs0CircleFill, Bs1Circle, Bs1CircleFill, Bs2Circle, Bs2CircleFill, Bs3Circle, Bs3CircleFill, Bs4Circle, Bs4CircleFill, Bs5Circle, Bs5CircleFill, Bs6Circle, Bs6CircleFill, Bs7Circle, Bs7CircleFill, Bs8Circle, Bs8CircleFill, Bs9Circle, Bs9CircleFill } from "react-icons/bs";
import './Number.css';

const Number = ({page, mode, resultList}) => {

    const getColorClass = (index) => {
        if (mode === 'score') {
            return resultList[index] ? 'correct' : 'incorrect';
        }
        return '';
    };


    // 클릭 기능 일단 없앰
    // const [activeNumber, setActiveNumber] = useState(page);
    // const handleNumberClick = (number) => {
    //     setActiveNumber(number);
    // };

    return (
        <div className="number">
            <div className="up">
                {page !== 1 ? <Bs1Circle className={getColorClass(0)} /> : <Bs1CircleFill className={getColorClass(0)} />}
                {page !== 2 ? <Bs2Circle className={getColorClass(1)} /> : <Bs2CircleFill className={getColorClass(1)} />}
                {page !== 3 ? <Bs3Circle className={getColorClass(2)} /> : <Bs3CircleFill className={getColorClass(2)} />}
                {page !== 4 ? <Bs4Circle className={getColorClass(3)} /> : <Bs4CircleFill className={getColorClass(3)} />}
                {page !== 5 ? <Bs5Circle className={getColorClass(4)} /> : <Bs5CircleFill className={getColorClass(4)} />}
            </div>
            <div className="down">
                {page !== 6 ? <Bs6Circle className={getColorClass(5)} /> : <Bs6CircleFill className={getColorClass(5)} />}
                {page !== 7 ? <Bs7Circle className={getColorClass(6)} /> : <Bs7CircleFill className={getColorClass(6)} />}
                {page !== 8 ? <Bs8Circle className={getColorClass(7)} /> : <Bs8CircleFill className={getColorClass(7)} />}
                {page !== 9 ? <Bs9Circle className={getColorClass(8)} /> : <Bs9CircleFill className={getColorClass(8)} />}
                {page !== 10 ? <Bs0Circle className={getColorClass(9)} /> : <Bs0CircleFill className={getColorClass(9)} />}
            </div>
        </div>
    );
};

export default Number;

