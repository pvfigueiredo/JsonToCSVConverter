import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import CsvTable from './CsvTable';
import Papa from 'papaparse';

const FileProcessor = () => {
    const [jsonContent, setJsonContent] = useState('');
    const [csvFile, setCsvFile] = useState(null);
    const [csvData, setCsvData] = useState([]);

    const isValidJson = (text) => {
        try {
            JSON.parse(text);
            return true
        } catch (e) {
            return false;
        }
    };

    const handleClear = () => {
        setJsonContent('');
    }

    const onDrop = (acceptedFiles) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;
            if (isValidJson(text)) {
                setJsonContent(text);
            }
            else {
                alert("Formato Invalido!");
            }
            
        }
        reader.readAsText(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handlePaste = (event) => {
        setJsonContent(event.target.value);
    };

    const handleProcessFile = async () => {
        try {
            if (!isValidJson(jsonContent)) {
                setJsonContent('');               
                alert("Formato invalido!");
                return;
            }

            const response = await axios.post('https://localhost:7246/api/JsonToCsv/convert', JSON.parse(jsonContent), {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'text/csv' });
            const text = await blob.text();
            const url = window.URL.createObjectURL(blob);

            setCsvFile(url);

            Papa.parse(text, {
                complete: (result) => {
                    setCsvData(result.data);
                },
                header: false
            });
        } catch (error) {
            console.error('Erro ao tentar converter o arquivo/text: ', error);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <div {...getRootProps()} style={{ border: '2px dashed #007bff', padding: '20px', marginBottom: '20px' }}>
                <input {...getInputProps()} />
                <p>Arraste um arquivo JSON aqui, ou clique para selecionar um arquivo.</p>
            </div>
            <textarea
                placeholder="Cole ou digite um JSON aqui. "
                rows="10"
                style={{ width: '100%', marginBottom: '20px' }}
                value={jsonContent}
                onChange={handlePaste}
            ></textarea>
            <button onClick={handleProcessFile} style={{ marginBottom: '20px', margin: '20px' }}>Converter</button>
            <button onClick={handleClear} style={{ marginBottom: '20px', margin: '20px' }}>Limpar</button>
            {csvFile && (
                <div>
                    <a href={csvFile} download="converted.csv">Download arquivo CSV</a>
                </div>
            )}
            {csvData.length > 0 ? <div> <CsvTable data={csvData} /> </div> : <p>Carregando dados...</p>}
        </div>
    );
};

export default FileProcessor;