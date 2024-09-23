import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export function DynamicRadioWidget(props) {
  const { formData, onChange } = props;
  let organizationList = null;
  let upperContent = null;
  const organizations =
    formData['view:selectedRepresentative'].attributes.accreditedOrganizations
      .data;
  const [selected, setSelected] = useState(null); // app starts with no selection

  upperContent = (
    <>
      <h3 className="vads-u-margin-y--5">Select the organization</h3>
      <p className="vads-u-margin-bottom--0">
        This accredited VSO representative works with more than 1 organization.
        Ask them which organization to appoint.
      </p>
      <p className="vads-u-margin-y--4">
        <strong>Note:</strong> You'll usually work with 1 accredited VSO
        representative, but you can work with any of the accredited VSO
        representatives from the organization you appoint.
      </p>
    </>
  );

  organizationList = (
    <VaRadio
      label="Which VSO do you want to appoint?"
      required
      value={selected}
      onVaValueChange={event => {
        onChange(event.detail.value);
        setSelected(event.detail.value);
      }}
    >
      {organizations.map((org, index) => (
        <VaRadioOption
          name="organization"
          key={`${org.id}-${index}`}
          label={`${org.attributes.name}`}
          value={org.id}
          checked={formData.selectedAccreditedOrganizationId === org.id}
        />
      ))}
    </VaRadio>
  );

  return (
    <>
      {upperContent}
      {organizationList}
    </>
  );
}

function mapStateToProps(state) {
  return {
    formData: state.form.data,
  };
}

export default connect(
  mapStateToProps,
  null,
)(DynamicRadioWidget);
