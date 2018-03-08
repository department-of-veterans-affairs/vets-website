import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class InformationLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggleOpen = (e) => {
    e.preventDefault();
    this.setState({ open: !this.state.open });
  }

  render() {
    const className = classNames(
      'form-expanding-group',
      { 'form-expanding-group-open': this.state.open }
    );

    return (
      <div className={className}>
        <button className="va-button-link dashed-underline" onClick={this.toggleOpen}>{this.props.linkText || 'Which should I choose?'}</button>
        {this.state.open && this.props.children}
        {this.state.open &&
          <button className="va-button-link" onClick={this.toggleOpen}>Close</button>
        }
      </div>
    );
  }
}

InformationLink.propTypes = {
  linkText: PropTypes.string
};

