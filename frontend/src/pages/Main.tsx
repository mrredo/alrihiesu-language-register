import React, {useEffect, useState} from "react"
import {i18n} from '../App';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {Author, Word, WordFilter, WordMap, WordMetaData} from "../interfaces/words"
import FilterButtons from "./components/filter";
import CustomPagination from "./components/Pages";

import NavBar from "./components/NavBar";
import {Button} from "react-bootstrap";
import {ArrowClockwise, Trash} from "react-bootstrap-icons"
import withReactContent from 'sweetalert2-react-content'
import {Account} from "../interfaces/user";
import Swal1 from 'sweetalert2'
import config from "../config";

const options1 = ["noun", "verb", "adjective", "adverb", "pronoun", "conjunction", "preposition", "other"]

interface AccountsInterface {
    [key: string]: Account;
}

let Swal = withReactContent(Swal1)
let image = require("../stuff/redobot.png")
export default function Main() {
    let [authorsFetched, setAuthorsFetched] = useState(false)
    const navigate = useNavigate();
    const {t} = useTranslation()
    let [account, setAccount] = useState({} as Account)
    let [logged, setLogged] = useState(false)
    let [options, setOptions] = useState([])
    let [inputData, setInputData] = useState({} as WordMap)
    let [tempFilter, setTempFilter] = useState<WordFilter>({})
    // let Authors = new Map<string, Account>()
    let [Authors, setAuthors] = useState({} as AccountsInterface)
    let [filter, setFilter] = useState<WordFilter>({
        words_per_page: 0,
        specific_words: [],
        page: 0,
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

    }, [words])
    useEffect(() => {
        if (queriesLoaded) {
            const queryParams = new URLSearchParams({
                words_per_page: String(filter.words_per_page),
                specific_words: filter.specific_words !== undefined ? String(filter.specific_words?.join(",")) : "",
                page: String(filter.page),
                order: String(filter.order),
                part_of_speech: filter.part_of_speech !== undefined ? String(filter.part_of_speech?.join(",")) : "",
                starts_with: filter.starts_with,
                ends_with: filter.ends_with,
                contains: filter.contains

            } as Record<string, string>);
            console.log(queryParams.get("part_of_speech"))
            navigate("?" + queryParams.toString())
            location.reload()
        }


    }, [filter]);

    useEffect(() => {
        setOptions(t('partOfSpeech', {returnObjects: true}) as any)


        const q = new URLSearchParams(location.search)

        // Build a new filter object with values from query parameters
        const newFilter: WordFilter = {
            words_per_page: q.get("words_per_page") !== "" && q.get("words_per_page") !== "null" ? parseInt(q.get("words_per_page") || "30") : 30,
            specific_words: q.get("specific_words") !== "" && q.get("specific_words") !== "null" ? q.get("specific_words")?.split(",") as string[] : [],
            page: q.get("page") !== "" && q.get("page") !== "null" ? parseInt(q.get("page") || "1") : 1,
            order: q.get("order") !== "" && q.get("order") !== "null" ? parseInt(q.get("order") || "0") : 0,
            part_of_speech: q.get("part_of_speech") !== "" && q.get("part_of_speech") !== "null" ? q.get("part_of_speech")?.split(",") as string[] : [],
            starts_with: q.get("starts_with") as string,
            ends_with: q.get("ends_with") as string,
            contains: q.get("contains") as string
        };


        // Update the filter state
        filter = newFilter
        setFilter(newFilter);
        fetchWords(filter, setWords)

    }, [])

    const changeLanguage = (lng: any) => {
        i18n.changeLanguage(lng);
        setOptions(t('partOfSpeech', {returnObjects: true}) as any)
        console.dir(inputData)
    };

    function UpdateWord(word: Word, i: number) {
        let Alrihan = document.getElementById(`${word.id}-alrihian`) as HTMLInputElement
        let Latvian = document.getElementById(`${word.id}-latvian`) as HTMLInputElement
        let Description = document.getElementById(`${word.id}-description`) as HTMLTextAreaElement
        let PartOfSpeech = document.getElementById(`${word.id}-speech`) as HTMLSelectElement
        let Examples = document.getElementById(`${word.id}-examples`) as HTMLTextAreaElement
        word = {
            id: word.id,
            alrihian: Alrihan.value ? Alrihan.value : "",
            latvian: Latvian.value ? Latvian.value : "",
            description: Description.value ? Description.value : "",
            partofspeech: PartOfSpeech.value ? PartOfSpeech.value : "",
            examples: Examples.value.split("\n"),

        }
        fetch(config.proxy + "/api/word", {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify(word)
        }).then(res => {
            if (res.ok) {
                let title = document.getElementById(`${word.id}-title`) as HTMLSpanElement
                title.textContent = `${word.alrihian}-${word.latvian}`
            }
        })
    }

    function CreateWord() {
        Swal.fire({
            title: t('new_word'),
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: t('cancel'),
            confirmButtonText: t('confirm'),
            html: <>
                <div className="flex items-center mt-1">
                    <span className="text-[#EBEBE4] w-[7rem]">{t('alrihian')}</span>
                    <input
                        id={`swal-alrihan`}
                        className="p-2 w-[15rem] text-[#EBEBE4] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"/>
                </div>
                <div className="flex items-center mt-1">
                    <span className="text-[#EBEBE4] w-[7rem]">{t('latvian')}</span>
                    <input
                        id={`swal-latvian`}
                        className="p-2 w-[15rem] text-[#EBEBE4] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"/>
                </div>
                <div className="flex items-center mt-1">
                    <span className="w-[7rem] text-[#EBEBE4]">{t('description')}</span>
                    <textarea
                        id={`swal-description`}
                        className="p-2 text-[#EBEBE4] max-w-[30vw] md:max-w-[45vw] sm:max-w-[90vw] resize h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                    />
                </div>
                <div className="flex items-center">
                    <span className="w-[7rem] text-[#EBEBE4]">{t('speech')}</span>
                    <select
                        id={`swal-speech`}

                        className="text-[#EBEBE4] p-2 bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300">
                        {options.map((option, i) => (
                            <option value={options1[i]}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center mb-2">
                    <span className="w-[7rem] text-[#EBEBE4]">{t('examples')}</span>
                    <textarea
                        id={`swal-examples`}
                        className="p-2 text-[#EBEBE4] max-w-[30vw] md:max-w-[45vw] sm:max-w-[90vw] resize h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                    />
                </div>
            </>
        }).then(res => {
            if (!res.isConfirmed) return

            let alrihan = document.getElementById("swal-alrihan") as HTMLInputElement
            let latvian = document.getElementById("swal-latvian") as HTMLInputElement
            let description = document.getElementById("swal-description") as HTMLTextAreaElement
            let speech = document.getElementById("swal-speech") as HTMLSelectElement
            let examples = document.getElementById("swal-examples") as HTMLTextAreaElement
            let newWord: Word = {
                alrihian: alrihan.value ? alrihan.value : "",
                latvian: latvian.value ? latvian.value : "",
                description: description.value ? description.value : "",
                partofspeech: speech.value ? speech.value : "",
                examples: examples.value.split("\n")
            }
            fetch(config.proxy + "/api/word", {
                method: "POST",
                body: JSON.stringify(newWord),
                credentials: "include"
            }).then(res => {
                if (res.ok) {

                } else {
                    res.json().then((js) => {
                        Swal.fire({
                            title: t('failed_new_word'),
                            html: `${t('message_from_server')}: ${js.error}`
                        })
                    })

                }
            })
        })
    }

    function DeleteWord(word: Word, i: number) {
        Swal1.fire({
            title: t('delete_word', {word: word.alrihian}),
            showDenyButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: t('cancel'),
            denyButtonText: t('delete')
        }).then(res => {
            if (res.isDenied) {
                fetch(config.proxy + "/api/word", {
                    method: "DELETE",
                    credentials: "include",
                    body: JSON.stringify({
                        id: word.id
                    })
                }).then((res) => {
                    if (res.ok) {
                        // const updatedWords = [...words.data];
                        // updatedWords.splice(i, 1);
                        // setWords(prevState => ({
                        //     ...prevState,
                        //     data: updatedWords
                        // }))
                        location.reload()
                    }
                })
            }
        })

    }

    const fetchWords = (filters: WordFilter, setData: (...args: any) => void) => {

        fetch(config.proxy + `/api/word`, {
            method: "NEWGET",
            credentials: "include",
            body: JSON.stringify(filters),
            // headers: {
            //     'Content-Type': 'application/json',
            // }
        }).then((dat) => dat.json()).then((data => {
            if (data.data.length === 0) {
                return
            }
            FetchAuthors(data.data)
            setData(data)

        })).catch(err => console.error)
    }
    function FetchAuthors(words: Word[]) {
        let ids1 = new Map<string, Author>()
        let ids: string[] = []
        for (const word of words) {
            if (!ids1.get(word.author!.id) && word.author?.id != undefined) ids1.set(word.author!.id, word.author as Author)
        }
        ids1.forEach((d) => {
            ids.push(d.id)
        })


        let res = fetch(config.proxy + "/acc/account", {
            credentials: "include",
            body: JSON.stringify({
                id: ids
            }),
            method: "NEW"
        })
        res.then(re => {
            if(!re.ok) return
            re.json().then((d: Account[]) => {
                let users: AccountsInterface = {};
                for (const acc of d) {
                    users[acc.id] = acc
                }
                setAuthors(users)
            })
        })

    }
    return (
        <>
            <div className={"sticky top-0"}>
                <NavBar logged={logged} setLogged={setLogged} account={account} setAccount={setAccount}
                        currentLang={i18n.language} setlanguage={changeLanguage}/>
            </div>
            <FilterButtons options={options} setQuery={setQueriesLoaded} filter={filter}
                           setFilter={setFilter}></FilterButtons>
            {logged ? (
                <div className={"flex justify-center "}>
                    <Button onClick={() => CreateWord()} variant={"success"}>{t('new_word')}</Button>
                </div>
            ) : ""}
            <button onClick={() => console.log(Authors["1736444738556407808"])}>Ids</button>
            {words.data.length !== 0 ? (
                <>
                    {/*{t('test')}*/}
                    {/*<button className={"p-2 border-2 m-3 rounded-lg text-white"} onClick={() => changeLanguage('lv')}>Latvian</button>*/}
                    {/*<button className={"p-2 border-2 m-3 rounded-lg text-white"} onClick={() => changeLanguage('en')}>English</button>*/}


                    <div className={"grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1"}>
                        {words.data.map((word, i) => (
                            <>
                                <details open={true} id={`${word.id}`}
                                         className={"flex flex-col border-2 rounded-lg m-3 p-2 text-white"}>
                                    <summary className="flex justify-between items-center mx-1">
                                        <span id={`${word.id}-title`}>{word.alrihian}-{word.latvian}</span>
                                        {logged ? (
                                            <div>
                                                <Button className="mx-2 px-3 py-2" onClick={() => UpdateWord(word, i)}
                                                        variant="outline-warning">
                                                    <ArrowClockwise/>
                                                </Button>
                                                <Button className="mx-2 px-3 py-2" onClick={() => DeleteWord(word, i)}
                                                        variant="outline-danger">
                                                    <Trash/>
                                                </Button>

                                            </div>
                                        ) : ""}

                                    </summary>
                                    {/*<div id={word.id} className="flex flex-col border-2 rounded-lg m-3 p-2 text-white">*/}
                                    <div className="flex items-center mt-1">
                                        <span className="w-[7rem]">{t('alrihian')}</span>
                                        <input disabled={!logged} defaultValue={word.alrihian}
                                               id={`${word.id}-alrihian`}
                                               className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"/>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-[7rem]">{t('latvian')}</span>
                                        <input disabled={!logged} defaultValue={word.latvian} id={`${word.id}-latvian`}
                                               className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"/>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-[7rem]">{t('description')}</span>
                                        <textarea
                                            disabled={!logged}
                                            defaultValue={word.description}
                                            id={`${word.id}-description`}
                                            rows={2}
                                            className="p-2 w-[25rem] resize-x h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-[7rem]">{t('speech')}</span>
                                        <select
                                            disabled={!logged}
                                            defaultValue={word.partofspeech} id={`${word.id}-speech`}
                                            className="p-2 bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300">
                                            {options.map((option, i) => (
                                                <option value={options1[i]}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center">
                                        <details>
                                            <summary>{t('examples')}</summary>
                                            <textarea
                                                disabled={!logged}
                                                defaultValue={word.examples.join("\n")}
                                                id={`${word.id}-examples`}
                                                className="p-2 min-w-[25vw] max-w-[30vw] md:min-w-[40vw] md:max-w-[45vw] sm:min-w-[70vw] sm:max-w-[85vw] resize h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                                            />
                                        </details>


                                    </div>
                                    <div className={"word-author flex justify-end items-center"}>
                                        <span className={"mr-2"}>{t('author')}: {word.author != undefined? Authors[word.author?.id] != undefined? Authors[word.author?.id].name: t('order_none')  : t('order_none')}</span>
                                        {/*<img height={40} width={40} className={"rounded-full border-2 border-white"} src={image}></img>*/}
                                    </div>
                                    {/*</div>*/}
                                </details>
                            </>
                        ))}
                    </div>
                    {/*<WordsElement words={words.data}></WordsElement>*/}


                </>
            ) : null}
            <div className={"flex justify-center h-full relative sticky bottom-0"}>
                <CustomPagination setQuery={setQueriesLoaded} setFilter={setFilter} data={words}></CustomPagination>
            </div>
        </>
    )
}



function FilterToQuery() {

}