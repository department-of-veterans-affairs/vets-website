import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { cloneDeep } from 'lodash';

import { setData } from 'platform/forms-system/src/js/actions';
import CheckboxGroup from '@department-of-veterans-affairs/component-library/CheckboxGroup';

import { fetchSponsors } from '../actions';
import {
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';
import { mapFormSponsors, mapSelectedSponsors } from '../helpers';

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
    const _sponsors = cloneDeep(sponsors);

    if (value === `sponsor-${SPONSOR_NOT_LISTED_VALUE}`) {
      _sponsors.someoneNotListed = checked;
    } else {
      const sponsorIndex = _sponsors.sponsors.findIndex(
        sponsor => `sponsor-${sponsor.id}` === value,
      );
      if (sponsorIndex > -1) {
        _sponsors.sponsors[sponsorIndex].selected = checked;
      }
    }

    // Check to make sure that a previously-selected first sponsor hasn't
    // been removed from the list of selected sponsors.
    if (
      !checked &&
      (value === `sponsor-${firstSponsor}` ||
        _sponsors.sponsors?.filter(s => s.selected)?.length < 2)
    ) {
      _sponsors.firstSponsor = null;
    }

    _sponsors.selectedSponsors = mapSelectedSponsors(_sponsors);

    setDirty(true);
    setFormData(mapFormSponsors(formData, _sponsors));
  };

  if (!fetchedSponsorsComplete) {
    return <va-loading-indicator message={loadingMessage} />;
  }
  if (!sponsors?.sponsors.length) {
    return <></>;
  }

  const options =
    sponsors?.sponsors?.map((sponsor, index) => ({
      label: `Sponsor ${index + 1}: ${sponsor.name}`,
      selected: sponsor.selected,
      value: `sponsor-${sponsor.id}`,
    })) || [];
  options.push({
    label: SPONSOR_NOT_LISTED_LABEL,
    selected: sponsors?.someoneNotListed,
    value: `sponsor-${SPONSOR_NOT_LISTED_VALUE}`,
  });
  const selectedOptions = !!options?.filter(o => o.selected)?.length;

  const values = Object.fromEntries(
    new Map(options?.map(option => [option.value, !!option.selected])),
  );

  return (
    <CheckboxGroup
      additionalFieldsetClass="vads-u-margin-top--0"
      additionalLegendClass="toe-sponsors_legend vads-u-margin-top--0"
      errorMessage={
        !selectedOptions && (dirty || formContext?.submitted) && errorMessage
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
  getSponsors: fetchSponsors,
  setFormData: setData,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SponsorCheckboxGroup),
);
