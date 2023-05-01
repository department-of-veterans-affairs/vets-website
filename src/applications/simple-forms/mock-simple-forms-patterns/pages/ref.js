/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../../utils');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
} /* This file has been modified from the original forked source code */

function StringField(props) {
  var schema = props.schema,
    name = props.name,
    uiSchema = props.uiSchema,
    idSchema = props.idSchema,
    formData = props.formData,
    required = props.required,
    disabled = props.disabled,
    readonly = props.readonly,
    autofocus = props.autofocus,
    registry = props.registry,
    onChange = props.onChange,
    onBlur = props.onBlur;
  var title = schema.title,
    format = schema.format;
  var widgets = registry.widgets,
    formContext = registry.formContext;

  var enumOptions =
    Array.isArray(schema.enum) && (0, _utils.optionsList)(schema);
  var defaultWidget = format || (enumOptions ? 'select' : 'text');

  var _getUiOptions = (0, _utils.getUiOptions)(uiSchema),
    _getUiOptions$widget = _getUiOptions.widget,
    widget =
      _getUiOptions$widget === undefined ? defaultWidget : _getUiOptions$widget,
    _getUiOptions$placeho = _getUiOptions.placeholder,
    placeholder =
      _getUiOptions$placeho === undefined ? '' : _getUiOptions$placeho,
    options = _objectWithoutProperties(_getUiOptions, [
      'widget',
      'placeholder',
    ]);

  var Widget = (0, _utils.getWidget)(schema, widget, widgets);

  return _react2.default.createElement(Widget, {
    options: _extends({}, options, { enumOptions: enumOptions }),
    schema: schema,
    id: idSchema && idSchema.$id,
    label: title === undefined ? name : title,
    value: formData,
    onChange: onChange,
    onBlur: onBlur,
    required: required,
    disabled: disabled,
    readonly: readonly,
    formContext: formContext,
    autofocus: autofocus,
    registry: registry,
    placeholder: placeholder,
  });
}

if (process.env.NODE_ENV !== 'production') {
  StringField.propTypes = {
    schema: _propTypes2.default.object.isRequired,
    uiSchema: _propTypes2.default.object.isRequired,
    idSchema: _propTypes2.default.object,
    onChange: _propTypes2.default.func.isRequired,
    onBlur: _propTypes2.default.func.isRequired,
    formData: _propTypes2.default.oneOfType([
      _propTypes2.default.string,
      _propTypes2.default.number,
    ]),
    registry: _propTypes2.default.shape({
      widgets: _propTypes2.default.objectOf(
        _propTypes2.default.oneOfType([
          _propTypes2.default.func,
          _propTypes2.default.object,
        ]),
      ).isRequired,
      fields: _propTypes2.default.objectOf(_propTypes2.default.func).isRequired,
      definitions: _propTypes2.default.object.isRequired,
      formContext: _propTypes2.default.object.isRequired,
    }),
    formContext: _propTypes2.default.object.isRequired,
    required: _propTypes2.default.bool,
    disabled: _propTypes2.default.bool,
    readonly: _propTypes2.default.bool,
    autofocus: _propTypes2.default.bool,
  };
}

StringField.defaultProps = {
  uiSchema: {},
  registry: (0, _utils.getDefaultRegistry)(),
  disabled: false,
  readonly: false,
  autofocus: false,
};

exports.default = StringField;
