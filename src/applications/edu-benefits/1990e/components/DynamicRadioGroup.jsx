import React from 'react';
import { connect } from 'react-redux';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { isArray } from 'lodash';
import { updateSponsors } from '../actions';
import {
  IM_NOT_SURE_LABEL,
  IM_NOT_SURE_VALUE,
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';

function DynamicRadioGroup({ dispatchSponsorsChange, sponsors }) {
  const onValueChange = ({ value }) => {
    dispatchSponsorsChange({
      ...sponsors,
      firstSponsor: value.replace('sponsor-', ''),
    });
  };

  const options = sponsors?.sponsors.length
    ? sponsors?.sponsors?.flatMap(
        (sponsor, index) =>
          sponsor.selected
            ? [
                {
                  label: `Sponsor ${index + 1}: ${sponsor.name}`,
                  value: `sponsor-${sponsor.id}`,
                },
              ]
            : [],
      )
    : [];
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
      onValueChange={onValueChange}
      options={options}
      value={
        sponsors?.firstSponsor && { value: `sponsor-${sponsors?.firstSponsor}` }
      }
    />
  );
}

const mapSponsors = state => {
  if (isArray(state.form.data.sponsors?.sponsors)) {
    return state.form.data.sponsors;
  }

  if (isArray(state.data?.sponsors?.sponsors)) {
    return {
      sponsors: state.data.sponsors,
    };
  }

  return {};
};

const mapStateToProps = state => ({
  sponsors: mapSponsors(state),
});

const mapDispatchToProps = {
  dispatchSponsorsChange: updateSponsors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DynamicRadioGroup);
