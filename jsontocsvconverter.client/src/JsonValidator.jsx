import { useState, useEffect } from 'react';

const JsonValidator = () => {
    const [input, setInput] = useState('');
    const [isValid, setIsValid] = useState(null);

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInput(text);
        setIsValid(isValidJSON(text));
    };

    const isValidJSON = (text) => {
        try {
            JSON.parse(text);
            return true;
        } catch (e) {
            return false;
        }
    };

    useEffect(() => {
        if (isValid !== null) {
            alert(isValid ? 'JSON Válido' : 'JSON Inválido');
        }
    }, [isValid]);

    return (
        <div>
            <h2>JSON Validator</h2>
            <textarea
                value={input}
                onChange={handleInputChange}
                rows="10"
                cols="50"
                placeholder="Enter JSON text here"
            />
        </div>
    );
};

export default JsonValidator;
