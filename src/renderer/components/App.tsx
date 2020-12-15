import {hot} from "react-hot-loader/root";
import React, {useState, useEffect} from "react";
const { ipcRenderer } = require('electron');

export default (): JSX.Element => {

    const [waitingDeepLink, setWaitingDeepLink] = useState(false);
    const [minimize, setMinimize] = useState(false);
    const [deepLink, setDeepLink] = useState('');

    return (
        <div>
           TEST
        </div>
    )
};
