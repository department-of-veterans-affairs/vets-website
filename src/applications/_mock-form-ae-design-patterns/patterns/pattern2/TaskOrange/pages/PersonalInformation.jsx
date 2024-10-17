import React from 'react';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { formatPhoneNumber } from '../../../../utils/helpers/general';
import { InfoSection } from '../../../../shared/components/InfoSection';

export const PersonalInformationContact = ({
  data,
  goBack,
  goForward,
  contentAfterButtons,
  contentBeforeButtons,
}) => {
  const { homePhone, mobilePhone, email } = data?.['view:otherContactInfo'];

  const address = data?.veteranAddress;

  return (
    <>
      <h1>Apply for education benefits</h1>
      <p>Form 22-1990</p>

      <va-progress-bar current="4" total="5" label="Personal information" />

      <p>We’ll save your application on every change.</p>

      <va-alert status="info">
        <h4 slot="headline">Note:</h4>
        We’ve prefilled some of your information from your account. If you need
        to correct anything, you can select edit below. All updates will be made
        only to this form.
      </va-alert>
      <div className="vads-u-margin-top--4">
        <InfoSection>
          <InfoSection.SubHeading
            text="Contact information"
            editLink="#edit-contact"
          />
          <InfoSection.InfoBlock
            label="How should we contact you if we have questions about your application?"
            value={null}
          />

          <InfoSection.SubHeading text="Address" editLink="#edit-address" />
          <InfoSection.InfoBlock
            label="Street address"
            value={address?.street}
          />
          <InfoSection.InfoBlock
            label="Street address line 2"
            value={address?.street2 || 'Not provided'}
          />
          <InfoSection.InfoBlock label="City" value={address?.city} />
          <InfoSection.InfoBlock label="State" value={address?.state} />
          <InfoSection.InfoBlock label="Zip code" value={address?.zipCode} />

          <InfoSection.SubHeading
            text="Other contact information"
            editLink="#edit-other-contact"
          />
          <InfoSection.InfoBlock label="Email address" value={email} />
          <InfoSection.InfoBlock
            label="Mobile phone number"
            value={formatPhoneNumber(mobilePhone)}
          />
          <InfoSection.InfoBlock
            label="Home phone number"
            value={formatPhoneNumber(homePhone)}
          />
        </InfoSection>
      </div>

      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </>
  );
};
