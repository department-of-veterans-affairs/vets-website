import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getAppData } from '../selectors';
import { SPONSORS_TYPE } from '../constants';

function FirstSponsorRadioGroup({
  firstSponsor,
  formData,
  setFormData,
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
