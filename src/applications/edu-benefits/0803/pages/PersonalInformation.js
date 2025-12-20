// @ts-check
import React from 'react';
import {
  PersonalInformation,
  PersonalInformationCardHeader,
  PersonalInformationHeader,
  PersonalInformationNote,
} from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformation';
import { DefaultErrorMessage } from 'platform/forms-system/src/js/components/PersonalInformation/DefaultErrorMessage';
import { DefaultCardHeader } from 'platform/forms-system/src/js/components/PersonalInformation/DefaultCardHeader';
import { DefaultHeader } from 'platform/forms-system/src/js/components/PersonalInformation/DefaultHeader';

const uiSchema = {};
const schema = {
  type: 'object',
  properties: {},
};

const CustomPage = props => {
  const config = {
    name: { show: true, required: true },
    ssn: { show: true, required: true },
    dateOfBirth: { show: true, required: false },
  };

  const dataAdapter = {
    ssnPath: 'ssn',
  };

  return (
    <PersonalInformation
      {...props}
      config={config}
      dataAdapter={dataAdapter}
      errorMessage={DefaultErrorMessage}
      background={false}
    >
      <PersonalInformationHeader>
        <DefaultHeader />
      </PersonalInformationHeader>
      <PersonalInformationCardHeader>
        <DefaultCardHeader />
      </PersonalInformationCardHeader>
      <PersonalInformationNote>
        <div
          className="vads-u-margin-bottom--4 vads-u-margin-top--8"
          data-testid="default-note"
        >
          <p>
            <strong>Note:</strong> To protect your personal information, we
            don’t allow online changes to your name, Social Security number, or
            date of birth. If you need to change this information, call us at{' '}
            <va-telephone contact="8008271000" /> (
            <va-telephone contact="711" tty />
            ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m.
            ET. We’ll give you instructions for how to change your information.
            Or you can learn how to change your legal name on file with VA.{' '}
          </p>
          <va-link
            external
            href="https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/"
            text="Learn how to change your legal name"
          />
        </div>
      </PersonalInformationNote>
    </PersonalInformation>
  );
};

export { schema, uiSchema, CustomPage };
