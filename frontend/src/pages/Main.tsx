import {useState, useEffect} from "react"
import Input from "./components/input";
import {i18n} from '../App';
import {useTranslation} from "react-i18next";
import {WordFilter, WordMetaData} from "../interfaces/words"
import FilterButtons from "./components/filter";
import CustomPagination from "./components/Pages";
import {data} from "autoprefixer";
const options1 = ["noun", "verb", "adjective", "adverb", "pronoun", "conjunction", "preposition", "other"]

let proxy = "http://localhost:4000"
export default function Main() {
    const { t } = useTranslation()
    let [options, setOptions] = useState([])
    let [firstFetch, setFetch] = useState(true)
    let [filter, setFilter] = useState({
        words_per_page: 5,
        specific_words: [],
        page: 1,
        order: 0,
        part_of_speech: [],
        starts_with: "",
        ends_with: "",
        contains: ""
    } as WordFilter)
    let [words, setWords] = useState({
        "document_count": 0,
        "document_count_by_filter": 0,
        "current_page": 0,
        "page_count": 0,
        "data": []
    } as WordMetaData)
    useEffect(() => {
        fetchWords(filter, setWords);
    }, [filter.page]);

    useEffect(() => {
        setOptions(t('partOfSpeech', {returnObjects:true}) as any)

        // const fetchWords = () => {
        //
        //     fetch(`${proxy}/api/word?p=1`, {
        //         method: "PUT",
        //         credentials: "include",
        //         body: JSON.stringify({
        //             "words_per_page": 5,
        //             "specific_words": [],
        //             "order": 0,
        //             "part_of_speech": [],
        //             "starts_with": "",
        //             "ends_with": "",
        //             "contains": ""
        //         }),
        //         headers: {
        //             'Content-Type': 'application/json',
        //         }
        //     }).then((dat) => dat.json()).then(((data: WordMetaData) => {
        //         setPage(data.current_page)
        //         setWords(data)
        //     })).catch(err => console.error)
        // }

        fetchWords(filter, setWords)

    }, [])

    const changeLanguage = (lng: any) => {
        i18n.changeLanguage(lng);
        setOptions(t('partOfSpeech', {returnObjects:true}) as any)
    };
    return (
        <>
            {words.data.length !== 0? (
                <>
                    {/*{t('test')}*/}
                    <button className={"p-2 border-2 m-3 rounded-lg text-white"} onClick={() => changeLanguage('lv')}>Latvian</button>
                    <button className={"p-2 border-2 m-3 rounded-lg text-white"} onClick={() => changeLanguage('en')}>English</button>
                    <FilterButtons filter={filter} setFilter={setFilter} ></FilterButtons>


                    <CustomPagination   setFilter={setFilter} data={words} ></CustomPagination>
                    <div className={"grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1"}>

                        {words.data.map((word, i) => (

                            <details id={`${word.id}`} className={"flex flex-col border-2 rounded-lg m-3 p-2 text-white"}>
                                <summary>{word.alrihian}-{word.latvian}</summary>
                                <button onClick={() => console.log(word)}>CLCICKCICK</button>
                                {/*<div id={word.id} className="flex flex-col border-2 rounded-lg m-3 p-2 text-white">*/}
                                    <div className="flex items-center">
                                        <span className="w-[7rem]">{t('alrihian')}:</span>
                                        <input value={word.alrihian} id={`${word.id}-alrihian`} className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300" />
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