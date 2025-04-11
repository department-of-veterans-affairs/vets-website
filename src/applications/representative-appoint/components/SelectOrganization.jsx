import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError } from 'platform/utilities/ui';
import { useReviewPage } from '../hooks/useReviewPage';
import { filterOrganizations } from '../utilities/helpers';

const SelectOrganization = props => {
  const { formData, setFormData, goBack, goForward, goToPath } = props;
  const [error, setError] = useState(null);
  const organizations = filterOrganizations(formData);

  const isReviewPage = useReviewPage();

  const isReplacingRep =
    !!formData['view:representativeStatus']?.id &&
    !!formData['view:selectedRepresentative'];

  const handleGoBack = () => {
    if (isReviewPage) {
      goToPath('representative-contact?review=true');
    } else {
      goBack(formData);
    }
  };

  const handleGoForward = () => {
    if (!formData?.selectedAccreditedOrganizationId) {
      setError('You must select an accredited organization');
      scrollToFirstError({ focusOnAlertRole: true });
    } else if (isReviewPage) {
      if (isReplacingRep) {
        goToPath('/representative-replace?review=true');
      } else {
        goToPath('/review-and-submit');
      }
    } else {
      goForward(formData);
    }
  };

  const upperContent = (
    <>
      <h3 className="vads-u-margin-y--5">Select the organization</h3>
      <p className="vads-u-margin-bottom--0">
        This accredited VSO representative works with more than 1 organization.
        Ask them which organization to appoint.
      </p>
      <p className="vads-u-margin-y--4">
        <strong>Note:</strong> You’ll usually work with 1 accredited VSO
        representative, but you can work with any of the accredited VSO
        representatives from the organization you appoint.
      </p>
    </>
  );

  const handleRadioSelect = e => {
    const selectedOrgId = e.detail.value;
    const selectedOrg = organizations?.find(org => org.id === selectedOrgId);

    setError(null);

    setFormData({
      ...formData,
      selectedAccreditedOrganizationId: selectedOrgId,
      selectedAccreditedOrganizationName: selectedOrg?.attributes?.name || '', // Add name
    });
  };

  const organizationList = (
    <VaRadio
      error={error}
      label="Which VSO do you want to appoint?"
      required
      onVaValueChange={handleRadioSelect}
    >
      {organizations?.map((org, index) => (
        <va-radio-option
          label={`${org.attributes.name}`}
          name="organization"
          value={org.id}
          key={`${org.id}-${index}`}
          checked={formData.selectedAccreditedOrganizationId === org.id}
        />
      ))}
    </VaRadio>
  );

  return (
    <>
      {upperContent}
      {organizationList}
      <FormNavButtons goBack={handleGoBack} goForward={handleGoForward} />
    </>
  );
};

SelectOrganization.propTypes = {
  formData: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    formData: state.form.data,
  };
}

export { SelectOrganization };
export default connect(mapStateToProps, null)(SelectOrganization);
