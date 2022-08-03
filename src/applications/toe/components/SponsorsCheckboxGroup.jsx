import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { setData } from 'platform/forms-system/src/js/actions';
import CheckboxGroup from '@department-of-veterans-affairs/component-library/CheckboxGroup';

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

  const { anySelectedOptions, options, values } = mapSponsorsToCheckboxOptions(
    sponsors,
  );

  return (
    <CheckboxGroup
      additionalFieldsetClass="vads-u-margin-top--0"
      additionalLegendClass="toe-sponsors_legend vads-u-margin-top--0"
      errorMessage={
        !anySelectedOptions && (dirty || formContext?.submitted) && errorMessage
      }
      label={
        // I'm getting conflicting linting issues here.
        // eslint-disable-next-line react/jsx-wrap-multilines
        <>
          <span className="toe-sponsors-labels_label--main">
            Which sponsor's benefits would you like to use?
          </span>
          <span className="toe-sponsors-labels_label--secondary">
            Select all sponsors whose benefits you would like to apply for
          </span>
        </>
      }
      onValueChange={onValueChange}
      options={options}
      required
      values={values}
    />
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
