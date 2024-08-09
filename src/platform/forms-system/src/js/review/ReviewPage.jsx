import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

import DowntimeNotification, {
  externalServiceStatus,
} from 'platform/monitoring/DowntimeNotification';
import DowntimeMessage from 'platform/monitoring/DowntimeNotification/components/Down';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { getScrollOptions } from 'platform/utilities/ui';
import { focusElement } from '../utilities/ui';
import ReviewChapters from './ReviewChapters';
import SubmitController from './SubmitController';

// *** THIS COMPONENT ISN'T BEING USED ANYWHERE? ***
class ReviewPage extends React.Component {
  componentDidMount() {
    scrollToTop('topScrollElement', getScrollOptions());
    // The first h2 is the breadcrumb "Step 1 of..." which is a chapter
    // containing multiple pages, so the h2 won't be unique between pages
    focusElement('#main h2'); // doesn't exist?
  }

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
      <div>
        <ReviewChapters formConfig={formConfig} pageList={pageList} />
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

ReviewPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired,
    pageList: PropTypes.array.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(ReviewPage);

export { ReviewPage };
