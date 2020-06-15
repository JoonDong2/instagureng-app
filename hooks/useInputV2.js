import React, { useState } from "react";

const useInputV2 = initialValue => {
    const [value, setValue] = useState(initialValue);
    const onChangeText = text => {
        setValue(text);
    };

    return { value, onChangeText, setValue };
}

export default useInputV2;