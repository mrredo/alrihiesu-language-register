import React, {useEffect, useState} from 'react';

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

    const handleInputChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const newValues = [...inputValues]; // Assuming inputValues is defined elsewhere

        // Create a copy of the value object using spread syntax
        const updatedValue = { ...selectedMap[id] };
        updatedValue.name = event.target?.value;

        // Update the selectedMap state using the functional form of setState
        setSelectedMap(prevState => ({
            ...prevState,
            [id]: updatedValue // Use computed property names to update the specific key
        }));
    };

    useEffect(() => {
        console.log(selectedMap["1"])
    }, [selectedMap])
    const switchMap = (newMap: Map) => {
        console.log(selectedMap)
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
            {Object.keys(selectedMap).map((word, index) => (
                <input
                    key={word}
                    type="text"
                    value={selectedMap[word].name}
                    placeholder={`Enter name ${index + 1}`}
                    onChange={(event) => handleInputChange(word, event)}
                />
            ))}
        </div>
    );
};

export default MyComponent;
