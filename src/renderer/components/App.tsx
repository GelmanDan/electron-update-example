import {hot} from "react-hot-loader/root";
import React, {useState, useEffect} from "react";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const {ipcRenderer} = require('electron');

export default (): JSX.Element => {

    const [message, setMessage] = useState('');
    const [version, setVersion] = useState('');
    const [progressBar, setProgressBar] = useState('');

    ipcRenderer.on('message', (event, text) => {

        let message = document.createElement('div')
        setMessage(text);

    })

    ipcRenderer.on('version', (event, text) => {
        setVersion(text)
    })

    ipcRenderer.on('download-progress', (event, text) => {
        setProgressBar(text)
    })

    return (
        <div>
            <h1>TEST0</h1>
            <h3>message: {message}</h3>
            <h3>version: {version}</h3>
            <h3>progress: {progressBar}%</h3>
        </div>
    )
};
