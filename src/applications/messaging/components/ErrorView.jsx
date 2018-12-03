import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty, some, includes, intersection, concat } from 'lodash';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import { mhvAccessError } from 'platform/static-data/error-messages';
import siteName from 'platform/brand-consolidation/site-name';
import CallVBACenter from 'platform/brand-consolidation/components/CallVBACenter';
import { errorCodes } from '../config';

class ErrorView extends React.Component {
  renderErrorMessage() {
    const { errors } = this.props;
    const errorCodeIncludes = codes => error => includes(codes, error.code);

    let content;
    let title;
    let detail;
    let alert;

    if (some(errors, errorCodeIncludes(errorCodes.access))) {
      content = mhvAccessError;
    } else if (some(errors, errorCodeIncludes(errorCodes.accountCreation))) {
      alert = true;
      title = 'We couldn’t access your health tools';
      detail = (
        <p>
          We’re sorry. We can’t seem to give you access to this site’s tools for
          managing your health and benefits online right now. Please{' '}
          <a
            onClick={() => {
              window.location.reload(true);
            }}
          >
            try again
          </a>{' '}
          in a few minutes. If it still doesn’t work, please{' '}
          <CallVBACenter>
            call the {siteName}
            Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY:{' '}
            <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday,
            8:00 a.m. &#8211; 8:00 p.m. (ET).
          </CallVBACenter>
        </p>
      );
    }

    content = content || (
      <div>
        <h4>{title}</h4>
        <div>{detail}</div>
      </div>
    );

    if (alert) {
      return <AlertBox content={content} isVisible status="warning" />;
    }

    return (
      <div className="messaging-app-error messaging-tab-explainer">
        {content}
      </div>
    );
  }

  render() {
    const { errors } = this.props;
    const blockingErrors = concat(
      errorCodes.access,
      errorCodes.accountCreation,
    );

    // don’t block application if no errors, or errors not in the list above
    if (
      isEmpty(errors) ||
      intersection(errors.map(e => e.code), blockingErrors).length === 0
    ) {
      return <div>{this.props.children}</div>;
    }

    return this.renderErrorMessage();
  }
}

ErrorView.propTypes = {
  errors: PropTypes.array,
};

export default ErrorView;
