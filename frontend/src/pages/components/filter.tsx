import React, {useEffect, useRef} from "react";
import {WordFilter, WordMetaData} from "../../interfaces/words";

interface props {
    filter: WordFilter
    setFilter: (...args: any) => void
}
let proxy = "http://localhost:4000"
function isNumber(value: any) {
    return typeof value === 'number';
}
 const FilterButtons = (p: props) => {
    let InputPages = useRef<HTMLInputElement>(null)
    function GetNewResults() {
    //CHANGE setFilter and it will fetch results
    }



    useEffect(() => {

    }, [])
    return (
    <>
        <button className={"border-2 p-2 m-2"} onClick={() => GetNewResults()}> Fetch New Data</button>
    </>
    )
}

export default FilterButtons
