import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty, some, includes, intersection, concat } from 'lodash';
import AlertBox from '../../common/components/AlertBox';
import { errorCodes } from '../config';

class ErrorView extends React.Component {
  renderErrorMessage() {
    const { errors } = this.props;
    const errorCodeIncludes = (codes) => {
      return (error) => {
        return includes(codes, error.code);
      };
    };
    let title;
    let detail;
    let content;
    let alert;

    if (some(errors, errorCodeIncludes(errorCodes.accountcreation))) {
      alert = true;
      title = "We couldn't access your health tools";
      detail = (
        <p>
          We're sorry. We can't seem to give you access to this site's tools for managing your health and benefits online right now. Please <a onClick={() => { window.location.reload(true); }}>try again</a> in a few minutes. If it still doesn't work, please call the Vets.gov Help Desk at 855-574-7286 (TTY: 800-829-4833). We're here Monday–Friday, 8:00 a.m.–8:00 p.m. (ET).
        </p>
      );
    }


    content = (
      <div>
        <h4>{title}</h4>
        <div>
          {detail}
        </div>
      </div>
    );

    if (alert) {
      return (
        <AlertBox
            content={content}
            isVisible
            status="warning"/>
        );
    }

    return (
      <div className="bb-app-error bb-tab-explainer">
        {content}
      </div>
    );
  }

  render() {
    const { errors } = this.props;
    const blockingErrors = concat(
      errorCodes.accountcreation,
    );

    // don't block application if no errors, or errors not in the list above
    if (isEmpty(errors) || intersection(errors.map(e => e.code), blockingErrors).length === 0) {
      return (
        <div>
          {this.props.children}
        </div>
      );
    }

    return this.renderErrorMessage();
  }
}

ErrorView.propTypes = {
  errors: PropTypes.array,
};

export default ErrorView;
