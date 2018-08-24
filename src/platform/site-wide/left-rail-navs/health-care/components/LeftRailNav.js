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

var _SubLevel = require('./SubLevel');

var _SubLevel2 = _interopRequireDefault(_SubLevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LeftRailNav = function (_React$Component) {
  _inherits(LeftRailNav, _React$Component);

  function LeftRailNav() {
    _classCallCheck(this, LeftRailNav);

    return _possibleConstructorReturn(this, (LeftRailNav.__proto__ || Object.getPrototypeOf(LeftRailNav)).apply(this, arguments));
  }

  _createClass(LeftRailNav, [{
    key: 'getSubLevel',
    value: function getSubLevel(section, i) {
      var _this2 = this;

      if (section.links) {
        return _react2.default.createElement(
          _SubLevel2.default,
          {
            key: section.title + ' ' + i,
            title: section.title,
            hidden: this.props.hidden(section.links),
            isCurrentPage: function isCurrentPage(link) {
              return _this2.props.isCurrentPage(link);
            } },
          section.links.map(function (link, j) {

            var href = link.href;
            // If the link isn't external...
            if (href.indexOf('http') === -1) {
              // Make sure it starts with a slash
              if (href[0] !== '/') {
                href = href += '/';
              }
            }

            return _react2.default.createElement(
              'li',
              { key: link.text + ' ' + j },
              _react2.default.createElement(
                'a',
                { className: _this2.props.isCurrentPage(link) && 'usa-current', href: href },
                link.text
              )
            );
          })
        );
      }

      return _react2.default.createElement(_SubLevel2.default, {
        key: section.title + ' ' + i,
        title: section.text,
        href: section.href,
        isCurrentPage: function isCurrentPage(link) {
          return _this2.props.isCurrentPage(link);
        } });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'button',
          { type: 'button', className: 'va-btn-close-icon va-sidebarnav-close' },
          'Close this menu'
        ),
        _react2.default.createElement(
          'div',
          { className: 'left-side-nav-title' },
          _react2.default.createElement('i', { className: 'icon-small fa ' + this.props.icon }),
          _react2.default.createElement(
            'h4',
            null,
            this.props.title
          )
        ),
        _react2.default.createElement(
          'ul',
          { className: 'usa-sidenav-list' },
          this.props.data.map(function (section, i) {
            return _this3.getSubLevel(section, i);
          })
        )
      );
    }
  }]);

  return LeftRailNav;
}(_react2.default.Component);

exports.default = LeftRailNav;


LeftRailNav.propTypes = {
  stuff: _propTypes2.default.string
};

LeftRailNav.defaultProps = {};
