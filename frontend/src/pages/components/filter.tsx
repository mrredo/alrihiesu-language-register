import React, { useEffect, useRef } from "react";
import { WordFilter, WordMetaData } from "../../interfaces/words";
import {useTranslation} from "react-i18next";

interface Props {
    filter: WordFilter;
    setFilter: (...args: any) => void;
}

let proxy = "http://localhost:4000";

const FilterButtons = (props: Props) => {
    let InputPages = useRef<HTMLInputElement>(null);
    const { t } = useTranslation()

    function GetNewResults() {
        // Fetch results using setFilter
    }

    useEffect(() => {
        // Add any necessary side effect logic
    }, []);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setFilter({ ...props.filter, search: event.target.value });
    };

    const handleSummaryChange = (event: React.ChangeEvent<HTMLDetailsElement>) => {
        const value = event.target.open ? "EndsWith" : "StartsWith";
        props.setFilter({ ...props.filter, searchOption: value });
    };

    const handleSubmit = () => {
        // Trigger data fetching
        GetNewResults();
    };

    return (
        <div className={"m-4"}>
            <div className="flex items-center">
                <span className="w-[7rem]">{t('search')}:</span>
                <input
                    defaultValue={props.filter.contains}
                    id="latvian-input"
                    className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                />
                <button className={"p-2 mx-2 border-2 rounded-md transition-all hover:rounded-lg font-bold hover:bg-[#00ff3c] hover:text-black duration-300"}>{t('submit')}</button>
            </div>
            <details>
                <summary>{t('advanced_filters')}</summary>
                <div className={"flex flex-col"}>
                    <div className={"flex items-center"}>
                        <span className={"w-[5rem]"}>Starts with:</span>

                        <input
                            defaultValue={props.filter.starts_with}
                            id="latvian-input"
                            className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                        />
                    </div>
                    <div>
                        <span className={"w-[5rem]"}>Ends with:</span>
                        <input
                            defaultValue={props.filter.starts_with}
                            id="latvian-input"
                            className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                        />
                    </div>

                </div>
            </details>

        </div>
    );
};

export default FilterButtons;
