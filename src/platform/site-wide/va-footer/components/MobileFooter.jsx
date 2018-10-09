import React from 'react';
import orderBy from 'lodash/orderBy';
import recordEvent from '../../../monitoring/record-event';

const FOOTER_COLUMNS = {
  PROGRAMS: '1',
  RESOURCES: '2',
  CONNECT: '3',
  CONTACT: '4',
};

const FOOTER_EVENTS = {
  [FOOTER_COLUMNS.PROGRAMS]: 'nav-footer-programs',
  [FOOTER_COLUMNS.RESOURCES]: 'nav-footer-resources',
  [FOOTER_COLUMNS.CONNECT]: 'nav-footer-connect',
  [FOOTER_COLUMNS.CONTACT]: 'nav-footer-contact',
  CRISIS_LINE: 'nav-footer-crisis',
};

export default class MobileFooter extends React.Component {
  generateLinkItems = (column, direction = 'asc') => {
    const captureEvent = () => recordEvent({ event: FOOTER_EVENTS[column] });
    return (
      <ul className="va-footer-links">
        {orderBy(this.props.links[column], 'order', direction).map(link => (
          <li key={`${link.column}-${link.order}`}>
            <a href={link.href} onClick={captureEvent} target={link.target}>
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    );
  };
  render() {
    return (
      <div
        aria-hidden={this.props.visible ? 'false' : 'true'}
        className="usa-grid-full flex-container usa-grid-flex-mobile va-footer-content"
      >
        <ul className="usa-accordion va-footer-accordion">
          <li>
            <button
              className="usa-button-unstyled usa-accordion-button va-footer-button"
              aria-controls="veteran-contact"
              itemProp="name"
              aria-expanded="false"
            >
              Contact Us
            </button>
            <div
              className="usa-accordion-content va-footer-accordion-content"
              id="veteran-contact"
              aria-hidden="true"
            >
              {this.generateLinkItems(FOOTER_COLUMNS.CONTACT)}
            </div>
          </li>
          <li>
            <button
              className="usa-button-unstyled usa-accordion-button va-footer-button"
              aria-controls="veteran-programs"
              itemProp="name"
              aria-expanded="false"
            >
              Veteran Programs and Services
            </button>
            <div
              className="usa-accordion-content va-footer-accordion-content"
              aria-hidden="true"
              id="veteran-programs"
            >
              {this.generateLinkItems(FOOTER_COLUMNS.PROGRAMS)}
            </div>
          </li>
          <li>
            <button
              className="usa-button-unstyled usa-accordion-button va-footer-button"
              aria-controls="veteran-resources"
              itemProp="name"
              aria-expanded="false"
            >
              More VA Resources
            </button>
            <div
              className="usa-accordion-content va-footer-accordion-content"
              aria-hidden="true"
              id="veteran-resources"
            >
              {this.generateLinkItems(FOOTER_COLUMNS.RESOURCES)}
            </div>
          </li>
          <li>
            <button
              className="usa-button-unstyled usa-accordion-button va-footer-button"
              aria-controls="veteran-connect"
              itemProp="name"
              aria-expanded="false"
            >
              Get VA Updates
            </button>
            <div
              className="usa-accordion-content va-footer-accordion-content"
              id="veteran-connect"
              aria-hidden="true"
            >
              {this.generateLinkItems(FOOTER_COLUMNS.CONNECT)}
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
