import React from 'react';
import { Text, View, TouchableOpacity, ViewStyle, StyleProp, TextStyle } from 'react-native';

type Props = {
    onPress: (...args: unknown[]) => unknown
    title: string
    disabled?: boolean
}

const titleStyle: StyleProp<TextStyle> = {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    fontSize: 24,
    color: 'white'
};

const btnCont: ViewStyle = {
    flex: 1,
    borderRadius: 20
};

const Button = (props: Props) => {
    const { onPress, title, disabled } = props;
    
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} activeOpacity={0.8} style={[btnCont, { backgroundColor: disabled ? 'gray' : '#075e54' }]}>
            <Text style={titleStyle}>{title || 'BLANK TITLE'}</Text>
        </TouchableOpacity>
    )
};

export default Button;
