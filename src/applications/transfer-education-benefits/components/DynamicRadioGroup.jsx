import React, { useState } from 'react';
import { connect } from 'react-redux';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { isArray } from 'lodash';
import { fetchSponsors, updateFirstSponsor, updateSponsors } from '../actions';
import {
  IM_NOT_SURE_LABEL,
  IM_NOT_SURE_VALUE,
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';

function DynamicRadioGroup({
  dispatchFirstSponsorChange,
  dispatchSponsorsChange,
  errorMessage = 'Please select at least one sponsor',
  sponsors,
  formContext,
}) {
  const [dirty, setDirty] = useState(false);

  const onValueChange = ({ value }) => {
    const _sponsors = {
      ...sponsors,
      firstSponsor: value.replace('sponsor-', ''),
    };

    setDirty(true);
    dispatchFirstSponsorChange(value);
    dispatchSponsorsChange(_sponsors);
  };

  const options = sponsors?.sponsors?.flatMap(
    (sponsor, index) =>
      sponsor.selected
        ? [
            {
              label: `Sponsor ${index + 1}: ${sponsor.name}`,
              value: `sponsor-${sponsor.id}`,
            },
          ]
        : [],
  );
  if (sponsors.someoneNotListed) {
    options.push({
      label: SPONSOR_NOT_LISTED_LABEL,
      value: `sponsor-${SPONSOR_NOT_LISTED_VALUE}`,
    });
  }
  options.push({
    label: IM_NOT_SURE_LABEL,
    value: `sponsor-${IM_NOT_SURE_VALUE}`,
  });

  return (
    <RadioButtons
      additionalFieldsetClass="vads-u-margin-top--0"
      additionalLegendClass="toe-sponsors-checkboxes_legend vads-u-margin-top--0"
      errorMessage={
        !sponsors?.firstSponsor &&
        (dirty || formContext?.submitted) &&
        errorMessage
      }
      label={
        // I'm getting conflicting linting issues here.
        // eslint-disable-next-line react/jsx-wrap-multilines
        <>
          <span className="toe-sponsors-checkboxes_legend--main">
            Which sponsor's benefits would you like to use?
          </span>
          <span className="toe-sponsors-checkboxes_legend--secondary">
            Select one sponsor
          </span>
        </>
      }
      onValueChange={onValueChange}
      options={options}
      required
      value={
        sponsors?.firstSponsor && { value: `sponsor-${sponsors?.firstSponsor}` }
      }
    />
  );
}

const mapSponsors = state => {
  if (isArray(state.form.data['view:sponsors']?.sponsors)) {
    return state.form.data['view:sponsors'];
  }

  if (isArray(state.data?.sponsors?.sponsors)) {
    return {
      sponsors: state.data.sponsors,
    };
  }

  return {};
};

const mapStateToProps = state => ({
  fetchedSponsors: state.data?.fetchedSponsors,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  firstSponsor: state.data?.firstSponsor,
  form: state.form,
  sponsors: mapSponsors(state),
  state,
});

const mapDispatchToProps = {
  getSponsors: fetchSponsors,
  dispatchFirstSponsorChange: updateFirstSponsor,
  dispatchSponsorsChange: updateSponsors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DynamicRadioGroup);
