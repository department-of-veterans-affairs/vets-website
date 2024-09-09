import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { normalizeFullName } from '../../utils/helpers';
import content from '../../locales/en/content.json';

const ConfirmationPrintView = ({ name, timestamp }) => {
  return (
    <>
      <img
        src="/img/design/logo/logo-black-and-white.png"
        className="vagov-logo vads-u-max-width--100 vads-u-margin-bottom--4"
        alt=""
      />

      <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--0">
        {content['app-title']}
      </h1>
      <div>{content['app-subtitle']}</div>

      <h2 className="vads-u-font-size--h3">
        {content['confirmation--alert-heading']}
      </h2>
      <p className="vads-u-margin-bottom--0">
        {content['confirmation--alert-text']}
      </p>

      <hr className="vads-u-margin-y--4" />

      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        {content['confirmation--info-heading']}
      </h2>
      <dl className="vads-u-margin-bottom--0">
        <div className="vads-u-margin-bottom--2">
          <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
            {content['confirmation--info-vet-label']}
          </dt>
          <dd data-testid="cg-veteranfullname">
            {normalizeFullName(name, true)}
          </dd>
        </div>
        {!!timestamp && (
          <div>
            <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
              {content['confirmation--info-timestamp-label']}
            </dt>
            <dd data-testid="cg-timestamp">
              {format(new Date(timestamp), 'MMM. d, yyyy')}
            </dd>
          </div>
        )}
      </dl>

      <hr className="vads-u-margin-top--4 vads-u-margin-bottom--0" />
    </>
  );
};

ConfirmationPrintView.propTypes = {
  name: PropTypes.object,
  timestamp: PropTypes.number,
};

export default ConfirmationPrintView;
