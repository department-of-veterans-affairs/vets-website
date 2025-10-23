import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { setData } from 'platform/forms-system/src/js/actions';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { getAppData } from '../selectors';

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

  const onValueChange = event => {
    const {
      target: { id, checked },
    } = event;
    const _sponsors = updateSponsorsOnValueChange(
      sponsors,
      firstSponsor,
      id,
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

  return (
    <VaCheckboxGroup
      label="Which sponsor's benefits would you like to use?"
      hint="Select all sponsors whose benefits you would like to apply for."
      onVaChange={onValueChange}
      required
      error={
        !anySelectedOptions && (dirty || formContext.submitted)
          ? errorMessage
          : ''
      }
    >
      {options.map(({ label, value, selected }) => (
        <va-checkbox id={value} key={label} label={label} checked={selected} />
      ))}
    </VaCheckboxGroup>
  );
}

SponsorCheckboxGroup.propTypes = {
  setFormData: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  fetchedSponsorsComplete: PropTypes.bool,
  firstSponsor: PropTypes.object,
  formContext: PropTypes.object,
  formData: PropTypes.object,
  loadingMessage: PropTypes.string,
  sponsors: PropTypes.object,
};
SponsorCheckboxGroup.defaultProps = {
  errorMessage: 'Please select at least one sponsor',
  loadingMessage: 'Loading your sponsors...',
};

const mapStateToProps = state => ({
  fetchedSponsors: state.data?.fetchedSponsors,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  firstSponsor: state.form?.data?.firstSponsor,
  formData: state.form?.data || {},
  sponsors: state.form?.data?.sponsors,
  sponsorsSavedState: state.form.loadedData?.formData?.sponsors,
  ...getAppData(state),
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
