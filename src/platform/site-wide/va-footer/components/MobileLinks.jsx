import React from 'react';
import { VaCrisisLineModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

import { FOOTER_COLUMNS } from '../helpers';
import LanguageSupport from './LanguageSupport';

export default function MobileLinks(props) {
  const { links, visible, langConfig, minimalFooter } = props;

  return (
    <div
      aria-hidden={visible ? 'false' : 'true'}
      className="usa-grid-full flex-container usa-grid-flex-mobile va-footer-content"
    >
      <ul className="usa-accordion va-footer-accordion">
        <li>
          <VaCrisisLineModal mode="trigger" />
        </li>
        {!minimalFooter && (
          <>
            <li>
              <button
                className="usa-button-unstyled usa-accordion-button va-footer-button"
                aria-controls="veteran-contact"
                itemProp="name"
                aria-expanded="false"
              >
                Contact us
              </button>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                id="veteran-contact"
                aria-hidden="true"
              >
                <h2 className="va-footer-linkgroup-title vads-u-padding-bottom--1">
                  Get answers
                </h2>
                {links[FOOTER_COLUMNS.CONTACT]}
              </div>
            </li>
            <li>
              <button
                className="usa-button-unstyled usa-accordion-button va-footer-button"
                aria-controls="footer-veteran-programs"
                itemProp="name"
                aria-expanded="false"
              >
                Veteran programs and services
              </button>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                aria-hidden="true"
                id="footer-veteran-programs"
              >
                {links[FOOTER_COLUMNS.PROGRAMS]}
              </div>
            </li>
            <li>
              <button
                className="usa-button-unstyled usa-accordion-button va-footer-button"
                aria-controls="veteran-resources"
                itemProp="name"
                aria-expanded="false"
              >
                More VA resources
              </button>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                aria-hidden="true"
                id="veteran-resources"
              >
                {links[FOOTER_COLUMNS.RESOURCES]}
              </div>
            </li>
            <li>
              <button
                className="usa-button-unstyled usa-accordion-button va-footer-button"
                aria-controls="veteran-connect"
                itemProp="name"
                aria-expanded="false"
              >
                Get VA updates
              </button>
              <div
                className="usa-accordion-content va-footer-accordion-content"
                id="veteran-connect"
                aria-hidden="true"
              >
                {links[FOOTER_COLUMNS.CONNECT]}
              </div>
            </li>
            <LanguageSupport
              dispatchLanguageSelection={langConfig.dispatchLanguageSelection}
              languageCode={langConfig.languageCode}
            />
          </>
        )}
      </ul>
    </div>
  );
}

MobileLinks.propTypes = {
  langConfig: PropTypes.object.isRequired,
  links: PropTypes.object.isRequired,
  minimalFooter: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
};
