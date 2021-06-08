import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { createId } from '../utils/helpers';

class SearchAccordion extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
    buttonOnClick: PropTypes.func.isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    expanded: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded,
    };
    this.id = `${createId(props.button)}-accordion`;
  }

  expanded = () => {
    if (this.props.section) {
      return this.props.expanded;
    }
    return this.state.expanded;
  };

  toggle = () => {
    const expanded = !this.expanded();
    const { onClick } = this.props;

    this.setState({ expanded });

    if (onClick) {
      onClick(expanded);
    }
  };

  renderHeader = () => {
    const expanded = this.expanded();
    const { section, button, headerClass } = this.props;
    if (section) {
      return (
        <button
          id={`${this.id}-button`}
          aria-expanded={expanded}
          aria-controls={this.id}
          onClick={this.toggle}
          className="usa-accordion-button vads-u-border--2px vads-u-border-style--solid vads-u-border-color--gray-light vads-u-margin--0"
        >
          <span className="section-button-span ">{button}</span>
        </button>
      );
    }

    const headerClasses = classNames(
      'accordion-button-wrapper update-results-header ',
      {
        [headerClass]: headerClass,
      },
    );

    return (
      <h2 className={headerClasses}>
        <button
          id={`${this.id}-button`}
          onClick={this.toggle}
          className="usa-accordion-button vads-u-font-size--md"
          aria-expanded={expanded}
          aria-controls={this.id}
        >
          <span className="vads-u-font-family--serif accordion-button-text">
            {button}
          </span>
        </button>
      </h2>
    );
  };

  render() {
    const expanded = this.expanded();
    const { children, buttonLabel, buttonOnClick } = this.props;

    return (
      <div className="usa-accordion-item" id={this.id}>
        {this.renderHeader()}
        <div
          id={`${this.id}-content`}
          className="usa-accordion-content update-results-form"
          aria-hidden={!expanded}
          hidden={!expanded}
        >
          {expanded ? children : null}
        </div>
        {expanded && (
          <div className="update-results">
            {' '}
            <button
              type="button"
              id="update-benefits-button"
              className="update-results-button"
              onClick={buttonOnClick}
            >
              {buttonLabel}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default SearchAccordion;
