import React, { useState } from 'react';
import { View } from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';

type Props = {
    onAuthenticated: (email: string, ...args: unknown[]) => unknown
}

const Login = (props: Props) => {
    const [email, setEmail] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleLogin = async () => {
        props.onAuthenticated(email)
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ flex: 0.1, marginHorizontal: 20, marginBottom: 20 }}>
                <Input
                    validate
                    text={email}
                    placeholder='Enter Email'
                    onEdit={t => setEmail(t)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                />
            </View>

            <View style={{ flex: 0.1, marginHorizontal: 20 }}>
                <Button onPress={handleLogin} title='Sign In' disabled={isTyping || email.length < 1} />
            </View>
        </View>
    )
}

export default Login;
