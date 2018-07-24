import defaultRules from './defaultRules';
import validator from './validator';

class VCheck {
    install(Vue, options) {
        this.config = options || {};
        this.defaultRules = Object.assign(defaultRules, this.config.defaultRules);

        Vue.directive('v-check', {
            inserted: this.initCheck,
        });
    }

    validate(value, rules, checkType, vnode) {
        rules = (this.defaultRules[checkType] || []).concat(rules);

        let conclusion = {
            success: true,
            message: '',
        };
        let success = true;
        let rule;

        if (rules.length === 0) {
            return conclusion;
        }

        for (let i = 0, len = rules.length; i < len; i++) {
            rule = rules[i];

            if (validator[rule.type]) {
                success = validator[rule.type].call(null, value, rule);
            } else if (rule.method && typeof rule.method === 'function') {
                success = rule.method.call(null, value, rule, vnode, validator);
            } else {
                conclusion = {
                    success: false,
                    message: '找不到此规则的校验方法',
                };
            }

            if (!success || !conclusion.success) {
                conclusion.message = rule.message || conclusion.message;
                conclusion.success = false;
                break; // 有错误则跳出
            }
        }

        const result = conclusion.success ? 'valid' : 'invalid';

        if (vnode) {
            vnode.$emit(result, conclusion);
        }

        return conclusion;
    }

    validateAll(container) {
        const comps = container.$validationControls || [];
        let result = {
            success: true,
            message: '',
            attr: '',
        };
        const errorReuslts = [];
        let comp;

        for (let i = 0; i < comps.length; i++) {
            comp = comps[i];
            result = this.validate(comp.value, comp.rules, comp.checkType, comp.vnode);

            if (!result.success && this.config.validateAllWhatever) {
                result.attr = comp.checkAttr;
                errorReuslts.push(result);
            } else if (!result.success) {
                break;
            }
        }

        return errorReuslts.length > 0 ? errorReuslts : result;
    }

    initCheck(el, binding, vnode) {
        const checkData = binding.value || {};

        if (typeof checkData !== 'object') {
            return;
        }

        const checkType = checkData.type;
        const rules = checkData.rules || [];
        // attr may be a.b.c or a[b][c] todo
        const checkAttr = checkData.checkAttr || this.config.defaultCheckAttr || 'value';
        const value = vnode[checkAttr] || checkData[checkAttr];
        const eventType = checkData.event || checkData.isRealTime ? 'change' : 'blur';

        vnode.$on(eventType, () => {
            this.validate(value, rules, checkType, vnode);
        });

        this.addSelfToContainer(value, rules, checkType, vnode, checkAttr);
    }

    addSelfToContainer(value, rules, checkType, vnode, checkAttr) {
        let parent = vnode.$parent;
        let hasGetContainer;

        do {
            while (parent) {
                if (parent.$refs.validationContainer) {
                    parent.$validationControls = parent.$validationControls || [];
                    parent.$validationControls.push({
                        value,
                        rules,
                        checkType,
                        vnode,
                        checkAttr,
                    });

                    parent.validateAll = this.validateAll.bind(this, parent);

                    parent.$on('destroyed', this.removeComp.bind(this, vnode, parent));

                    hasGetContainer = true;
                    break;
                } else {
                    parent = parent.$parent;
                }
            }

            if (hasGetContainer) {
                break;
            }
        } while (parent);
    }

    removeComp(vnode, parent) {
        const index = parent.$validationControls.indexOf(vnode);
        parent.splice(index, 1);
    }
}

export default new VCheck();
