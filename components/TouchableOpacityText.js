import React, {useState} from "react";
import { Animated } from "react-native";

export default ({ onPress, style, children }) => {
    const outputBase = (style === undefined || style.color === undefined) ? "rgba(0,0,0," : getRGBColor(style.color);
    const [_color] = useState(new Animated.Value(1));
    const interpolatedColor = _color.interpolate({
        inputRange: [0, 1],
        outputRange: [outputBase + "0.3)", outputBase + "1)"]
    });

    const fadeIn = () => {
        Animated.timing(
            _color,
            {
              toValue: 0,
              duration: 200,
            }
          ).start();
    };
    
    const fadeOut = () => {
        Animated.timing(_color, {
            toValue: 1,
            duration: 200
        }).start();
    };

    const _onPress = async () => {
        if(onPress !== undefined) {
            onPress();
        }
        
        fadeIn();
        await delay(200);
        fadeOut();
    };
    
    return (
        <Animated.Text 
            style={{
                ...style,
                color: interpolatedColor
            }} 
            onPress={_onPress}
        >
            {children}
        </Animated.Text>
    );
}

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getRGBColor = (color) => {
    const hexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i;
    const hexToRGB = (hex) => {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
    
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
        (`rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},`)
         : null;
    }
    

    if(hexRegex.test(color)) {
        return hexToRGB(color);
    } else {
        const splits = color.split(",");
        return splits[0] + "," + splits[1] + "," + splits[2] + ",";
    }
}