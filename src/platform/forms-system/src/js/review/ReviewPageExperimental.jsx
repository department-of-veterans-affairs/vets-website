import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

import DowntimeNotification, {
  externalServiceStatus,
} from 'platform/monitoring/DowntimeNotification';
import DowntimeMessage from 'platform/monitoring/DowntimeNotification/components/Down';

import ReviewChaptersPlain from './ReviewChaptersPlain';
import SubmitController from './SubmitController';
import { isMinimalHeaderApp } from '../patterns/minimal-header';

class ReviewPageExperimental extends React.Component {
  renderDowntime = (downtime, children) => {
    if (downtime.status === externalServiceStatus.down) {
      const Message = this.props.formConfig.downtime.message || DowntimeMessage;

      return <Message downtime={downtime} />;
    }

    return children;
  };

  render() {
    const { formConfig, pageList, path } = this.props.route;

    const downtimeDependencies = formConfig?.downtime?.dependencies || [];
    return (
      <div data-testid="review-page-experimental">
        {isMinimalHeaderApp() ? (
          <h1 className="vads-u-font-size--h2">Review and submit</h1>
        ) : (
          <h1>Review and submit</h1>
        )}
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          You’re viewing an experimental review experience.
        </p>
        <ReviewChaptersPlain
          formConfig={formConfig}
          pageList={pageList}
          filterEmptyFields
        />
        <DowntimeNotification
          appTitle="application"
          render={this.renderDowntime}
          dependencies={downtimeDependencies}
          customText={formConfig.customText}
        >
          <SubmitController
            formConfig={formConfig}
            pageList={pageList}
            path={path}
          />
        </DowntimeNotification>
      </div>
    );
  }
}

ReviewPageExperimental.propTypes = {
  formConfig: PropTypes.shape({
    downtime: PropTypes.shape({
      message: PropTypes.element,
    }),
  }).isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired,
    pageList: PropTypes.array.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(ReviewPageExperimental);

export { ReviewPageExperimental };
