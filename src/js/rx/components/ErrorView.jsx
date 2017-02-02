import React from 'react';
import { isEmpty, some, includes, intersection } from 'lodash';
import AlertBox from '../../common/components/AlertBox';

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

    if (some(errors, errorCodeIncludes(['RX135']))) {
      title = 'Accept terms and conditions';
      detail = (
        <p>
          To refill prescriptions, you need to accept the MyHealtheVet terms and conditions first. If you want to use Secure Messaging, please accept the Secure Messaging terms and conditions too. <a href="https://www.myhealth.va.gov/web/myhealthevet/user-registration">Review terms and conditions</a>
        </p>
      );
    } else if (some(errors, errorCodeIncludes(['RX106', 'RX105', 'RX104', 'RX3']))) {
      alert = true;
      title = "We're not able to locate your records";
      detail = (
        <p>
          Please call support at 1-855-574-7286. We're open Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET). To refill prescriptions, you need to be registered as a VA patient through MyHealtheVet. To register, <a href="https://www.myhealth.va.gov/web/myhealthevet/user-registration">visit MyHealtheVet</a>
        </p>
      );
    } else if (some(errors, errorCodeIncludes(['RX101', 'RX102', 'RX901', 'RX500', 'RX503', 'RX117', 'RX99']))) {
      alert = true;
      title = "We couldn't retrieve your prescriptions";
      detail = (
        <p>
          Please <a onClick={window.location.reload(true)}>refresh this page</a> or try again later. If this problem persists, please call the Vets.gov Help Desk at 1-855-574-7286, Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET).
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
      <div className="call-out rx-app-error rx-tab-explainer">
        // needed due to call-out class css rule targeitng
        <p></p>
        {content}
      </div>
    );
  }

  render() {
    const { errors } = this.props;
    const blockingErrors = [
      'RX101',
      'RX102',
      'RX104',
      'RX105',
      'RX106',
      'RX117',
      'RX135',
      'RX3',
      'RX901',
      'RX99',
      'RX503',
      'RX500',
    ];

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
  errors: React.PropTypes.array,
};

export default ErrorView;
