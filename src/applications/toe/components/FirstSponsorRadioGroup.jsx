import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getAppData } from '../selectors';
import {
  IM_NOT_SURE_LABEL,
  IM_NOT_SURE_VALUE,
  SPONSORS_TYPE,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';

function FirstSponsorRadioGroup({
  firstSponsor,
  formData,
  setFormData,
  showMebEnhancements08,
  sponsors,
}) {
  const setSelectedFirstSponsor = useCallback(
    event => {
      setFormData({
        ...formData,
        firstSponsor: event?.detail?.value?.replace('sponsor-', ''),
      });
    },
    [formData, setFormData],
  );

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
  if (!showMebEnhancements08) {
    if (sponsors.someoneNotListed) {
      const sponsorName = [
        formData.sponsorFullName.first,
        formData.sponsorFullName.middle,
        formData.sponsorFullName.last,
        formData.sponsorFullName.suffix,
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
  }

  const VaRadioOptions = options.map((option, index) => {
    return (
      <va-radio-option
        checked={option.value === `sponsor-${firstSponsor}`}
        class="vads-u-margin-y--2"
        key={index}
        label={option.label}
        name={option.label}
        value={option.value}
      />
    );
  });

  return (
    <VaRadio onVaValueChange={setSelectedFirstSponsor}>
      {VaRadioOptions}
    </VaRadio>
  );
}

FirstSponsorRadioGroup.propTypes = {
  firstSponsor: PropTypes.string,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  showMebEnhancements08: PropTypes.bool,
  sponsors: SPONSORS_TYPE,
};

const mapStateToProps = state => ({
  firstSponsor: state.form?.data?.firstSponsor,
  formData: state.form?.data || {},
  ...getAppData(state),
  sponsors: state.form?.data?.sponsors,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FirstSponsorRadioGroup);
