interface WordFilter  {
    "words_per_page": number,
    "specific_words": string[],
    "page": number,
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
type WordMap = {
    [wordId: string]: Word
};
export {
    Word,
    WordFilter,
    WordMetaData,
    WordMap
}