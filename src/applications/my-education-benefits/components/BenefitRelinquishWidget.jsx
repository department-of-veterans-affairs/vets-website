import React, { useState, useEffect } from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import { connect } from 'react-redux';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const BenefitRelinquishWidget = ({ formData, setFormData }) => {
  const { eligibility } = formData;
  const [selected, setSelected] = useState('');

  const chapter30 = eligibility?.includes('Chapter30');
  const chapter30Null = eligibility?.includes('Chapter30null');
  const chapter1606 = eligibility?.includes('Chapter1606');
  const chapter1606Null = eligibility?.includes('Chapter1606null');

  const chapter30Eligible = chapter30 || chapter30Null;
  const chapter1606Eligible = chapter1606 || chapter1606Null;

  const notEligible =
    eligibility?.includes('NotEligible') ||
    (chapter1606Null && chapter30Null) ||
    (chapter1606Null && !chapter30) ||
    (chapter30Null && !chapter1606) ||
    (!chapter1606 && !chapter30);

  const notEligibleText = formData?.showMebEnhancements09
    ? 'NotEligible'
    : 'CannotRelinquish';

  useEffect(() => {
    if (formData['view:benefitSelection']?.benefitRelinquished) {
      setSelected(formData['view:benefitSelection']?.benefitRelinquished);
    }
  }, [setFormData]);

  const handlers = {
    onSelection: event => {
      const { value } = event?.detail || {};

      if (value) {
        setSelected(value);

        setFormData({
          ...formData,
          'view:benefitSelection': {
            benefitRelinquished: value,
          },
        });
      }
    },
  };

  return (
    <div>
      <VaRadio
        label-header-level="3"
        className="no-margin"
        onVaValueChange={handlers.onSelection}
      >
        {chapter30Eligible && (
          <va-radio-option
            label="Chapter 30"
            name="Chapter30"
            value="Chapter30"
            checked={selected === 'Chapter30'}
          />
        )}
        {chapter1606Eligible && (
          <va-radio-option
            label="Chapter 1606"
            name="Chapter1606"
            value="Chapter1606"
            checked={selected === 'Chapter1606'}
          />
        )}
        {notEligible && (
          <va-radio-option
            label="I'm not eligible for Chapter 30 or Chapter 1606 benefits"
            name={notEligibleText}
            value={notEligibleText}
            checked={selected === notEligibleText}
          />
        )}
      </VaRadio>
    </div>
  );
};

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BenefitRelinquishWidget);
