import React, { useContext } from 'react';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { PatternConfigContext } from 'applications/_mock-form-ae-design-patterns/shared/context/PatternConfigContext';
import { withRouter } from 'react-router';
import { SaveSuccessAlert } from 'applications/_mock-form-ae-design-patterns/shared/components/alerts/SaveSuccessAlert';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import { formatPhoneNumber } from '../../../../utils/helpers/general';
import { InfoSection } from '../../../../shared/components/InfoSection';

const getLinkFactory = (rootUrl, review = false) => {
  return id => {
    const url = `${rootUrl}personal-information/${id}`;
    return review ? `${url}?review` : url;
  };
};

export const PersonalInformationContactReviewBase = props => {
  return <PersonalInformationContact {...props} onReviewPage />;
};

export const PersonalInformationContactReview = withRouter(
  PersonalInformationContactReviewBase,
);

export const PersonalInformationContact = ({
  data,
  goBack,
  goForward,
  contentAfterButtons,
  contentBeforeButtons,
  onReviewPage,
  ...rest
}) => {
  const config = useContext(PatternConfigContext);

  const { location } = rest;
  const reviewId = location?.state?.reviewId;
  const success = location?.state?.success;

  if (reviewId) {
    waitForRenderThenFocus(`#${reviewId}`);
  }

  const { homePhone, mobilePhone, email } = data;

  const address = data?.veteranAddress;

  const getLink = getLinkFactory(`${config.urlPrefix}`, onReviewPage);

  return (
    <>
      {!onReviewPage && (
        <va-alert status="info">
          <strong>Note:</strong> We’ve prefilled some of your information from
          your account. If you need to correct anything, you can select edit
          below. All updates will be made only to this form.
        </va-alert>
      )}
      <div className="vads-u-margin-top--4">
        <InfoSection>
          <InfoSection.SubHeading
            text="Contact information"
            editLink={getLink('edit-contact-preference')}
          />
          <InfoSection.InfoBlock
            label="How should we contact you if we have questions about your application?"
            value="email"
          />

          <InfoSection.SubHeading
            text="Address"
            editLink={getLink('edit-address')}
          />
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
            editLink={getLink('edit-other-contact-information')}
            id="other-contact-information"
          />

          {success &&
            reviewId === 'other-contact-information' && (
              <SaveSuccessAlert updatedText="Other contact information" />
            )}
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

      {!onReviewPage && (
        <>
          {contentBeforeButtons}
          <FormNavButtons goBack={goBack} goForward={goForward} />
          {contentAfterButtons}
        </>
      )}
    </>
  );
};
