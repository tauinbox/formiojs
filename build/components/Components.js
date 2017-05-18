'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioComponents = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _clone2 = require('lodash/clone');

var _clone3 = _interopRequireDefault(_clone2);

var _remove2 = require('lodash/remove');

var _remove3 = _interopRequireDefault(_remove2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _Base = require('./base/Base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormioComponents = exports.FormioComponents = function (_BaseComponent) {
  _inherits(FormioComponents, _BaseComponent);

  function FormioComponents(component, options, data) {
    _classCallCheck(this, FormioComponents);

    var _this = _possibleConstructorReturn(this, (FormioComponents.__proto__ || Object.getPrototypeOf(FormioComponents)).call(this, component, options, data));

    _this.type = 'components';
    _this.components = [];
    _this.hidden = [];
    return _this;
  }

  _createClass(FormioComponents, [{
    key: 'build',
    value: function build() {
      this.createElement();
      this.addComponents();
    }

    /**
     * Perform a deep iteration over every component, including those
     * within other container based components.
     *
     * @param {function} cb - Called for every component.
     */

  }, {
    key: 'everyComponent',
    value: function everyComponent(cb) {
      var _this2 = this;

      (0, _each3.default)(this.components, function (component) {
        if (component.type === 'components') {
          if (component.everyComponent(cb) === false) {
            return false;
          }
        } else if (cb(component, _this2.components) === false) {
          return false;
        }
      });
    }

    /**
     * Perform an iteration over each component within this container component.
     *
     * @param {function} cb - Called for each component
     */

  }, {
    key: 'eachComponent',
    value: function eachComponent(cb) {
      (0, _each3.default)(this.components, function (component) {
        if (cb(component) === false) {
          return false;
        }
      });
    }

    /**
     * Returns a component provided a key. This performs a deep search within the
     * component tree.
     *
     * @param {string} key - The key of the component to retrieve.
     * @param {function} cb - Called with the component once found.
     * @return {Object} - The component that is located.
     */

  }, {
    key: 'getComponent',
    value: function getComponent(key, cb) {
      var comp = null;
      this.everyComponent(function (component, components) {
        if (component.component.key === key) {
          comp = component;
          if (cb) {
            cb(component, components);
          }
          return false;
        }
      });
      return comp;
    }

    /**
     * Return a component provided the Id of the component.
     *
     * @param {string} id - The Id of the component.
     * @param {function} cb - Called with the component once it is retrieved.
     * @return {Object} - The component retrieved.
     */

  }, {
    key: 'getComponentById',
    value: function getComponentById(id, cb) {
      var comp = null;
      this.everyComponent(function (component, components) {
        if (component.id === id) {
          comp = component;
          if (cb) {
            cb(component, components);
          }
          return false;
        }
      });
      return comp;
    }

    /**
     * Add a new component to the components array.
     *
     * @param {Object} component - The component JSON schema to add.
     * @param {HTMLElement} element - The DOM element to append this child to.
     * @param {Object} data - The submission data object to house the data for this component.
     * @return {BaseComponent} - The created component instance.
     */

  }, {
    key: 'addComponent',
    value: function addComponent(component, element, data) {
      element = element || this.element;
      data = data || this.data;
      var components = require('./index');
      var comp = components.create(component, this.options, data);
      this.components.push(comp);
      this.setHidden(comp);
      element.appendChild(comp.getElement());
      return comp;
    }

    /**
     * Remove a component from the components array.
     *
     * @param {BaseComponent} component - The component to remove from the components.
     * @param {Array<BaseComponent>} components - An array of components to remove this component from.
     */

  }, {
    key: 'removeComponent',
    value: function removeComponent(component, components) {
      component.destroy();
      var element = component.getElement();
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
      (0, _remove3.default)(components, { id: component.id });
    }

    /**
     * Removes a component provided the API key of that component.
     *
     * @param {string} key - The API key of the component to remove.
     * @param {function} cb - Called once the component is removed.
     * @return {null}
     */

  }, {
    key: 'removeComponentByKey',
    value: function removeComponentByKey(key, cb) {
      var _this3 = this;

      var comp = this.getComponent(key, function (component, components) {
        _this3.removeComponent(component, components);
        if (cb) {
          cb(component, components);
        }
      });
      if (!comp) {
        if (cb) {
          cb(null);
        }
        return null;
      }
    }

    /**
     * Removes a component provided the Id of the component.
     *
     * @param {string} id - The Id of the component to remove.
     * @param {function} cb - Called when the component is removed.
     * @return {null}
     */

  }, {
    key: 'removeComponentById',
    value: function removeComponentById(id, cb) {
      var _this4 = this;

      var comp = this.getComponentById(id, function (component, components) {
        _this4.removeComponent(component, components);
        if (cb) {
          cb(component, components);
        }
      });
      if (!comp) {
        if (cb) {
          cb(null);
        }
        return null;
      }
    }

    /**
     *
     * @param element
     * @param data
     */

  }, {
    key: 'addComponents',
    value: function addComponents(element, data) {
      var _this5 = this;

      element = element || this.element;
      data = data || this.data;
      (0, _each3.default)(this.component.components, function (component) {
        return _this5.addComponent(component, element, data);
      });
    }
  }, {
    key: 'updateValue',
    value: function updateValue(noValidate) {
      (0, _each3.default)(this.components, function (comp) {
        return comp.updateValue(noValidate);
      });
    }

    /**
     * A more performant way to check the conditions, calculations, and validity of
     * a submission once it has been changed.
     *
     * @param data
     * @param noValidate
     */

  }, {
    key: 'checkData',
    value: function checkData(data, noValidate) {
      (0, _each3.default)(this.components, function (comp) {
        comp.checkConditions(data);
        comp.calculateValue(data);
        if (!noValidate) {
          comp.checkValidity(data);
        }
      });
    }
  }, {
    key: 'checkConditions',
    value: function checkConditions(data) {
      _get(FormioComponents.prototype.__proto__ || Object.getPrototypeOf(FormioComponents.prototype), 'checkConditions', this).call(this, data);
      (0, _each3.default)(this.components, function (comp) {
        return comp.checkConditions(data);
      });
    }
  }, {
    key: 'calculateValue',
    value: function calculateValue(data) {
      _get(FormioComponents.prototype.__proto__ || Object.getPrototypeOf(FormioComponents.prototype), 'calculateValue', this).call(this, data);
      (0, _each3.default)(this.components, function (comp) {
        return comp.calculateValue(data);
      });
    }
  }, {
    key: 'checkValidity',
    value: function checkValidity(data, dirty) {
      var check = _get(FormioComponents.prototype.__proto__ || Object.getPrototypeOf(FormioComponents.prototype), 'checkValidity', this).call(this, data, dirty);
      (0, _each3.default)(this.components, function (comp) {
        check &= comp.checkValidity(data, dirty);
      });
      return check;
    }
  }, {
    key: 'destroy',
    value: function destroy(all) {
      var _this6 = this;

      _get(FormioComponents.prototype.__proto__ || Object.getPrototypeOf(FormioComponents.prototype), 'destroy', this).call(this, all);
      var components = (0, _clone3.default)(this.components);
      (0, _each3.default)(components, function (comp) {
        return _this6.removeComponent(comp, _this6.components);
      });
    }
  }, {
    key: 'setHidden',
    value: function setHidden(component) {
      if (component.components && component.components.length) {
        component.hideComponents(this.hidden);
      } else {
        component.visible = !this.hidden || this.hidden.indexOf(component.component.key) === -1;
      }
    }
  }, {
    key: 'hideComponents',
    value: function hideComponents(hidden) {
      var _this7 = this;

      this.hidden = hidden;
      this.eachComponent(function (component) {
        return _this7.setHidden(component);
      });
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.data;
    }
  }, {
    key: 'setValue',
    value: function setValue(value, noUpdate, noValidate) {
      if (!value) {
        return;
      }
      this.value = value;
      (0, _each3.default)(this.components, function (component) {
        if (component.type === 'button') {
          return;
        }

        if (component.type === 'components') {
          component.setValue(value, noUpdate, noValidate);
        } else if (value && value.hasOwnProperty(component.component.key)) {
          component.setValue(value[component.component.key], noUpdate);
        } else if (component.component.input) {
          component.setValue(null, noUpdate, true);
        }
      });
    }
  }, {
    key: 'disabled',
    set: function set(disabled) {
      (0, _each3.default)(this.components, function (component) {
        return component.disabled = disabled;
      });
    }
  }, {
    key: 'errors',
    get: function get() {
      var errors = [];
      (0, _each3.default)(this.components, function (comp) {
        var compErrors = comp.errors;
        if (compErrors.length) {
          errors = errors.concat(compErrors);
        }
      });
      return errors;
    }
  }]);

  return FormioComponents;
}(_Base.BaseComponent);