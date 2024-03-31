import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, onSnapshot, query } from "firebase/firestore";

export enum Collections {
    USER,
    MESSAGES
}

type WriteDataType = {
    email: string
    msg: string
    date: number // Date in MS
}

let isInitialized = false;
let firebaseApp = null;

const startFirebase = () => {
    try {
        if (isInitialized) throw new Error('Already initialized');

        const config = {
            apiKey: "AIzaSyA_4I_NiSXSqLRTI-iMVoK9A3ToZVYVGkI",
            authDomain: "chat-app-case.firebaseapp.com",
            projectId: "chat-app-case",
            storageBucket: "chat-app-case.appspot.com",
            messagingSenderId: "342843153723",
            appId: "1:342843153723:web:a09beb27ba187096dbab1e"
        };
    
        firebaseApp = initializeApp(config);
        if(firebaseApp && firebaseApp.name) isInitialized = true;

    } catch (err) {
        console.warn('Error during initialization: ', err);
    }
}

const getFirestoreDB = () => {
    if (!isInitialized) return null;
    return getFirestore(firebaseApp);
};

const writeFirestore = async (data: WriteDataType, collectionName: Collections = Collections.MESSAGES): Promise<void> => {
    try {
        if (!isInitialized) throw new Error('Not initialized');
    
        const db = getFirestoreDB();
        if (!db) throw new Error('DB is null');

        await addDoc(collection(db, String(collectionName)), data);
    } catch (err) {
        console.warn('Error during write: ', err);
    }
};

let lastRefreshId: NodeJS.Timeout = null;
let unsubscribeFn = null;
const useListenFirestore = (interval: number, stop: boolean = false) => {
    try {
        const [messages, setMessages] = useState<WriteDataType[] | null>(null);
        const [messageCount, setMessageCount] = useState(0);
        const [refresh, setRefresh] = useState(false);

        const getUpdatedData = () => {
            if (!isInitialized) throw new Error('Not initialized');
    
            const db = getFirestoreDB();
            if (!db) throw new Error('DB is null');
    
            const messagesCollection = query(collection(db, String(Collections.MESSAGES)));
    
            unsubscribeFn = onSnapshot(messagesCollection, snapshot => {
                const msgBuffer: WriteDataType[] | null = [];
                snapshot.forEach(message => msgBuffer.push(message.data() as WriteDataType));
                
                setMessageCount(snapshot.size);
                setMessages(msgBuffer);
            });

            if (lastRefreshId) clearTimeout(lastRefreshId);
            lastRefreshId = setTimeout(() => setRefresh(p => !p), interval * 1000);
        }

        useEffect(() => {
            if (!stop) getUpdatedData();
        }, [refresh]);

        return { messages, messageCount, updated: true };
    } catch (err) {
        console.warn('Error when receiving new msg: ', err);
        return { messages: null, messageCount: null, updated: false };
    }
}

export default {
    startFirebase,
    getFirestoreDB,
    writeFirestore,
    useListenFirestore,
    unsubscribeFn
}
