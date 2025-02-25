import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  getNextPagePath,
  getPreviousPagePath,
} from 'platform/forms-system/src/js/routing';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import AuthProfileInformation from '../components/VeteranInformation/AuthProfileInformation';
import GuestVerifiedInformation from '../components/VeteranInformation/GuestVerifiedInformation';
import FormFooter from '../components/FormFooter';
import content from '../locales/en/content.json';

const PersonalInformationPage = ({ location, route, router }) => {
  const { pathname } = location;
  const { pageList } = route;
  const { formData, veteranFullName, veteranDateOfBirth } = useSelector(
    state => ({
      formData: state.form.data,
      veteranFullName: state.user.profile.userFullName,
      veteranDateOfBirth: state.user.profile.dob,
    }),
  );

  const authUser = {
    veteranFullName,
    veteranDateOfBirth,
    totalDisabilityRating: formData['view:totalDisabilityRating'],
  };
  const guestUser = formData['view:veteranInformation'];

  const handlers = useMemo(
    () => ({
      goBack: () => {
        const prevPagePath = getPreviousPagePath(pageList, formData, pathname);
        router.push(prevPagePath);
      },
      goForward: () => {
        const nextPagePath = getNextPagePath(pageList, formData, pathname);
        router.push(nextPagePath);
      },
    }),
    [formData, pageList, pathname, router],
  );

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
          <FormNavButtons
            goBack={handlers.goBack}
            goForward={handlers.goForward}
          />
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
