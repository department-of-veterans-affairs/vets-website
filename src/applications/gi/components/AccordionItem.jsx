import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';

class AccordionItem extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      expanded: props.expanded,
      button: props.button,
    };
    this.id = _.uniqueId('accordion-item-');
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded });

    recordEvent({
      event: this.state.expanded
        ? 'nav-accordion-collapse'
        : 'nav-accordion-expand',
    });
  }

  render() {
    const expanded = this.state.expanded;
    const headerClasses = classNames('accordion-button-wrapper', {
      [this.props.headerClass]: this.props.headerClass,
    });
    return (
      <li
        id={`${this.props.button.toLowerCase().replace(/\s/g, '-')}-accordion`}
      >
        <h2 className={headerClasses}>
          <button
            onClick={this.toggle}
            className="usa-accordion-button"
            aria-expanded={expanded}
            aria-controls={this.id}
          >
            <span className="vads-u-font-family--serif accordion-button-text">
              {this.props.button}
            </span>
          </button>
        </h2>
        <div
          id={this.id}
          className="usa-accordion-content"
          aria-hidden={!expanded}
        >
          {this.props.children}
        </div>
      </li>
    );
  }
}

AccordionItem.propTypes = {
  expanded: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  button: PropTypes.string.isRequired,
};

AccordionItem.defaultProps = {
  expanded: true,
};

export default AccordionItem;
