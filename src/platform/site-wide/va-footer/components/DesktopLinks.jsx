import React from 'react';
import recordEvent from '../../../monitoring/record-event';

import { FOOTER_COLUMNS, FOOTER_EVENTS, generateLinkItems } from '../helpers';

export default function DesktopLinks({ links, visible }) {
  return (
    <div
      aria-hidden={visible ? 'false' : 'true'}
      className="usa-grid-full flex-container usa-grid-flex-mobile va-footer-content"
    >
      <div className="va-footer-linkgroup">
        <h4 className="va-footer-linkgroup-title">
          Veteran Programs and Services
        </h4>
        {generateLinkItems(links, FOOTER_COLUMNS.PROGRAMS)}
      </div>
      <div className="va-footer-linkgroup" id="footer-services">
        <h4 className="va-footer-linkgroup-title">More VA Resources</h4>
        {generateLinkItems(links, FOOTER_COLUMNS.RESOURCES)}
      </div>
      <div className="va-footer-linkgroup" id="footer-popular">
        <h4 className="va-footer-linkgroup-title">Get VA Updates</h4>
        {generateLinkItems(links, FOOTER_COLUMNS.CONNECT)}
      </div>
      <div className="va-footer-linkgroup" id="veteran-crisis">
        <h4 className="va-footer-linkgroup-title">In Crisis? Get Help Now</h4>
        <ul className="va-footer-links">
          <li>
            <button
              onClick={() => recordEvent({ event: FOOTER_EVENTS.CRISIS_LINE })}
              className="va-button-link va-overlay-trigger"
              data-show="#modal-crisisline"
            >
              Veterans Crisis Line
            </button>
          </li>
        </ul>
        <h4 className="va-footer-linkgroup-title">Contact Us</h4>
        {generateLinkItems(links, FOOTER_COLUMNS.CONTACT)}
      </div>
    </div>
  );
}
