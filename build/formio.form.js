"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioForm = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nativePromiseOnly = require("native-promise-only");

var _nativePromiseOnly2 = _interopRequireDefault(_nativePromiseOnly);

var _formio = require("./formio");

var _formio2 = _interopRequireDefault(_formio);

var _Components = require("./components/Components");

var _debounce2 = require("lodash/debounce");

var _debounce3 = _interopRequireDefault(_debounce2);

var _each2 = require("lodash/each");

var _each3 = _interopRequireDefault(_each2);

var _clone2 = require("lodash/clone");

var _clone3 = _interopRequireDefault(_clone2);

var _eventemitter = require("eventemitter2");

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getOptions = function getOptions(options) {
  options = options || {};
  options.events = new _eventemitter2.default({
    wildcard: false,
    maxListeners: 0
  });
  return options;
};

/**
 * Renders a Form.io form within the webpage.
 *
 * @example
 * import FormioForm from 'formiojs/form';
 * let form = new FormioForm(document.getElementById('formio'));
 * form.src = 'https://examples.form.io/example';
 */

var FormioForm = exports.FormioForm = function (_FormioComponents) {
  _inherits(FormioForm, _FormioComponents);

  /**
   * Creates a new FormioForm instance.
   *
   * @param {Object} element - The DOM element you wish to render this form within.
   * @param {Object} options - The options to create a new form instance.
   * @param {boolean} options.readOnly - Set this form to readOnly
   * @param {boolean} options.noAlerts - Set to true to disable the alerts dialog.
   * @param {boolean} options.i18n - The translation file for this rendering. @see https://github.com/formio/formio.js/blob/master/src/locals/en.js
   * @param {boolean} options.template - Provides a way to inject custom logic into the creation of every element rendered within the form.
   *
   * @example
   * import FormioForm from 'formiojs/form';
   * let form = new FormioForm(document.getElementById('formio'), {
   *   readOnly: true
   * });
   * form.src = 'https://examples.form.io/example';
   *
   */
  function FormioForm(element, options) {
    _classCallCheck(this, FormioForm);

    /**
     * The type of this element.
     * @type {string}
     */
    var _this = _possibleConstructorReturn(this, (FormioForm.__proto__ || Object.getPrototypeOf(FormioForm)).call(this, null, getOptions(options)));

    _this.type = 'form';
    _this._src = '';
    _this._loading = true;
    _this._submission = {};

    /**
     * The Formio instance for this form.
     * @type {Formio}
     */
    _this.formio = null;

    /**
     * The loader HTML element.
     * @type {HTMLElement}
     */
    _this.loader = null;

    /**
     * The alert HTML element
     * @type {HTMLElement}
     */
    _this.alert = null;

    /**
     * Promise that is triggered when the form is done loading.
     * @type {Promise}
     */
    _this.onFormLoad = null;

    /**
     * Promise that is triggered when the submission is done loading.
     * @type {Promise}
     */
    _this.onSubmissionLoad = null;

    /**
     * Promise that is triggered when the form is done building.
     * @type {Promise}
     */
    _this.onFormBuild = null;

    /**
     * Promise that executes when the form is ready and rendered.
     * @type {Promise}
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.ready.then(() => {
     *   console.log('The form is ready!');
     * });
     * form.src = 'https://examples.form.io/example';
     */
    _this.ready = new _nativePromiseOnly2.default(function (resolve, reject) {
      /**
       * Called when the ready state of this form has been resolved.
       *
       * @type {function}
       */
      _this.readyResolve = resolve;

      /**
       * Called when this form could not load and is rejected.
       *
       * @type {function}
       */
      _this.readyReject = reject;
    });

    /**
     * Triggers a new submission change after a certain debounce interval.
     *
     * @type {function} - Call then when you wish to trigger a submission change.
     */
    _this.triggerSubmissionChange = (0, _debounce3.default)(_this.onSubmissionChange.bind(_this), 10);

    /**
     * Promise to trigger when the element for this form is established.
     *
     * @type {Promise}
     */
    _this.onElement = new _nativePromiseOnly2.default(function (resolve) {
      /**
       * Called when the element has been resolved.
       *
       * @type {function}
       */
      _this.elementResolve = resolve;
      _this.setElement(element);
    });
    return _this;
  }

  /**
   * Sets the the outside wrapper element of the Form.
   *
   * @param {HTMLElement} element - The element to set as the outside wrapper element for this form.
   */


  _createClass(FormioForm, [{
    key: "setElement",
    value: function setElement(element) {
      if (!element) {
        return;
      }

      // Allow the element to either be a form, or a wrapper.
      if (element.nodeName.toLowerCase() === 'form') {
        /**
         * {@link BaseComponent.element}
         */
        this.element = element;
        var classNames = this.element.getAttribute('class');
        classNames += ' formio-form';
        this.element.setAttribute('class', classNames);
      } else {
        /**
         * The wrapper element for this form component.
         * @type {HTMLElement}
         */
        this.wrapper = element;
        this.element = this.ce('element', 'form', {
          class: 'formio-form'
        });
        if (this.wrapper) {
          this.wrapper.appendChild(this.element);
        }
      }

      this.elementResolve(element);
    }

    /**
     * Get the embed source of the form.
     *
     * @returns {string}
     */

  }, {
    key: "setForm",


    /**
     * Sets the JSON schema for the form to be rendered.
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.setForm({
     *   components: [
     *     {
     *       type: 'textfield',
     *       key: 'firstName',
     *       label: 'First Name',
     *       placeholder: 'Enter your first name.',
     *       input: true
     *     },
     *     {
     *       type: 'textfield',
     *       key: 'lastName',
     *       label: 'Last Name',
     *       placeholder: 'Enter your last name',
     *       input: true
     *     },
     *     {
     *       type: 'button',
     *       action: 'submit',
     *       label: 'Submit',
     *       theme: 'primary'
     *     }
     *   ]
     * });
     *
     * @param {Object} form - The JSON schema of the form @see https://examples.form.io/example for an example JSON schema.
     * @returns {*}
     */
    value: function setForm(form) {
      var _this2 = this;

      if (form.display === 'wizard') {
        console.warn('You need to instantiate the FormioWizard class to use this form as a wizard.');
      }

      if (this.onFormBuild) {
        return this.onFormBuild.then(function () {
          return _this2.createForm(form);
        });
      }

      // Create the form.
      return this.createForm(form);
    }

    /**
     * Sets the form value.
     *
     * @alias setForm
     * @param {Object} form - The form schema object.
     */

  }, {
    key: "createForm",


    /**
     * Create a new form.
     *
     * @param {Object} form - The form object that is created.
     * @returns {Promise.<TResult>}
     */
    value: function createForm(form) {
      var _this3 = this;

      /**
       * {@link BaseComponent.component}
       */
      this.component = form;
      this.loading = true;
      return this.onFormBuild = this.render().then(function () {
        return _this3.onLoaded.then(function () {
          _this3.loading = false;
          _this3.readyResolve();
          _this3.setValue(_this3.value);
          _this3.onFormBuild = null;
        }, function (err) {
          return _this3.readyReject(err);
        });
      }, function (err) {
        return _this3.readyReject(err);
      });
    }

    /**
     * Render the form within the HTML element.
     * @returns {Promise.<TResult>}
     */

  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return this.onElement.then(function () {
        _this4.clear();
        return _this4.localize().then(function () {
          _this4.build();
          _this4.on('resetForm', function () {
            return _this4.reset();
          }, true);
          _this4.on('componentChange', function (changed) {
            return _this4.triggerSubmissionChange(changed);
          }, true);
          _this4.on('refreshData', function () {
            return _this4.updateValue();
          });
          _this4.emit('render');
        });
      });
    }

    /**
     * Sets a new alert to display in the error dialog of the form.
     *
     * @param {string} type - The type of alert to display. "danger", "success", "warning", etc.
     * @param {string} message - The message to show in the alert.
     */

  }, {
    key: "setAlert",
    value: function setAlert(type, message) {
      if (this.options.noAlerts) {
        if (!message) {
          this.emit('error', false);
        }
        return;
      }
      if (this.alert) {
        try {
          this.removeChild(this.alert);
          this.alert = null;
        } catch (err) {}
      }
      if (message) {
        this.alert = this.ce('alert-' + type, 'div', {
          class: 'alert alert-' + type,
          role: 'alert'
        });
        this.alert.innerHTML = message;
      }
      if (!this.alert) {
        return;
      }
      this.prepend(this.alert);
    }

    /**
     * Build the form.
     */

  }, {
    key: "build",
    value: function build() {
      var _this5 = this;

      this.on('submitButton', function () {
        return _this5.submit();
      }, true);
      this.addComponents();
      this.checkConditions(this.getValue());
    }

    /**
     * Show the errors of this form within the alert dialog.
     *
     * @param {Object} error - An optional additional error to display along with the component errors.
     * @returns {*}
     */

  }, {
    key: "showErrors",
    value: function showErrors(error) {
      this.loading = false;
      var errors = this.errors;
      if (error) {
        errors.push(error);
      }
      if (!errors.length) {
        this.setAlert(false);
        return;
      }
      var message = '<p>' + this.t('error') + '</p><ul>';
      (0, _each3.default)(errors, function (err) {
        if (err) {
          var errorMessage = err.message || err;
          message += '<li><strong>' + errorMessage + '</strong></li>';
        }
      });
      message += '</ul>';
      this.setAlert('danger', message);
      this.emit('error', errors);
      return errors;
    }

    /**
     * Called when the submission has completed, or if the submission needs to be sent to an external library.
     *
     * @param {Object} submission - The submission object.
     * @param {boolean} saved - Whether or not this submission was saved to the server.
     * @returns {object} - The submission object.
     */

  }, {
    key: "onSubmit",
    value: function onSubmit(submission, saved) {
      this.loading = false;
      this.setAlert('success', '<p>' + this.t('complete') + '</p>');
      this.emit('submit', submission);
      if (saved) {
        this.emit('submitDone', submission);
      }
      return submission;
    }

    /**
     * Called when an error occurs during the submission.
     *
     * @param {Object} error - The error that occured.
     */

  }, {
    key: "onSubmissionError",
    value: function onSubmissionError(error) {
      if (!error) {
        return;
      }

      // Normalize the error.
      if (typeof error === 'string') {
        error = { message: error };
      }

      this.showErrors(error);
    }

    /**
     * Called when the submission has changed in value.
     *
     * @param {Object} changed - The changed value that triggered this event.
     * @param {Object} changed.component - The component that was changed.
     * @param {*} changed.value - The new value of the changed component.
     * @param {boolean} changed.validate - If the change needs to be validated.
     */

  }, {
    key: "onSubmissionChange",
    value: function onSubmissionChange(changed) {
      var value = (0, _clone3.default)(this.submission);
      value.changed = changed;
      this.checkData(value.data, !changed.validate);
      this.emit('change', value);
    }

    /**
     * Resets the submission of a form and restores defaults.
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.src = 'https://examples.form.io/example';
     * form.submission = {data: {
     *   firstName: 'Joe',
     *   lastName: 'Smith',
     *   email: 'joe@example.com'
     * }};
     *
     * // In two seconds, reset the data in the form.
     * setTimeout(() => form.reset(), 2000);
     */

  }, {
    key: "reset",
    value: function reset() {
      // Reset the submission data.
      this.submission = { data: {} };
    }

    /**
     * Cancels the submission.
     *
     * @alias reset
     */

  }, {
    key: "cancel",
    value: function cancel() {
      this.reset();
    }

    /**
     * Submits the form.
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.src = 'https://examples.form.io/example';
     * form.submission = {data: {
     *   firstName: 'Joe',
     *   lastName: 'Smith',
     *   email: 'joe@example.com'
     * }};
     * form.submit().then((submission) => {
     *   console.log(submission);
     * });
     *
     * @returns {Promise} - A promise when the form is done submitting.
     */

  }, {
    key: "submit",
    value: function submit() {
      var _this6 = this;

      // Validate the form builed, before submission
      if (this.checkValidity(this.submission.data, true)) {
        this.loading = true;
        if (!this.formio) {
          return this.onSubmit(this.submission, false);
        }
        return this.formio.saveSubmission(this.submission).then(function (submission) {
          return _this6.onSubmit(submission, true);
        }).catch(function (err) {
          return _this6.onSubmissionError(err);
        });
      } else {
        this.showErrors();
        return _nativePromiseOnly2.default.reject('Invalid Submission');
      }
    }
  }, {
    key: "src",
    get: function get() {
      return this._src;
    }

    /**
     * Set the Form source, which is typically the Form.io embed URL.
     *
     * @param {string} value - The value of the form embed url.
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.ready.then(() => {
     *   console.log('The form is ready!');
     * });
     * form.src = 'https://examples.form.io/example';
     */
    ,
    set: function set(value) {
      var _this7 = this;

      if (!value || typeof value !== 'string') {
        return;
      }
      this._src = value;
      this.formio = new _formio2.default(value);
      this.onFormLoad = this.formio.loadForm().then(function (form) {
        return _this7.form = form;
      });
      if (this.formio.submissionId) {
        this.onSubmissionLoad = this.formio.loadSubmission().then(function (submission) {
          return _this7.submission = submission;
        });
      }
    }

    /**
     * Called when both the form and submission have been loaded.
     *
     * @returns {Promise} - The promise to trigger when both form and submission have loaded.
     */

  }, {
    key: "onLoaded",
    get: function get() {
      if (!this.onSubmissionLoad && !this.onFormLoad) {
        return _nativePromiseOnly2.default.resolve();
      }
      return this.onSubmissionLoad ? this.onSubmissionLoad : this.onFormLoad;
    }

    /**
     * Returns if this form is loading.
     *
     * @returns {boolean} - TRUE means the form is loading, FALSE otherwise.
     */

  }, {
    key: "loading",
    get: function get() {
      return this._loading;
    }

    /**
     * Set the loading state for this form, and also show the loader spinner.
     *
     * @param {boolean} loading - If this form should be "loading" or not.
     */
    ,
    set: function set(loading) {
      this._loading = loading;
      if (!this.loader && loading) {
        this.loader = this.ce('loaderWrapper', 'div', {
          class: 'loader-wrapper'
        });
        var spinner = this.ce('loader', 'div', {
          class: 'loader text-center'
        });
        this.loader.appendChild(spinner);
      }
      if (this.loader) {
        try {
          if (loading) {
            this.before(this.loader);
          } else {
            this.remove(this.loader);
          }
        } catch (err) {}
      }
    }
  }, {
    key: "form",
    set: function set(form) {
      this.setForm(form);
    }

    /**
     * Returns the submission object that was set within this form.
     *
     * @returns {Object}
     */

  }, {
    key: "submission",
    get: function get() {
      this._submission.data = this.getValue();
      return this._submission;
    }

    /**
     * Sets the submission of a form.
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.src = 'https://examples.form.io/example';
     * form.submission = {data: {
     *   firstName: 'Joe',
     *   lastName: 'Smith',
     *   email: 'joe@example.com'
     * }};
     *
     * @param {Object} submission - The Form.io submission object.
     */
    ,
    set: function set(submission) {
      var _this8 = this;

      submission = submission || {};
      this._submission = submission;
      /**
       * {@link BaseComponent.value}
       */
      this.value = submission.data;
      this.ready.then(function () {
        return _this8.setValue(_this8.value);
      });
    }
  }]);

  return FormioForm;
}(_Components.FormioComponents);

FormioForm.setBaseUrl = _formio2.default.setBaseUrl;
FormioForm.setApiUrl = _formio2.default.setApiUrl;
FormioForm.setAppUrl = _formio2.default.setAppUrl;

/**
 * Embed this form within the current page.
 * @param embed
 */
FormioForm.embed = function (embed) {
  if (!embed || !embed.src) {
    return null;
  }
  var id = embed.id || 'formio-' + Math.random().toString(36).substring(7);
  var className = embed.class || 'formio-form-wrapper';
  var code = embed.styles ? '<link rel="stylesheet" href="' + embed.styles + '">' : '';
  code += '<div id="' + id + '" class="' + className + '"></div>';
  document.write(code);
  var formElement = document.getElementById(id);
  var form = new FormioForm(formElement);
  form.src = embed.src;
  return form;
};

module.exports = global.FormioForm = FormioForm;