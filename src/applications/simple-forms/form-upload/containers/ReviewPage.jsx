import React, { useEffect, useState } from 'react';

import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { capitalize } from 'lodash';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '~/platform/utilities/api';
import { mask, getFormNumber } from '../helpers';
import FormPage from './FormPage';

const inProgressApi = formId => {
  const apiUrl = '/v0/in_progress_forms/';
  return `${environment.API_URL}${apiUrl}${formId}`;
};

const ReviewPage = () => {
  const history = useHistory();
  const location = useLocation();
  const formNumber = getFormNumber(location);

  const fullName = useSelector(state => state?.user?.profile?.userFullName);

  const { state } = location;
  const [veteran, setVeteran] = useState();

  useEffect(() => {
    const fetchVeteran = async () => {
      const apiUrl = inProgressApi('FORM-UPLOAD-FLOW');
      const response = await apiRequest(apiUrl, { method: 'GET' });
      return response?.formData.veteran;
    };

    const getVeteran = async () => {
      const fetchedVeteran = await fetchVeteran();
      setVeteran(fetchedVeteran);
    };

    getVeteran();
  }, []);

  return (
    <FormPage currentLocation={2} pageTitle="Review your information">
      <p className="vads-u-margin-top--0">
        When you submit your form, we’ll include the following personal
        information so that you can track your submission’s status.
      </p>
      <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-padding-left--1">
        <p>
          <b>
            {capitalize(fullName.first)} {capitalize(fullName.last)}
          </b>
        </p>
        {veteran && (
          <>
            <p>
              Social Security number:{' '}
              <span
                className="dd-privacy-mask"
                data-dd-action-name="Veteran's SSN"
              >
                {mask(veteran.ssn)}
              </span>
            </p>
            <p>Zip code: {veteran.address?.postalCode}</p>
          </>
        )}
      </div>
      <p className="vads-u-margin-bottom--5">
        <b>Note:</b> If you need to update your personal information, call us at
        800-827-1000 (TTY:711). We’re here Monday through Friday, 8:00am to
        9:00pm ET.
      </p>
      <VaButtonPair
        class="vads-u-margin-top--0"
        continue
        onPrimaryClick={() => history.push(`/${formNumber}/submit`, state)}
        onSecondaryClick={history.goBack}
        uswds
      />
    </FormPage>
  );
};

export default ReviewPage;
