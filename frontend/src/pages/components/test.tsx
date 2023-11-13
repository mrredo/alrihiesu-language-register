import React, { useState } from 'react';

interface MyComponentProps {
    nameList: string[];
}

type Map = {
    [wordId: string]: {
        name: string;
    };
};

const map1: Map = {
    "1": {
        name: "word1",
    },
    "2": {
        name: "word2",
    },
    "3": {
        name: "word3",
    },
    "4": {
        name: "word4",
    },
};

const map2: Map = {
    "5": {
        name: "word5",
    },
    "6": {
        name: "word6",
    },
    "7": {
        name: "word7",
    },
    "8": {
        name: "word8",
    },
};

const MyComponent: React.FC<MyComponentProps> = ({ nameList }) => {
    const [selectedMap, setSelectedMap] = useState<Map>(map1);
    const [inputValues, setInputValues] = useState<string[]>(nameList);

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newValues = [...inputValues];
        newValues[index] = event.target.value;
        setInputValues(newValues);
    };

    const switchMap = (newMap: Map) => {
        setSelectedMap(newMap);
        setInputValues(Object.values(newMap).map((word) => word.name));
    };

    return (
        <div>
            {/* Switch button */}
            <button onClick={() => switchMap(selectedMap === map1 ? map2 : map1)}>
                Switch Map
            </button>

            {/* Dynamically render input fields based on the selected map */}
            {Object.values(selectedMap).map((word, index) => (
                <input
                    key={index}
                    type="text"
                    value={inputValues[index]}
                    placeholder={`Enter name ${index + 1}`}
                    onChange={(event) => handleInputChange(index, event)}
                />
            ))}
        </div>
    );
};

export default MyComponent;
