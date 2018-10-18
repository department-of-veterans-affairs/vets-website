import React from 'react';

import isBrandConsolidationEnabled from '../../brand-consolidation/feature-flag';

const brandConsolidationIsEnabled = isBrandConsolidationEnabled();

const propertyName = brandConsolidationIsEnabled ? 'VA.gov' : 'Vets.gov';

const helpDeskPhone = brandConsolidationIsEnabled
  ? '1-844-698-2311'
  : '1-855-574-7286';

const helpDeskMessage = brandConsolidationIsEnabled ? (
  <span>
    MyVA311 for help: <a href={`tel:+${helpDeskPhone}`}>{helpDeskPhone}</a>
  </span>
) : (
  `the ${propertyName} Technical Help Desk:`
);

function AskVAQuestions(props) {
  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <div className="help-footer-box">
          <h2 className="help-heading">Need help?</h2>
          {props.children}
          <p className="help-talk">
            To report a problem with this form,
            <br />
            please call {helpDeskMessage}
          </p>
          {brandConsolidationIsEnabled && (
            <p>
              If you have hearing loss, call TTY: <a href="tel:711">711</a>.
            </p>
          )}
          {!brandConsolidationIsEnabled && (
            <p className="help-phone-number">
              <a
                className="help-phone-number-link"
                href={`tel:+${helpDeskPhone}`}
              >
                {helpDeskPhone}
              </a>
              <br />
              TTY:{' '}
              <a className="help-phone-number-link" href="tel:+18008778339">
                1-800-877-8339
              </a>
              <br />
              Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AskVAQuestions;
