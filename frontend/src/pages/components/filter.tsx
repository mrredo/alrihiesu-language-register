import React, { useEffect, useState, useRef } from "react";
import {options1, WordFilter, WordMetaData} from "../../interfaces/words";
import {useTranslation} from "react-i18next";
import { Col, Form } from "react-bootstrap";
interface Props {
    filter: WordFilter;
    setFilter: (...args: any) => void;
    setQuery: (...args: any) => void;
    options: string[]
}

let proxy = "http://localhost:4000";

const FilterButtons = (props: Props) => {
    let InputPages = useRef<HTMLInputElement>(null);
    const { t } = useTranslation()
    let q = new URLSearchParams(location.search)
    let ContainsRef = useRef<HTMLInputElement>(null)
    let StartsWith = useRef<HTMLInputElement>(null)
    let EndsWith = useRef<HTMLInputElement>(null)
    let WordsPerPage = useRef<HTMLInputElement>(null)
    let PartOfSpeech = useRef<HTMLSelectElement>(null)
    let [speechVal, setSpeechVal] = useState(q.get("part_of_speech")?.split(",").length !== 0? q.get("part_of_speech")?.split(','): "")

    function GetNewResults() {
        props.setQuery(true)
        props.setFilter((prev: WordFilter) => ({
            ...prev,
            contains: ContainsRef.current?.value,
            ends_with: EndsWith.current?.value,
            starts_with: StartsWith.current?.value,
            words_per_page: WordsPerPage.current?.value,
            part_of_speech: [PartOfSpeech.current?.value]
        }))
    }



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
                <span className="w-[8rem] text-[#EBEBE4]">{t('search')}:</span>
                <input
                    defaultValue={props.filter.contains}
                    id="latvian-input"
                    ref={ContainsRef}
                    onKeyDown={event => event.key === "Enter"? GetNewResults() : null}
                    className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                />
                <button
                    onClick={() => GetNewResults()}
                    className={"p-2 mx-2 border-2 rounded-md transition-all hover:rounded-lg font-bold hover:bg-[#00ff3c] hover:text-black duration-300"}>{t('submit')}</button>
            </div>
            <details>
                <summary className={"text-[#EBEBE4]"}>{t('advanced_filters')}</summary>
                <div className={"flex flex-col"}>
                    <div className={"flex items-center"}>
                        <span className={"w-[8rem] text-[#EBEBE4]"}>{t('starts_with')}:</span>
                        <input
                            defaultValue={props.filter.starts_with}
                            ref={StartsWith}
                            onKeyDown={event => event.key === "Enter"? GetNewResults() : null}
                            id="latvian-input"
                            className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                        />
                    </div>

                    <div className={"flex items-center"}>
                        <span className={"w-[8rem] text-[#EBEBE4]"}>{t('ends_with')}:</span>
                        <input
                            ref={EndsWith}
                            defaultValue={props.filter.ends_with}
                            onKeyDown={event => event.key === "Enter"? GetNewResults() : null}
                            id="latvian-input"
                            className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                        />
                    </div>
                    <div className={"flex items-center"}>
                        <span className={"w-[8rem] text-[#EBEBE4]"}>{t('words_per_page')}:</span>
                        <input
                            min={1}
                            max={200}
                            step={2}

                            ref={WordsPerPage}
                            onKeyDown={event => event.key === "Enter"? GetNewResults() : null}
                            defaultValue={q.get("words_per_page") || "30"}
                            type={"number"}
                            id="latvian-input"
                            className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                        />
                    </div>
                    <div className={"flex items-center"}>
                        <span className={"w-[8rem] "}>{t('order')}:</span>
                        <select disabled defaultValue={props.filter.order} className="p-2 bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300">
                            <option value={-1}>CBA</option>
                            <option value={0}>{t("order_none")}</option>
                            <option value={1}>ABC</option>
                        </select>
                    </div>
                    <div className={"flex items-center"}>
                        <span className={"w-[8rem] text-[#EBEBE4]"}>{t('speech')}:</span>
                        <select
                            ref={PartOfSpeech}
                            id={"filter-speech"}
                            value={speechVal}
                            onChange={(el) => setSpeechVal(el.target.value)}
                            className="p-2 bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                        >
                            <option value={""}>{t('order_none')}</option>
                            {props.options.map((option, i) => (
                                <option value={options1[i]}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </details>

        </div>
    );
};

export default FilterButtons;
