/* eslint-disable */
import defaultRules from './defaultRules';
import validator from './validator';
import utils from '../utils/index';

class VCheck {
    install(Vue, options) {
        this.config = options || {};
        this.defaultRules = Object.assign(defaultRules, this.config.defaultRules);
        this.Vue = Vue;

        Vue.directive(this.config.directiveName || 'check', {
            inserted: this.initCheck.bind(this),
        });
    }

    initCheck(el, binding, vnode) {
        const checkDataChoice = {
            string: { type: binding.value },
            array: {rules: binding.value },
            object: binding.value
        };
        const checkData = checkDataChoice[utils.typeof(binding.value)] || {};
        const checkType = checkData.type;
        const rules = checkData.rules || [];
        // attr may be a.b.c or a[b][c] todo
        const checkAttr = checkData.checkAttr || this.config.defaultCheckAttr || 'value';
        const eventType = this.addEventPrefix(checkData.event || (checkData.isRealTime ? 'change' : 'blur'));
        const compIns = this.resolveComponentInstance(el, vnode);
        let value = compIns[checkAttr] || checkData[checkAttr];

        if (checkData.checkInit) {
            this.validate(value, rules, checkType, compIns, checkAttr);
        }

        compIns.$on(eventType, () => {
            // value may be change
            value = compIns[checkAttr] || checkData[checkAttr];
            this.check(value, rules, checkType, compIns, checkAttr);
        });

        this.addSelfToContainer(rules, checkType, compIns, checkAttr);
    }

    check(value, rules, checkType, compIns, checkAttr) {
        rules = (this.defaultRules[checkType] || []).concat(rules);

        let conclusion = {
            success: true,
            message: '',
            checkAttr,
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
                success = rule.method.call(null, value, rule, compIns, checkAttr, validator);
            } else {
                conclusion = {
                    success: false,
                    message: '找不到此规则的校验方法',
                    checkAttr,
                };
            }

            if (!success || !conclusion.success) {
                conclusion.message = rule.message || conclusion.message;
                conclusion.success = false;
                break; // 有错误则跳出
            }
        }

        const ev = this.addEventPrefix(conclusion.success ? 'valid' : 'invalid');
        const errHandle = this.config.errorHandle;

        if (compIns) {
            compIns.$emit(ev, conclusion);
        }

        if (typeof errHandle === 'function') {
            errHandle.call(this, value, rules, checkType, compIns, checkAttr);
        }

        return conclusion;
    }

    checkAll(container, returnWhenError) {
        const comps = container.$checkControls || [];
        let errors = [];
        let comp;
        let value;

        for (let i = 0; i < comps.length; i++) {
            comp = comps[i];
            value = comp.compIns[comp.checkAttr];

            const result = this.validate(value, comp.rules, comp.checkType, comp.compIns, comp.checkAttr);

            errors.push(result);

            if (!result.success && returnWhenError) {
                break;
            }
        }

        return result;
    }

    addSelfToContainer(rules, checkType, compIns, checkAttr) {
        let parent = compIns.$parent;
        let hasGetContainer;

        do {
            while (parent) {
                if (parent.$refs.checkContainer) {
                    parent.$checkControls = parent.$checkControls || [];
                    parent.$checkControls.push({
                        rules,
                        checkType,
                        compIns,
                        checkAttr,
                        parent,
                    });

                    parent.checkAll = this.checkAll.bind(this, parent);

                    parent.$on('destroyed', this.removeComp.bind(this, compIns, parent));

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

    resolveComponentInstance(el, vnode) {
        let instance = vnode.componentInstance;

        return !utils.isNullOrUndefined(instance) ? instance : this.wrapComponentInstance(el, vnode);
    }

    wrapComponentInstance(el, vnode) {
        let inputEvent = utils.isTextInput(el) ? ['focus', 'input', 'change', 'blur'] : ['change', 'select', 'click'];

        el = this.createVm(el, vnode, inputEvent);
        // inputEvent = Array.isArray(inputEvent) ? inputEvent : [inputEvent];

        for(let i = 0; i < inputEvent.length; i++) {
            utils.addEventListener(el, inputEvent[i], () => {
                el.$emit(this.addEventPrefix(inputEvent[i]), {
                    target: el
                });
            });
        }

        return el;
    }

    createVm(el, vnode) {
        const events = (vnode.data || {}).on || {};

        for(let ev in events) {
            if (events[ev] && !Array.isArray(events[ev])) {
                events[ev] = [events[ev]];
            }
        }

        return Object.assign(el, {
            $on: this.Vue.prototype.$on,
            $emit: this.Vue.prototype.$emit,
            _events: events,
            $parent: vnode.context
        });
    }

    removeComp(compIns, parent) {
        const index = parent.$checkControls.indexOf(compIns);
        parent.splice(index, 1);
    }

    addEventPrefix(ev) {
        if (!this.config.eventPatch) {
            return ev;
        }

        let evArr = Array.isArray(ev) ? ev : [ev];

        evArr = evArr.map((e) => {
            if (this.config.eventPatch.events) {
                return validator.isIn(e, this.config.eventPatch.events) ? this.config.eventPatch.prefix + e : e;
            } else {
                return this.config.eventPatch.prefix + e;
            }
        });

        return typeof ev === 'string' ? evArr[0] : evArr;
    }
}

export default new VCheck();
