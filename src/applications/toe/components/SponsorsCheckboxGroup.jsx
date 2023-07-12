import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';

import {
  mapFormSponsors,
  mapSponsorsToCheckboxOptions,
  updateSponsorsOnValueChange,
} from '../helpers';

function SponsorCheckboxGroup({
  errorMessage = 'Please select at least one sponsor',
  fetchedSponsorsComplete,
  firstSponsor,
  formContext,
  formData,
  loadingMessage = 'Loading your sponsors...',
  setFormData,
  sponsors,
}) {
  const [dirty, setDirty] = useState(false);

  const onValueChange = ({ value }, checked) => {
    const _sponsors = updateSponsorsOnValueChange(
      sponsors,
      firstSponsor,
      value,
      checked,
    );

    setDirty(true);
    setFormData(mapFormSponsors(formData, _sponsors));
  };

  if (!fetchedSponsorsComplete) {
    return <va-loading-indicator message={loadingMessage} />;
  }
  if (!sponsors?.sponsors.length) {
    return <></>;
  }

  const { anySelectedOptions, options } = mapSponsorsToCheckboxOptions(
    sponsors,
  );

  const errorMsg =
    !anySelectedOptions && (dirty || formContext?.submitted)
      ? errorMessage
      : '';

  return (
    <VaCheckboxGroup
      label="Which sponsor's benefits would you like to use?"
      hint="Select all sponsors whose benefits you would like to apply for."
      onValueChange={onValueChange}
      required
      error={errorMsg}
    >
      {options.map(({ label, selected }) => (
        <va-checkbox key={label} label={label} checked={selected} />
      ))}
    </VaCheckboxGroup>
  );
}

const mapStateToProps = state => ({
  fetchedSponsors: state.data?.fetchedSponsors,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  firstSponsor: state.form?.data?.firstSponsor,
  formData: state.form?.data || {},
  sponsors: state.form?.data?.sponsors,
  sponsorsSavedState: state.form.loadedData?.formData?.sponsors,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SponsorCheckboxGroup),
);
