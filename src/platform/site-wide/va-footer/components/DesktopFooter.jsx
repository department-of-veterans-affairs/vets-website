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

export default class DesktopFooter extends React.Component {
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
        <div className="va-footer-linkgroup">
          <h4 className="va-footer-linkgroup-title">
            Veteran Programs and Services
          </h4>
          {this.generateLinkItems(FOOTER_COLUMNS.PROGRAMS)}
        </div>
        <div className="va-footer-linkgroup" id="footer-services">
          <h4 className="va-footer-linkgroup-title">More VA Resources</h4>
          {this.generateLinkItems(FOOTER_COLUMNS.RESOURCES)}
        </div>
        <div className="va-footer-linkgroup" id="footer-popular">
          <h4 className="va-footer-linkgroup-title">Get VA Updates</h4>
          {this.generateLinkItems(FOOTER_COLUMNS.CONNECT)}
        </div>
        <div className="va-footer-linkgroup" id="veteran-crisis">
          <h4 className="va-footer-linkgroup-title">In Crisis? Get Help Now</h4>
          <ul className="va-footer-links">
            <li>
              <button
                onClick={() =>
                  recordEvent({ event: FOOTER_EVENTS.CRISIS_LINE })
                }
                className="va-button-link va-overlay-trigger"
                data-show="#modal-crisisline"
              >
                Veterans Crisis Line
              </button>
            </li>
          </ul>
          <h4 className="va-footer-linkgroup-title">Contact Us</h4>
          {this.generateLinkItems(FOOTER_COLUMNS.CONTACT)}
        </div>
      </div>
    );
  }
}
