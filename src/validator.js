/* eslint-disable */
import validator from 'validator';

const CHINESE_REG = /^[\u4e00-\u9fa5]{0,}$/;
const QQ_REG = /[1-9][0-9]{4,}/;
const ID_CARD_REG = /^\d{15}$|\d{17}[Xx]$|\d{18}$/;
const BASE_PASSWORD_REG = /^[a-zA-Z]\w{5,17}$/; // 密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)
const SAFE_PASSWORD_REG = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/; // 必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-16之间

export default Object.assign({}, validator, {
    is(value, rule) {
        return rule.reg.test(value); // 个性化的正则表达式校验
    },
    isChinese(value) {
        return CHINESE_REG.test(value);
    },
    isIdCard(value) {
        return ID_CARD_REG.test(value);
    },
    isQQ(value) {
        return QQ_REG.test(value);
    },
    isBasePassword(value) {
        return BASE_PASSWORD_REG.test(value);
    },
    isSafePassword(value) {
        return SAFE_PASSWORD_REG.test(value);
    },
    contains(value, rule) {
        return validator.contains(value, rule.seed);
    },
    equals(value, rule) {
        return validator.equals(value, rule.comparison);
    },
    isAfter(value, rule) {
        return validator.isAfter(value, rule.now);
    },
    isBefore(value, rule) {
        return validator.isBefore(value, rule.now);
    },
    isAlpha(value, rule) {
        return validator.isAlpha(value, rule.locale);
    },
    isAlphanumeric(value, rule) {
        return validator.isAlphanumeric(value, rule.locale);
    },
    isByteLength(value, rule) {
        return validator.isByteLength(value, rule.options);
    },
    isCurrency(value, rule) {
        return validator.isCurrency(value, rule.options);
    },
    isDecimal(value, rule) {
        return validator.isDecimal(value, rule.options);
    },
    isDivisibleBy(value, rule) {
        return validator.isDivisibleBy(value, rule.number);
    },
    isEmail(value, rule) {
        return validator.isEmail(value, rule.options);
    },
    isFQDN(value, rule) {
        return validator.isFQDN(value, rule.options);
    },
    isFloat(value, rule) {
        return validator.isFloat(value, rule.options);
    },
    isHash(value, rule) {
        return validator.isHash(value, rule.algorithm);
    },
    isIP(value, rule) {
        return validator.isIP(value, rule.version);
    },
    isISBN(value, rule) {
        return validator.isISBN(value, rule.version);
    },
    isISSN(value, rule) {
        return validator.isISSN(value, rule.options);
    },
    isIn(value, rule) {
        return validator.isIn(value, rule.values);
    },
    isInt(value, rule) {
        return validator.isInt(value, rule.options);
    },
    isLength(value, rule) {
        return validator.isLength(value, rule.options);
    },
    isMobilePhone(value, rule) {
        return validator.isMobilePhone(value, rule.locale, rule.options);
    },
    isPostalCode(value, rule) {
        return validator.isPostalCode(value, rule.locale);
    },
    isURL(value, rule) {
        return validator.isURL(value, rule.options);
    },
    isUUID(value, rule) {
        return validator.isUUID(value, rule.version);
    },
    isWhitelisted(value, rule) {
        return validator.isWhitelisted(value, rule.chars);
    },
    matches(value, rule) {
        return validator.matches(value, rule.pattern || rule.reg, rule.modifiers);
    },
});
