import {Word} from "../../interfaces/words";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
const options1 = ["noun", "verb", "adjective", "adverb", "pronoun", "conjunction", "preposition", "other"]

interface Props {
    words: Word[]
}
interface WordMap {
    [id: string]: Word
}

const WordsElement: React.FC<Props> = ({words}) => {
    const [wordMap, setWordMap] = useState(new Map<string, Word>())
    const { t } = useTranslation()
    let [options, setOptions] = useState([])
    useEffect(() => {
        setOptions(t('partOfSpeech', {returnObjects: true}) as any)
    }, [])
    function LoadWords() {
        let list = []
        for (const word of words) {
            wordMap.set(word.id as string, word)
            list.push((
                <details id={`${word.id}`} className={"flex flex-col border-2 rounded-lg m-3 p-2 text-white"}>
                    <summary>{word.alrihian}-{word.latvian}</summary>
                    {/*<div id={word.id} className="flex flex-col border-2 rounded-lg m-3 p-2 text-white">*/}
                    <div className="flex items-center">
                        <span className="w-[7rem]">{t('alrihian')}:</span>
                        <input
                            onChange={(event) => handleInputChange(word.id as string, "alrihian", event)}
                            value={word.alrihian} id={`${word.id}-alrihian`} className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300" />
                    </div>
                    <div className="flex items-center">
                        <span className="w-[7rem]">{t('latvian')}:</span>
                        <input

                            defaultValue={word.latvian} id={`${word.id}-latvian`} className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300" />
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
            ))
        }
        return list
    }
    useEffect(() => {
        for (const word of words) {
            wordMap.set(word.id as string, word)
        }
        setWordMap(wordMap)
    }, [words])
    const handleInputChange = (id: string, field: string, event: React.ChangeEvent<HTMLInputElement>) => {
        let word1 = wordMap.get(id) as Word
        (word1 as any)[field] = event.target.value
        wordMap.set(id, word1)
        setWordMap(wordMap);
    };

    return (
        <>
            {LoadWords()}
            {/*{words.map(word => (*/}
            {/*    <details id={`${wordMap[word.id].id}`} className={"flex flex-col border-2 rounded-lg m-3 p-2 text-white"}>*/}
            {/*        <summary>{wordMap[word.id].alrihian}-{wordMap[word.id].latvian}</summary>*/}
            {/*        /!*<div id={word.id} className="flex flex-col border-2 rounded-lg m-3 p-2 text-white">*!/*/}
            {/*        <div className="flex items-center">*/}
            {/*            <span className="w-[7rem]">{t('alrihian')}:</span>*/}
            {/*            <input*/}
            {/*                onChange={(event) => handleInputChange(word.id, "alrihian", event)}*/}
            {/*                value={wordMap[word.id].alrihian} id={`${wordMap[word.id].id}-alrihian`} className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300" />*/}
            {/*        </div>*/}
            {/*        <div className="flex items-center">*/}
            {/*            <span className="w-[7rem]">{t('latvian')}:</span>*/}
            {/*            <input*/}

            {/*                defaultValue={wordMap[word.id].latvian} id={`${wordMap[word.id].id}-latvian`} className="p-2 w-[15rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300" />*/}
            {/*        </div>*/}
            {/*        <div className="flex items-center">*/}
            {/*            <span className="w-[7rem]">{t('description')}:</span>*/}
            {/*            <textarea*/}
            {/*                defaultValue={wordMap[word.id].description}*/}
            {/*                id={`${wordMap[word.id].id}-description`}*/}
            {/*                rows={2}*/}
            {/*                className="p-2 w-[15rem] resize-x h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <div className="flex items-center">*/}
            {/*            <span className="w-[7rem]">{t('speech')}:</span>*/}
            {/*            <select defaultValue={wordMap[word.id].partofspeech} id={`${wordMap[word.id].id}-speech`} className="p-2 bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300">*/}
            {/*                {options.map((option, i) => (*/}
            {/*                    <option value={options1[i]}>{option}</option>*/}
            {/*                ))}*/}
            {/*            </select>*/}
            {/*        </div>*/}
            {/*        <div className="flex items-center">*/}
            {/*            <details>*/}
            {/*                <summary>{t('examples')}</summary>*/}
            {/*                <textarea*/}
            {/*                    defaultValue={wordMap[word.id].examples.join("\n")}*/}
            {/*                    id={`${wordMap[word.id].id}-examples`}*/}
            {/*                    className="p-2 w-[15rem] resize h-[4rem] bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"*/}
            {/*                />*/}
            {/*            </details>*/}


            {/*        </div>*/}
            {/*        /!*</div>*!/*/}
            {/*    </details>*/}
            {/*))}*/}
        </>
    )
}
export default WordsElement