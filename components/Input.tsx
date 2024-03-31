import React, { useState } from 'react';
import { View, ViewStyle, TextInput } from 'react-native';

type Props = {
    onEdit: (text: string, ...args: unknown[]) => unknown
    onBlur?: (...args: unknown[]) => unknown
    onFocus?: (...args: unknown[]) => unknown
    placeholder: string
    text: string
    validate?: boolean
    multiline?: boolean
}

const cont: ViewStyle = {
    flex: 1,
    borderRadius: 20,
    borderWidth: 0.8,
};

const validateEmail = (val: string | null) => {
    if (!val) return false;
    const email = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    return email.test(val) ? true : false;
};

let timeoutId: NodeJS.Timeout | null = null;

const Input = (props: Props) => {
    const { onBlur, onEdit, placeholder, text, onFocus, validate = false, multiline = false } = props;

    const [hasError, setHasError] = useState(false);

    const handleBlur = () => {
        if (validate) {
            const isValid = validateEmail(text);
            if (!isValid) {
                setHasError(true);
                onEdit('');

                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => setHasError(false), 3000);

                return;
            }
        }

        if (onBlur) onBlur();
    }

    return (
        <View style={[cont, { borderColor: hasError ? 'red' : 'gray' }]}>
            <TextInput
                value={text || ''}
                style={{ flex: 1, justifyContent: 'center', marginLeft: 20, fontSize: 18, color: 'black' }}
                placeholderTextColor='gray'
                placeholder={hasError ? 'Validation Error!' : placeholder}
                onChangeText={onEdit}
                autoCapitalize='none'
                onBlur={handleBlur}
                onFocus={onFocus}
                returnKeyType='done'
                multiline={multiline}
            />
        </View>
    )
};

export default Input;
