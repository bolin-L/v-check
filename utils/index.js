/* eslint-disable */
import validator from 'validator';

export default {
    isNullOrUndefined(value) {
        return value === null || value === undefined;
    },

    addEventListener(el, eventName, cb) {
        if (Array.isArray(eventName)) {
            for(let i = 0; i < eventName.length; i++) {
                el.addEventListener(eventName[i], cb, false);
            }
        } else {
            el.addEventListener(eventName, cb, false);
        }
    },

    isTextInput(el) {
        return validator.isIn(el.type, ['text', 'password', 'search', 'email', 'tel', 'url', 'textarea']);
    },

    isCheckboxOrRadioInput(el) {
        return validator.isIn(el.type, ['radio', 'checkbox']);
    }
}
