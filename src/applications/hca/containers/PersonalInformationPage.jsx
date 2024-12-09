import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  getNextPagePath,
  getPreviousPagePath,
} from 'platform/forms-system/src/js/routing';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import AuthProfileInformation from '../components/VeteranInformation/AuthProfileInformation';
import GuestVerifiedInformation from '../components/VeteranInformation/GuestVerifiedInformation';
import FormFooter from '../components/FormFooter';
import content from '../locales/en/content.json';

const PersonalInformationPage = props => {
  const { location, route, router } = props;
  const { pathname } = location;
  const { pageList } = route;
  const { data: formData } = useSelector(state => state.form);
  const { userFullName, dob } = useSelector(state => state.user.profile);
  const authUser = {
    veteranFullName: userFullName,
    veteranDateOfBirth: dob,
    totalDisabilityRating: formData['view:totalDisabilityRating'],
  };
  const guestUser = formData['view:veteranInformation'];
  const goBack = () => {
    const prevPagePath = getPreviousPagePath(pageList, formData, pathname);
    router.push(prevPagePath);
  };
  const goForward = () => {
    const nextPagePath = getNextPagePath(pageList, formData, pathname);
    router.push(nextPagePath);
  };

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <>
      <FormTitle
        title={content['page-title--check-your-information']}
        subTitle={content['form-subtitle']}
      />
      <div className="progress-box progress-box-schemaform vads-u-padding-x--0">
        <div className="vads-u-margin-y--2 form-panel">
          {formData['view:isLoggedIn'] ? (
            <AuthProfileInformation user={authUser} />
          ) : (
            <GuestVerifiedInformation user={guestUser} />
          )}
          <FormNavButtons goBack={goBack} goForward={goForward} />
        </div>
      </div>
      <FormFooter />
    </>
  );
};

PersonalInformationPage.propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
};

export default PersonalInformationPage;
