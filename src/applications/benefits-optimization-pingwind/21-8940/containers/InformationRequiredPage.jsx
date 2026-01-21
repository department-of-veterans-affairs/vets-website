import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { scrollTo } from 'platform/utilities/scroll';

const InformationRequiredPage = ({ formData, location, route, router }) => {
  useEffect(() => {
    scrollTo('topScrollElement');
  }, []);

  const pageList = route?.pageList || [];
  const currentPath = location?.pathname || '';

  const goBack = () => {
    if (router?.push) {
      router.push('/');
    }
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
      <h2 className="vads-u-margin-bottom--2">Information Required</h2>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '16px' }}>
        Please provide all required information to continue with your
        application.
      </p>
      {/* Add any specific information required UI here */}
      <FormNavButtons goBack={goBack} goForward={goForward} />
    </div>
  );
};

InformationRequiredPage.propTypes = {
  formData: PropTypes.object,
  location: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
};

export default connect(state => ({
  formData: state.form.data,
}))(InformationRequiredPage);
