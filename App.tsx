import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { Keyboard, Text, View, ScrollView, Dimensions, ViewStyle, StyleProp, TextStyle } from 'react-native';

import store from './store';

import Login from './screens/Login';

import Input from './components/Input';
import Button from './components/Button';

export type ReactStateAction<T> = React.Dispatch<React.SetStateAction<T>>

const { startFirebase, writeFirestore, useListenFirestore, unsubscribeFn } = store;

startFirebase();

const FETCH_MESSAGES_INTERVAL = 1; // in seconds
const HEIGHT = Dimensions.get('screen').height;

const msgCont: ViewStyle = {
  borderRadius: 10,
  marginVertical: 5,
  minHeight: HEIGHT * 0.08,
  marginHorizontal: 10
}

const msgInfoTextStyle: StyleProp<TextStyle> = {
  fontSize: 10,
  fontWeight: '600',
  color: '#34b7f1',
  marginLeft: 10,
  marginTop: 5
}

const msgTextStyle: StyleProp<TextStyle> = {
  fontSize: 14,
  fontWeight: '400',
  color: 'white',
  margin: 10
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stopListening, setStopListening] = useState(false);

  const [email, setEmail] = useState(null);
  const [msg, setMsg] = useState(null);

  const scrollRef: MutableRefObject<ScrollView> = useRef();

  // hooks do not re-run after a params' value has changed.
  // this problem happens because I did not use separate screens with navigation but, this would not happen in a real world app where navigation is used.
  const { messageCount, messages, updated } = useListenFirestore(FETCH_MESSAGES_INTERVAL, stopListening);

  useEffect(() => {
    return () => {
      if (unsubscribeFn) unsubscribeFn();
    }
  }, []);

  if (!isLoggedIn) return <Login
    onAuthenticated={email => {
      setIsLoggedIn(true);
      // setStopListening(false);
      setEmail(email);
    }}
  />;

  const handleSendMsg = async () => {
    setMsg('');
    Keyboard.dismiss();

    if (scrollRef && scrollRef.current) scrollRef.current.scrollToEnd();

    await writeFirestore({
      date: Date.now(),
      email,
      msg
    });
  }
  
  messages && messages.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  })

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} style={{ flex: 0.9, borderBottomWidth: 1, borderBottomColor: '#075e54', marginTop: HEIGHT * 0.05 }}>
        {
          messages && messages.length > 0
          ? messages.map((m, idx) => {
            const parsed = new Date(m.date);

            let date: string | number = parsed.getDate();
            if (date < 10) date = `0${date}`;

            let month: string | number = parsed.getMonth() + 1;
            if (month < 10) month = `0${month}`;

            let hours: string | number = parsed.getHours();
            if (hours < 10) hours = `0${hours}`;

            let minutes: string | number = parsed.getMinutes();
            if (minutes < 10) minutes = `0${minutes}`;

            const time = hours + ":" + minutes;

            return (
              <View style={[msgCont, { backgroundColor: m.email === email ? '#075e54' : 'black' }]} key={idx}>
                <Text style={msgInfoTextStyle}>{m.email} {date}/{month} | {time}</Text>
                <Text style={msgTextStyle}>{m.msg}</Text>
              </View>
            )
          })
          : <Text style={{ alignSelf: 'center' }}>No Message Found</Text>
        }
      </ScrollView>

      <View style={{ flex: 0.1, flexDirection: 'row', marginBottom: 20, marginHorizontal: 10, marginTop: 10 }}>
        <View style={{ flex: 0.75, marginRight: 5 }}>
          <Input multiline text={msg} placeholder='Your Message' onEdit={t => setMsg(t)} />
        </View>
        
        <View style={{ flex: 0.25, marginRight: 0 }}>
          <Button onPress={handleSendMsg} title='Send' disabled={!msg || msg.length < 1} />
        </View>
    </View>

    </View>
  );
}
