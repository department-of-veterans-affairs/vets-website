/* eslint-disable */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SubLevel = function (_React$Component) {
  _inherits(SubLevel, _React$Component);

  function SubLevel(props) {
    _classCallCheck(this, SubLevel);

    var _this = _possibleConstructorReturn(this, (SubLevel.__proto__ || Object.getPrototypeOf(SubLevel)).call(this, props));

    _this.state = {
      hidden: props.hidden
    };
    return _this;
  }

  _createClass(SubLevel, [{
    key: 'getLinkClassNames',
    value: function getLinkClassNames() {
      if (this.state.hidden) {
        return '';
      }

      return 'usa-current';
    }
  }, {
    key: 'getLiClassNames',
    value: function getLiClassNames() {
      if (this.state.hidden) {
        return '';
      }

      return 'active-menu';
    }
  }, {
    key: 'getLinkTag',
    value: function getLinkTag() {
      var _this2 = this;

      if (this.props.href) {
        return _react2.default.createElement(
          'div',
          { className: 'menu-item-container' },
          _react2.default.createElement(
            'a',
            { className: 'level-one ' + (this.props.isCurrentPage(this.props) ? ' usa-current' : ''), href: '/' + this.props.href },
            this.props.title
          )
        );
      }

      return _react2.default.createElement(
        'div',
        {
          className: 'menu-item-container ' + this.getLinkClassNames(),
          onClick: function onClick() {
            return _this2.toggleMenu();
          },
          role: 'button',
          tabIndex: 0 },
        _react2.default.createElement(
          'a',
          { className: 'level-one ' + (this.props.isCurrentPage(this.props) ? ' usa-current' : '') },
          this.props.title
        ),
        this.getIconElement()
      );
    }
  }, {
    key: 'getIconElement',
    value: function getIconElement() {
      if (this.state.hidden) {
        return _react2.default.createElement('i', { className: 'icon-small fa fa-plus' });
      }

      return _react2.default.createElement('i', { className: 'icon-small fa fa-minus' });
    }
  }, {
    key: 'toggleMenu',
    value: function toggleMenu() {
      this.setState({
        hidden: !this.state.hidden
      });
    }
  }, {
    key: 'renderList',
    value: function renderList() {
      if (!this.state.hidden) {
        return _react2.default.createElement(
          'ul',
          { className: 'usa-sidenav-sub_list' },
          this.props.children && this.props.children
        );
      }

      return '';
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'li',
        { className: this.getLiClassNames() },
        this.getLinkTag(),
        this.renderList()
      );
    }
  }]);

  return SubLevel;
}(_react2.default.Component);

exports.default = SubLevel;


SubLevel.propTypes = {
  stuff: _propTypes2.default.string
};

SubLevel.defaultProps = {};
