import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import { createId } from '../utils/helpers';

class AccordionItem extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    button: PropTypes.string.isRequired,
  };

  static defaultProps = {
    expanded: true,
    section: false,
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
    this.setState({ expanded });

    if (this.props.onClick) {
      this.props.onClick(expanded);
    }

    const type = this.props.section ? 'section' : 'accordion';
    recordEvent({
      event: expanded ? `nav-${type}-expand` : `nav-${type}-collapse`,
    });
  };

  renderHeader = () => {
    const expanded = this.expanded();
    const { section, button, headerClass } = this.props;
    if (section) {
      return (
        <button
          aria-expanded={expanded}
          aria-controls={this.id}
          onClick={this.toggle}
          className="usa-accordion-button vads-u-border--2px vads-u-border-style--solid vads-u-border-color--gray-light vads-u-margin--0"
        >
          <span className="section-button-span">{button}</span>
        </button>
      );
    }

    const headerClasses = classNames('accordion-button-wrapper', {
      [headerClass]: headerClass,
    });

    return (
      <h2 className={headerClasses}>
        <button
          onClick={this.toggle}
          className="usa-accordion-button"
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
    const { section, children } = this.props;

    const liClassName = section ? 'section-item' : 'accordion-item';
    const contentClassName = section
      ? 'section-content'
      : 'usa-accordion-content';
    return (
      <li className={liClassName} id={this.id}>
        {this.renderHeader()}
        <div
          id={`${this.id}-content`}
          className={contentClassName}
          aria-hidden={!expanded}
          hidden={!expanded}
        >
          {expanded ? children : null}
        </div>
      </li>
    );
  }
}

export default AccordionItem;
