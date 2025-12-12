import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaSummaryBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  getNextPagePath,
  getPreviousPagePath,
} from 'platform/forms-system/src/js/routing';
import { scrollTo } from 'platform/utilities/scroll';

const ImportantInformation = ({ formData, location, route, router }) => {
  useEffect(() => {
    scrollTo('topScrollElement');
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
    const nextPath = getNextPagePath(pageList, formData, currentPath);
    router.push(nextPath);
  };

  return (
    <div className="schemaform-intro">
      <h2 className="vads-u-margin-bottom--2">
        Veteran’s Application for Increased Compensation Based on
        Unemployability (VA 21-8940)
      </h2>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '16px' }}>
        This is an application for compensation benefits based on
        unemployability
      </p>
      <VaSummaryBox
        id="important-information-summary"
        uswds
        class="vads-u-margin-bottom--3 vads-u-margin-top--3"
      >
        <h3 slot="headline">
          Please read this important information before you start:
        </h3>
        <ul className="usa-list vads-u-margin--0">
          <li>This form may take about 45-55 minutes to complete.</li>
          <li>You must answer all questions fully and accurately.</li>
          <li>You can save your progress and come back to this form later.</li>
          <li>
            This form is for claiming total disability if service-connected
            disabilities have prevented you from getting or keeping a job.
          </li>
        </ul>
      </VaSummaryBox>
      <FormNavButtons goBack={goBack} goForward={goForward} />
    </div>
  );
};

ImportantInformation.propTypes = {
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
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export default connect(mapStateToProps)(ImportantInformation);
