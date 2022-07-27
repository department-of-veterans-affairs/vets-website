import React from 'react';
import { connect } from 'react-redux';

import { setData } from 'platform/forms-system/src/js/actions';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import {
  IM_NOT_SURE_LABEL,
  IM_NOT_SURE_VALUE,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';

function FirstSponsorRadioGroup({
  firstSponsor,
  formData,
  setFormData,
  sponsors,
}) {
  const onValueChange = ({ value }) => {
    setFormData({
      ...formData,
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
    const sponsorName = [
      formData.newSponsorFullName.first,
      formData.newSponsorFullName.middle,
      formData.newSponsorFullName.last,
      formData.newSponsorFullName.suffix,
    ].join(' ');

    options.push({
      label: `Sponsor that I’ve added: ${sponsorName}`,
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
      value={{ value: `sponsor-${firstSponsor}` }}
    />
  );
}

const mapStateToProps = state => ({
  firstSponsor: state.form?.data?.firstSponsor,
  formData: state.form?.data || {},
  sponsors: state.form?.data?.sponsors,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FirstSponsorRadioGroup);
