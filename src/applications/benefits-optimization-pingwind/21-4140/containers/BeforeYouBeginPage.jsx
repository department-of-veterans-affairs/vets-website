import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  getNextPagePath,
  getPreviousPagePath,
} from 'platform/forms-system/src/js/routing';
import { setData } from 'platform/forms-system/src/js/actions';
import { scrollTo } from 'platform/utilities/scroll';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import { VaSummaryBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { skipToContent } from '../utils/skipToContent';

const BeforeYouBeginPage = ({
  formData,
  location,
  route,
  router,
  setFormData,
}) => {
  useEffect(() => {
    scrollTo('topScrollElement');
    waitForRenderThenFocus('#main-content');
  }, []);

  const pageList = route?.pageList || [];
  const currentPath = location?.pathname || '';

  const goBack = () => {
    if (!router?.push) {
      return;
    }

    const previousPath = getPreviousPagePath(pageList, formData, currentPath);
    router.push(previousPath || '/introduction');
  };

  const goForward = () => {
    if (!router?.push) {
      return;
    }

    if (setFormData) {
      setFormData({
        ...formData,
        beforeYouBegin: {
          ...formData?.beforeYouBegin,
          visited: true,
        },
      });
    }

    const nextPath = getNextPagePath(pageList, formData, currentPath);
    router.push(nextPath);
  };

  return (
    <div className="schemaform-intro">
      <a className="show-on-focus" href="#main-content" onClick={skipToContent}>
        Skip to Content
      </a>
      <h1 id="main-content" className="vads-u-margin-bottom--2">
        What to Expect
      </h1>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '20px' }}>
        We’ll be asking you questions about your employment status for the last
        12 months.
      </p>
      <VaSummaryBox
        id="required-information-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h2 slot="headline">Keep in mind</h2>
        <ul className="usa-list vads-u-margin--0">
          <li>This form may take about 5 - 10 minutes to complete.</li>
          <li>You must answer all questions fully and accurately.</li>
          <li>You can save your progress and come back to this form later.</li>
          <li>
            This form is for you to verify your employment status when asked,
            because you currently receive Individual Unemployability disability
            benefits for a service-connected condition.
          </li>
        </ul>
      </VaSummaryBox>
      <FormNavButtons goBack={goBack} goForward={goForward} />
    </div>
  );
};

BeforeYouBeginPage.propTypes = {
  formData: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  route: PropTypes.shape({
    pageList: PropTypes.array,
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  setFormData: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BeforeYouBeginPage);
