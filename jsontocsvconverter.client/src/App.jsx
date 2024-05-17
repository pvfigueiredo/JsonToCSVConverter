import React from 'react';
import './App.css';
import FileProcessor from './FileProcessor';
import CsvTable from './CsvTable';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Conversor de JSON para CSV</h1>
            </header>
            <FileProcessor />
        </div>
    );
}

export default App;