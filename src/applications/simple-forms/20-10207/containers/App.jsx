import React from 'react';
// import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { connect, useSelector } from 'react-redux';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { fetchInProgressForm } from '~/platform/forms/save-in-progress/actions';
// import environment from '@department-of-veterans-affairs/platform-utilities/environment';
// import { apiRequest } from '~/platform/utilities/api';
import formConfig from '../config/form';
import { WIP } from '../../shared/components/WIP';
import { workInProgressContent } from '../config/constants';

// const transformer = (pages, formData, metadata) => {
//   const { veteranSsnLastFour = '', veteranVaFileNumberLastFour = '' } =
//     formData?.nonPrefill || {};

//   return {
//     pages,
//     formData: {
//       veteran: {
//         ssnLastFour: veteranSsnLastFour,
//         vaFileLastFour: veteranVaFileNumberLastFour,
//       },
//     },
//     metadata,
//   };
// };

// {
//   "otherReasons": {
//       "als": true,
//       "terminalIllness": true,
//       "vsiSi": true
//   },
//   "mailingAddressYesNo": true,
//   "livingSituation": {
//       "friendOrFamily": true,
//       "leavingShelter": true,
//       "losingHome": true,
//       "none": false
//   },
//   "preparerType": "veteran",
//   "view:additionalInfoPreparerType": {},
//   "veteranFullName": {
//       "first": "John",
//       "last": "Veteran"
//   },
//   "veteranDateOfBirth": "1980-01-01",
//   "veteranId": {
//       "ssn": "321540987"
//   },
//   "veteranMailingAddress": {
//       "country": "USA",
//       "street": "123 Any St",
//       "city": "Anytown",
//       "state": "CA",
//       "postalCode": "12345",
//       "view:militaryBaseDescription": {}
//   },
//   "veteranPhone": "1234567890",
//   "view:hasReceivedMedicalTreatment": true,
//   "medicalTreatments": [
//       {
//           "facilityName": "Facility Name",
//           "facilityAddress": {
//               "country": "USA",
//               "street": "123 Any St",
//               "city": "Anytown",
//               "state": "CA",
//               "postalCode": "12345"
//           },
//           "startDate": "2013-01-05"
//       }
//   ],
//   "thirdPartyFullName": {},
//   "view:additionalInfoThirdPartyType": {},
//   "nonVeteranFullName": {},
//   "nonVeteranId": {},
//   "view:additionalInfo": {},
//   "nonVeteranMailingAddress": {
//       "view:militaryBaseDescription": {}
//   }
// }
function App({ location, children, showForm, isLoading }) {
  // const userProfile = useSelector(state => state.user.profile);
  // const formId = '21-4138';
  // const formId = '20-10207';
  // const savedForm = userProfile?.savedForms?.find(f => f.form === formId);
  // const [form, setForm] = useState(null);

  // useEffect(
  //   () => {
  //     if (savedForm) {
  //       const inProgressApi = id => {
  //         const apiUrl = '/v0/in_progress_forms/';
  //         return `${environment.API_URL}${apiUrl}${id}`;
  //       };

  //       const fetchForm = async () => {
  //         const apiUrl = inProgressApi(formId);
  //         const response = await apiRequest(apiUrl, { method: 'GET' });
  //         return response?.formData;
  //       };

  //       const getForm = async () => {
  //         const fetchedForm = await fetchForm();
  //         setForm(fetchedForm);
  //       };

  //       getForm();
  //     }
  //   },
  //   [savedForm],
  // );

  if (isLoading) {
    return (
      <va-loading-indicator
        message="Please wait while we load the application for you."
        class="vads-u-margin-y--4"
        set-focus
      />
    );
  }
  if (!showForm) {
    return <WIP content={workInProgressContent} />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
  fetchInProgressForm: PropTypes.func,
  isLoading: PropTypes.bool,
  showForm: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoading: state?.featureToggles?.loading,
  showForm: toggleValues(state)[FEATURE_FLAG_NAMES.form2010207] || false,
});

const mapDispatchToProps = {
  fetchInProgressForm,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
