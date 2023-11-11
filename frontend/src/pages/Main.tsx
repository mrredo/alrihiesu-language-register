import {useState, useEffect} from "react"
import Input from "./components/input";
import {i18n} from '../App';
import {useTranslation} from "react-i18next";
interface WordFilter  {
    "words_per_page": number,
    "specific_words": string[],
    "order": number,
    "part_of_speech": string[],
    "starts_with": string,
    "ends_with": string,
    "contains": string
}
interface WordMetaData {
    "document_count": number,
    "document_count_by_filter": number,
    "current_page": number,
    "page_count": number,
    "data": Word[]
}
interface Word {
    "id": string,
    "alrihian": string,
    "latvian": string,
    "description": string,
    "partofspeech": string,
    "examples": string[]
}
let proxy = "http://localhost:4000"
export default function Main() {
    const { t } = useTranslation()
    let [options, setOptions] = useState([])
    let [words, setWords] = useState({
        "document_count": 0,
        "document_count_by_filter": 0,
        "current_page": 0,
        "page_count": 0,
        "data": []
    } as WordMetaData)

    useEffect(() => {
        setOptions(t('partOfSpeech', {returnObjects:true}) as any)

        const fetchWords = () => {

            fetch(`${proxy}/api/word?p=1`, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify({
                    "words_per_page": 0,
                    "specific_words": [],
                    "order": 0,
                    "part_of_speech": [],
                    "starts_with": "",
                    "ends_with": "",
                    "contains": ""
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((dat) => dat.json()).then((data => {
                setWords(data)
            })).catch(err => console.error)
        }
        fetchWords()

    }, [])
    const changeLanguage = (lng: any) => {
        i18n.changeLanguage(lng);
        setOptions(t('partOfSpeech', {returnObjects:true}) as any)
    };
    // @ts-ignore
    return (
        <>
            {words.data.length !== 0? (
                <>
                    {/*{t('test')}*/}
                    <button className={"p-2 border-2 m-3 rounded-lg text-white"} onClick={() => changeLanguage('lv')}>Latvian</button>
                    <button className={"p-2 border-2 m-3 rounded-lg text-white"} onClick={() => changeLanguage('en')}>English</button>
                    <div className="flex flex-col border-2 rounded-lg m-3 p-2 text-white">
                        <div className="flex items-center">
                            <span className="w-[7rem]">{t('alrihian')}:</span>
                            <input id="id-alrihian" className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300" />
                        </div>
                        <div className="flex items-center">
                            <span className="w-[7rem]">{t('latvian')}:</span>
                            <input id="id-latvian" className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300" />
                        </div>
                        <div className="flex items-center">
                            <span className="w-[7rem]">{t('description')}:</span>
                            <textarea
                                id="id-description"
                                rows={2}
                                className="p-2 w-[15rem] resize-x h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="w-[7rem]">{t('speech')}:</span>
                            <select id="id-speech" className="p-2 bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300">
                                {options.map(option => (
                                    <option value={option}>{option}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <details>
                                <summary>{t('examples')}</summary>
                                <textarea
                                    id="id-examples"
                                    className="p-2 w-[15rem] resize h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                                />
                            </details>


                        </div>
                    </div>





                    {words.document_count_by_filter}
                    {words.data.map((word, i) => (
                        <div className="flex flex-col border-2 rounded-lg m-3 p-2 text-white">
                            <div className="flex items-center">
                                <span className="w-[7rem]">{t('alrihian')}:</span>
                                <input value={word.alrihian} id={`${word.id}-alrihian`} className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300" />
                            </div>
                            <div className="flex items-center">
                                <span className="w-[7rem]">{t('latvian')}:</span>
                                <input value={word.latvian} id={`${word.id}-latvian`} className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300" />
                            </div>
                            <div className="flex items-center">
                                <span className="w-[7rem]">{t('description')}:</span>
                                <textarea
                                    value={word.description}
                                    id={`${word.id}-description`}
                                    rows={2}
                                    className="p-2 w-[15rem] resize-x h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                                />
                            </div>
                            <div className="flex items-center">
                                <span className="w-[7rem]">{t('speech')}:</span>
                                <select value={word.partofspeech} id={`${word.id}-speech`} className="p-2 bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300">
                                    {options.map(option => (
                                        <option value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center">
                                <details>
                                    <summary>{t('examples')}</summary>
                                    <textarea
                                        value={word.examples.join("\n")}
                                        id={`${word.id}-examples`}
                                        className="p-2 w-[15rem] resize h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                                    />
                                </details>


                            </div>
                        </div>
                    ))}
                </>
            ) : null}
        </>
    )
}