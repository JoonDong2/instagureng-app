import React, { useState } from "react";

const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);
    const onChangeText = text => {
        setValue(text);
    };

    return { value, onChangeText };
}

export default useInput;