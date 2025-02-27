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
  const { authUser, formData, guestUser } = useSelector(state => {
    return {
      authUser: {
        veteranFullName: state.user.profile.userFullName,
        veteranDateOfBirth: state.user.profile.dob,
        totalDisabilityRating: state.form.data['view:totalDisabilityRating'],
      },
      guestUser: state.form.data['view:veteranInformation'],
      formData: state.form.data,
    };
  });

  const handlers = useMemo(
    () => {
      const { pathname } = location;
      const { pageList } = route;
      return {
        goBack: () =>
          router.push(getPreviousPagePath(pageList, formData, pathname)),
        goForward: () =>
          router.push(getNextPagePath(pageList, formData, pathname)),
      };
    },
    [formData, location, route, router],
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
