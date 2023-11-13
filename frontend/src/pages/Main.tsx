import {useState, useEffect} from "react"
import Input from "./components/input";
import {i18n} from '../App';
import { useNavigate  } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {WordFilter, WordMetaData, WordMap, Word} from "../interfaces/words"
import FilterButtons from "./components/filter";
import CustomPagination from "./components/Pages";

import NavBar from "./components/NavBar";
import WordsElement from "./components/Words";
const options1 = ["noun", "verb", "adjective", "adverb", "pronoun", "conjunction", "preposition", "other"]

let proxy = "http://localhost:4000"
export default function Main() {
    const navigate = useNavigate();
    const { t } = useTranslation()
    let [options, setOptions] = useState([])
    let [firstFetch, setFetch] = useState(true)
    const [value, setValue] = useState('word1');
    let [inputData, setInputData]= useState({} as WordMap)
    let [filter, setFilter] = useState<WordFilter>({
        words_per_page: 5,
        specific_words: [],
        page: 1,
        order: 0,
        part_of_speech: [],
        starts_with: "",
        ends_with: "",
        contains: ""
    })
    let [queriesLoaded, setQueriesLoaded] = useState(false)
    let [words, setWords] = useState({
        "document_count": 0,
        "document_count_by_filter": 0,
        "current_page": 0,
        "page_count": 0,
        "data": []
    } as WordMetaData)
    useEffect(() => {
        if (queriesLoaded) {
            // const value = new URLSearchParams(locati
            fetchWords(filter, setWords);

        } else {

        }
    }, [filter]);
    useEffect(() => {

    }, [filter.page]);

    useEffect(() => {
        setOptions(t('partOfSpeech', {returnObjects:true}) as any)


        const parseQueryParam = (key: string) => {
            const value = new URLSearchParams(location.search).get(key);
            console.log(key, value)
            // Parse number values, falling back to string if parsing fails
            return key !== 'specific_words' && key !== 'part_of_speech'
                ? parseInt(value || (filter as any)[key].toString(), 10)
                : value !== null
                    ? value
                    : filter[key];
        };

        // Build a new filter object with values from query parameters
        const newFilter: WordFilter = {} as WordFilter;
        // Iterate over the keys of WordFilter and parse query parameters dynamically
        for (const key in filter) {
            if (Object.prototype.hasOwnProperty.call(filter, key)) {
                if (key === 'specific_words' || key === 'part_of_speech') {
                    newFilter[key] = (parseQueryParam(key) as string).split(',').filter(Boolean);
                } else {

                    (newFilter as any)[key] = parseQueryParam(key);
                }
            }
        }
        filter = newFilter


        // Update the filter state
        setQueriesLoaded(true)
        setFilter(newFilter);

        // setFilter(filter)
        // fetchWords(filter, setWords)

    }, [])

    const changeLanguage = (lng: any) => {
        i18n.changeLanguage(lng);
        setOptions(t('partOfSpeech', {returnObjects:true}) as any)
        console.dir(inputData)
    };
    return (
        <>
            <div className={" sticky top-0"}>
                <NavBar currentLang={i18n.language} setlanguage={changeLanguage}/>

            </div>
            {words.data.length !== 0? (
                <>
                    {/*{t('test')}*/}
                    <button className={"p-2 border-2 m-3 rounded-lg text-white"} onClick={() => changeLanguage('lv')}>Latvian</button>
                    <button className={"p-2 border-2 m-3 rounded-lg text-white"} onClick={() => changeLanguage('en')}>English</button>
                    <FilterButtons filter={filter} setFilter={setFilter} ></FilterButtons>


                    <div className={"grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1"}>
                        {words.data.map((word, i) => (

                            <details id={`${word.id}`} className={"flex flex-col border-2 rounded-lg m-3 p-2 text-white"}>
                                <summary>{word.alrihian}-{word.latvian}</summary>
                                {/*<div id={word.id} className="flex flex-col border-2 rounded-lg m-3 p-2 text-white">*/}
                                    <div className="flex items-center">
                                        <span className="w-[7rem]">{t('alrihian')}:</span>
                                        <input defaultValue={word.alrihian} id={`${word.id}-alrihian`} className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300" />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-[7rem]">{t('latvian')}:</span>
                                        <input defaultValue={word.latvian} id={`${word.id}-latvian`} className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300" />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-[7rem]">{t('description')}:</span>
                                        <textarea
                                            defaultValue={word.description}
                                            id={`${word.id}-description`}
                                            rows={2}
                                            className="p-2 w-[15rem] resize-x h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-[7rem]">{t('speech')}:</span>
                                        <select defaultValue={word.partofspeech} id={`${word.id}-speech`} className="p-2 bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300">
                                            {options.map((option, i) => (
                                                <option value={options1[i]}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center">
                                        <details>
                                            <summary>{t('examples')}</summary>
                                            <textarea
                                                defaultValue={word.examples.join("\n")}
                                                id={`${word.id}-examples`}
                                                className="p-2 w-[15rem] resize h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                                            />
                                        </details>


                                    </div>
                                {/*</div>*/}
                            </details>

                        ))}
                    </div>
                    {/*<WordsElement words={words.data}></WordsElement>*/}
                    <div className={"flex justify-center h-full relative sticky bottom-0"}>
                        <CustomPagination setFilter={setFilter} data={words} ></CustomPagination>
                    </div>



                </>
            ) : null}
        </>
    )
}
const fetchWords = (filters: WordFilter, setData: (...args: any) => void) => {
    console.log("fetch: ", filters.page)
    fetch(`${proxy}/api/word`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(filters),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((dat) => dat.json()).then((data => {
        if (data.data.length === 0) {
            return
        }

        setData(data)
    })).catch(err => console.error)
}