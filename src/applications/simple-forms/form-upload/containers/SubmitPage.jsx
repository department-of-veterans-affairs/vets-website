import React, { useEffect, useState } from 'react';

import {
  VaButton,
  VaCard,
  VaIcon,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { capitalize } from 'lodash';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '~/platform/utilities/api';
import { mask, getFileSize, getFormNumber, submitForm } from '../helpers';
import FormPage from './FormPage';

const inProgressApi = formId => {
  const apiUrl = '/v0/in_progress_forms/';
  return `${environment.API_URL}${apiUrl}${formId}`;
};

const SubmitPage = () => {
  const history = useHistory();
  const location = useLocation();
  const formNumber = getFormNumber(location);

  const fullName = useSelector(state => state?.user?.profile?.userFullName);
  const { state } = location;
  const { file, options } = state;
  const submitHandler = () =>
    submitForm(formNumber, file?.confirmationCode, history, options);

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

  const PageTitle = () => (
    <div className="vads-u-display--flex vads-u-border-bottom--2px vads-u-justify-content--space-between vads-u-align-items--center vads-u-margin-top--0">
      <h3>Uploaded file</h3>
      <a href={`/form-upload/${formNumber}/upload`}>Change file</a>
    </div>
  );

  return (
    <FormPage currentLocation={3} pageTitle={<PageTitle />}>
      <div className="vads-u-margin-top--2">
        <div className="vads-u-margin-y--1 vads-u-color--gray">Your file</div>
        <VaCard style={{ maxWidth: '50%' }}>
          <div className="vads-u-display--flex vads-u-flex-direction--row">
            <span className="vads-u-color--primary">
              <VaIcon
                size={6}
                icon="file_present"
                className="vads-u-margin-right--1"
                srtext="icon representing a file"
                aria-hidden="true"
              />
            </span>
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              <span className="vads-u-font-weight--bold">{file?.name}</span>{' '}
              <span className="vads-u-color--gray-darker">
                {getFileSize(file?.size)}
              </span>
            </div>
          </div>
        </VaCard>
      </div>
      <div className="vads-u-border-bottom--1px vads-u-margin-top--1 vads-u-margin-bottom--4">
        <h3>Your personal information</h3>
      </div>
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
        <b>Note:</b> If you need to update your personal information, please
        call us at 800-827-1000. We’re here Monday through Friday, 8:00am to
        9:00pm ET.
      </p>
      <span className="vads-u-margin-top--0">
        <VaButton secondary back onClick={history.goBack} />
        <VaButton primary text="Submit form" onClick={submitHandler} />
      </span>
    </FormPage>
  );
};

export default SubmitPage;
