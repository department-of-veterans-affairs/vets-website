import React from 'react';
import recordEvent from '../../../monitoring/record-event';

import { FOOTER_COLUMNS, FOOTER_EVENTS } from '../helpers';

export default function DesktopLinks({ links, visible }) {
  return (
    <div
      aria-hidden={visible ? 'false' : 'true'}
      className="usa-grid-full flex-container usa-grid-flex-mobile va-footer-content"
    >
      <div className="va-footer-linkgroup">
        <h2 className="va-footer-linkgroup-title">
          Veteran programs and services
        </h2>
        {links[FOOTER_COLUMNS.PROGRAMS]}
      </div>
      <div className="va-footer-linkgroup" id="footer-services">
        <h2 className="va-footer-linkgroup-title">More VA resources</h2>
        {links[FOOTER_COLUMNS.RESOURCES]}
      </div>
      <div className="va-footer-linkgroup" id="footer-popular">
        <h2 className="va-footer-linkgroup-title">Get VA updates</h2>
        {links[FOOTER_COLUMNS.CONNECT]}
      </div>
      <div className="va-footer-linkgroup" id="veteran-crisis">
        <h2 className="va-footer-linkgroup-title">
          In crisis? Talk to someone now
        </h2>
        <ul className="va-footer-links">
          <li>
            <button
              onClick={() => {
                recordEvent({ event: FOOTER_EVENTS.CRISIS_LINE });
                document.dispatchEvent(
                  new CustomEvent('vaCrisisLineModalOpen'),
                );
              }}
              className="va-button-link va-overlay-trigger"
              data-show="#modal-crisisline"
              id="footer-crisis-line"
            >
              Veterans Crisis Line
            </button>
          </li>
        </ul>
        <h2 className="va-footer-linkgroup-title vads-u-margin-top--2 vads-u-padding-bottom--1">
          Get answers
        </h2>
        {links[FOOTER_COLUMNS.CONTACT]}
      </div>
    </div>
  );
}
