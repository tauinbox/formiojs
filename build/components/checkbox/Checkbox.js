'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckBoxComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Base = require('../base/Base');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckBoxComponent = exports.CheckBoxComponent = function (_BaseComponent) {
  _inherits(CheckBoxComponent, _BaseComponent);

  function CheckBoxComponent() {
    _classCallCheck(this, CheckBoxComponent);

    return _possibleConstructorReturn(this, (CheckBoxComponent.__proto__ || Object.getPrototypeOf(CheckBoxComponent)).apply(this, arguments));
  }

  _createClass(CheckBoxComponent, [{
    key: 'elementInfo',
    value: function elementInfo() {
      var info = _get(CheckBoxComponent.prototype.__proto__ || Object.getPrototypeOf(CheckBoxComponent.prototype), 'elementInfo', this).call(this);
      info.type = 'input';
      info.changeEvent = 'click';
      info.attr.type = this.component.inputType;
      info.attr.class = '';
      if (this.component.name) {
        info.attr.name = 'data[' + this.component.name + ']';
      }
      info.attr.value = this.component.value ? this.component.value : 0;
      return info;
    }
  }, {
    key: 'build',
    value: function build() {
      if (!this.component.input) {
        return;
      }
      this.createElement();
      this.input = this.createInput(this.element);
      this.createLabel(this.element, this.input);
      if (!this.label) {
        this.addInput(this.input, this.element);
      }
      if (this.options.readOnly) {
        this.disabled = true;
      }
    }
  }, {
    key: 'createElement',
    value: function createElement() {
      var className = 'form-group';
      if (this.component.label) {
        className += ' checkbox';
      }
      if (this.component.validate && this.component.validate.required) {
        className += ' required';
      }
      this.element = this.ce('element', 'div', {
        id: this.id,
        class: className
      });
    }
  }, {
    key: 'createLabel',
    value: function createLabel(container, input) {
      if (!this.component.label) {
        return null;
      }
      this.label = this.ce('label', 'label', {
        class: 'control-label'
      });
      if (this.info.attr.id) {
        this.label.setAttribute('for', this.info.attr.id);
      }
      this.addInput(input, this.label);
      if (!this.options.inputsOnly) {
        this.label.appendChild(document.createTextNode(this.component.label));
      }
      container.appendChild(this.label);
    }
  }, {
    key: 'createInput',
    value: function createInput(container) {
      if (!this.component.input) {
        return;
      }
      var input = this.ce('input', this.info.type, this.info.attr);
      this.errorContainer = container;
      return input;
    }
  }, {
    key: 'addInputEventListener',
    value: function addInputEventListener(input) {
      var _this2 = this;

      this.addEventListener(input, this.info.changeEvent, function () {
        // If this input has a "name", then its other input elements are elsewhere on
        // the form. To get the correct submission object, we need to refresh the whole
        // data object.
        if (_this2.component.name) {
          _this2.emit('refreshData');
        } else {
          _this2.updateValue();
        }
      });
    }
  }, {
    key: 'getValueAt',
    value: function getValueAt(index) {
      return !!this.inputs[index].checked;
    }
  }, {
    key: 'setValue',
    value: function setValue(value, noUpdate, noValidate) {
      this.value = value;
      if (!this.input) {
        return;
      }
      if (value === 'on') {
        this.input.value = 1;
        this.input.checked = 1;
      } else if (value === 'off') {
        this.input.value = 0;
        this.input.checked = 0;
      } else if (value) {
        this.input.value = 1;
        this.input.checked = 1;
      } else {
        this.input.value = 0;
        this.input.checked = 0;
      }
      if (!noUpdate) {
        this.updateValue(noValidate);
      }
    }
  }]);

  return CheckBoxComponent;
}(_Base.BaseComponent);