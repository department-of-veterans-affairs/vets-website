import React from 'react';
// import PropTypes from 'prop-types';

export default class SubLevel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: props.hidden,
    };
  }

  getLinkClassNames() {
    if (this.state.hidden) {
      return '';
    }

    return 'usa-current';
  }

  getLiClassNames() {
    if (this.state.hidden) {
      return '';
    }

    return 'active-menu';
  }

  getLinkTag() {
    if (this.props.href) {

      return (
        <div className="menu-item-container">
          <a
            className={`${this.props.levelOne ? 'level-one' : ''}${this.props.isCurrentPage(this.props) ? ' usa-current' : ''}`}
            href={`${this.props.href}`}
            target={this.props.target ? this.props.target : ''}>
            {this.props.title}
          </a>
        </div>
      );
    }

    return (
      <div
        className={`menu-item-container ${this.getLinkClassNames()}`}
        onClick={() => this.toggleMenu()}
        role="button"
        tabIndex={0}>
        <a className={`${this.props.levelOne ? 'level-one' : ''}${this.props.isCurrentPage(this.props) ? ' usa-current' : ''}`}>
          {this.props.title}
        </a>
        {this.getIconElement()}
      </div>
    );
  }

  getIconElement() {
    if (this.props.icon ===  false) {
      return (
        <i></i>
      );
    }

    if (this.state.hidden) {
      return (
        <i className="icon-small fa fa-plus"></i>
      );
    }

    return (
      <i className="icon-small fa fa-minus"></i>
    );
  }

  toggleMenu() {
    this.setState({
      hidden: !this.state.hidden,
    });
  }

  renderList() {
    if (!this.state.hidden) {
      return (
        <ul className="usa-sidenav-sub_list">
          {this.props.children && this.props.children}
        </ul>
      );
    }

    return '';
  }

  render() {
    return (
      <li className={this.getLiClassNames()}>
        {this.getLinkTag()}

        {this.renderList()}

      </li>
    );
  }
}

// SubLevel.propTypes = {};
//
// SubLevel.defaultProps = {};
