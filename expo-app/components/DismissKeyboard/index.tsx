import type { ReactElement } from "react";
import {
    TouchableWithoutFeedback,
    Keyboard,
    StyleProp,
    ViewStyle,
} from "react-native";

type DismissKeyboardProps = {
    children: ReactElement;
    style?: StyleProp<ViewStyle>;
};

const DismissKeyboard = ({ children, style }: DismissKeyboardProps) => {
    return (
        <TouchableWithoutFeedback
            style={style}
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            {children}
        </TouchableWithoutFeedback>
    );
};

export default DismissKeyboard;
