import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollToElement } from 'platform/forms-system/exportsFile';
import { waitForRenderThenFocus } from 'platform/utilities/ui';

import { PatternConfigContext } from 'applications/_mock-form-ae-design-patterns/shared/context/PatternConfigContext';
import { SaveSuccessAlert } from 'applications/_mock-form-ae-design-patterns/shared/components/alerts/SaveSuccessAlert';
import { formatPhoneNumber } from '../../../../utils/helpers/general';
import { InfoSection } from '../../../../shared/components/InfoSection';

const getLinkFactory = (rootUrl, review = false) => {
  return id => {
    const url = `${rootUrl}personal-information/${id}`;
    return review ? `${url}?review=true` : url;
  };
};

export const ContactInformationReviewBase = props => {
  return <ContactInformation {...props} onReviewPage />;
};

export const ContactInformationReview = withRouter(
  ContactInformationReviewBase,
);

export const ContactInformation = ({
  data,
  goBack,
  goForward,
  contentAfterButtons,
  contentBeforeButtons,
  onReviewPage,
  location,
}) => {
  const config = useContext(PatternConfigContext);

  const updatedSection = location?.query?.updatedSection;
  const success = location?.query?.success;

  useEffect(
    () => {
      if (updatedSection) {
        setTimeout(() => {
          waitForRenderThenFocus(`#${updatedSection}`);
          scrollToElement(updatedSection);
        }, 100);
      }
    },
    [updatedSection],
  );

  const { homePhone, mobilePhone, email } = data;

  const address = data?.veteranAddress;

  const getLink = getLinkFactory(`${config.urlPrefix}`, onReviewPage);

  const subHeadingLevel = onReviewPage ? 4 : 3;

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
            text="Communication method"
            editLink={getLink('edit-contact-preference')}
            level={subHeadingLevel}
          />
          <dl>
            <InfoSection.InfoBlock
              label="How should we contact you if we have questions about your application?"
              value="Email"
            />
          </dl>

          <InfoSection.SubHeading
            text="Mailing address"
            editLink={getLink('edit-veteran-address')}
            id="veteranAddress"
            name="veteranAddress"
            level={subHeadingLevel}
          />
          {success &&
            updatedSection === 'veteranAddress' && (
              <SaveSuccessAlert updatedText="Address information" />
            )}
          <dl>
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
            <InfoSection.InfoBlock
              label="Postal code"
              value={address?.postalCode}
            />
          </dl>

          <InfoSection.SubHeading
            text="Other contact information"
            editLink={getLink('edit-other-contact-information')}
            id="otherContactInformation"
            name="otherContactInformation"
            level={subHeadingLevel}
          />

          {success &&
            updatedSection === 'otherContactInformation' && (
              <SaveSuccessAlert updatedText="Other contact information" />
            )}
          <dl>
            <InfoSection.InfoBlock label="Email address" value={email} />
            <InfoSection.InfoBlock
              label="Mobile phone number"
              value={formatPhoneNumber(mobilePhone)}
            />
            <InfoSection.InfoBlock
              label="Home phone number"
              value={formatPhoneNumber(homePhone)}
            />
          </dl>
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

ContactInformation.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  location: PropTypes.object,
  onReviewPage: PropTypes.bool,
};
