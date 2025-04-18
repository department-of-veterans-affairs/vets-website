import React from 'react';
import { connect } from 'react-redux';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';
import { useReviewPage } from '../hooks/useReviewPage';
import { getEntityAddressAsObject } from '../utilities/helpers';

import { pageDepends as submissionPageDepends } from '../pages/representative/representativeSubmissionMethod';

import AddressEmailPhone from './AddressEmailPhone';

const ContactAccreditedRepresentative = props => {
  const { formData, goBack, goForward, goToPath } = props;
  const rep = formData?.['view:selectedRepresentative'];
  const repAttributes = rep?.attributes;
  const addressData = getEntityAddressAsObject(repAttributes);
  const email = repAttributes?.email;
  const phone = repAttributes?.phone;
  const isOrg = rep?.type === 'organization';
  const isReviewPage = useReviewPage();

  const representative = formData?.['view:selectedRepresentative'];

  const orgSelectionRequired =
    !!representative &&
    ['representative', 'veteran_service_officer'].includes(
      representative.attributes?.individualType,
    ) &&
    representative.attributes?.accreditedOrganizations?.data?.length > 1;

  const submissionMethodRequired = submissionPageDepends(formData);

  const handleGoBack = () => {
    if (isReviewPage) {
      goToPath('/representative-select?review=true');
    } else {
      goBack(formData);
    }
  };

  const handleGoForward = () => {
    if (isReviewPage) {
      if (submissionMethodRequired) {
        goToPath('/representative-submission-method?review=true');
        return;
      }
      if (orgSelectionRequired) {
        goToPath('/representative-organization?review=true');
      } else {
        goToPath('/review-and-submit');
      }
    } else {
      goForward(formData);
    }
  };

  const subNameContent = () => {
    const accreditedOrganizations =
      repAttributes?.accreditedOrganizations?.data;

    if (isOrg) {
      return (
        <p>
          <strong>Note:</strong> You can work with any accredited VSO
          representative at this organization.
        </p>
      );
    }

    if (accreditedOrganizations?.length === 0) {
      return <></>;
    }

    if (accreditedOrganizations?.length === 1) {
      return <p>{accreditedOrganizations[0]?.attributes?.name}</p>;
    }

    return (
      <div className="associated-organizations-info vads-u-margin-top--1p5">
        <va-additional-info
          trigger="Check Veterans Service Organizations"
          disable-border
          uswds
          class="appoint-additional-info"
        >
          <p>This VSO representative is accredited with these organizations:</p>
          <ul className="appoint-ul">
            {accreditedOrganizations?.map((org, index) => {
              return <li key={index}>{org.attributes.name}</li>;
            })}
          </ul>
        </va-additional-info>
      </div>
    );
  };

  return (
    <div>
      <div className="vads-u-display--flex vads-u-margin-bottom--4">
        <va-alert status="warning">
          <h2 slot="headline">Contact the accredited representative</h2>
          <p className="vads-u-margin-bottom--0">
            You’ll need to contact the accredited representative you’ve selected
            to make sure they’re available to help you.
          </p>
        </va-alert>
      </div>
      {repAttributes && (
        <va-card class="vads-u-padding-left--2 vads-u-padding-top--1">
          <div className="vads-u-margin-top--1p5 vads-u-display--flex">
            {!isOrg && <va-icon icon="account_circle" size="4" />}
            <div className="vads-u-margin-left--1">
              <h3 className="vads-u-font-family--serif vads-u-margin-top--0p5">
                {repAttributes.fullName || repAttributes.name}
              </h3>
              {subNameContent()}
              <AddressEmailPhone
                addressData={addressData}
                email={email}
                phone={phone}
              />
            </div>
          </div>
        </va-card>
      )}

      <FormNavButtons goBack={handleGoBack} goForward={handleGoForward} />
    </div>
  );
};

ContactAccreditedRepresentative.propTypes = {
  formData: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(
  mapStateToProps,
  null,
)(ContactAccreditedRepresentative);
