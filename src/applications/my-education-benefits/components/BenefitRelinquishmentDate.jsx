import React, { useEffect, useState } from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import { connect } from 'react-redux';
import moment from 'moment';
import DateWidget from 'platform/forms-system/src/js/widgets/DateWidget';

const BenefitRelinquishmentDate = props => {
  const { formData, setFormData } = props;
  const [isDateChecked, setIsDateChecked] = useState(false);

  let initialBenefitEffectiveDate = formData?.benefitEffectiveDate;
  const aYearAgo = moment(new Date()).subtract(1, 'y');

  if (formData?.mebAutoPopulateRelinquishmentDate) {
    const currentBenefitEffectiveDate = moment(formData?.benefitEffectiveDate);

    if (currentBenefitEffectiveDate.isBefore(aYearAgo)) {
      initialBenefitEffectiveDate = aYearAgo.format('YYYY-MM-DD');
    }
  }

  useEffect(
    () => {
      if (formData?.mebAutoPopulateRelinquishmentDate && !isDateChecked) {
        setFormData({
          ...formData,
          benefitEffectiveDate: initialBenefitEffectiveDate,
        });

        setIsDateChecked(true);
      }
    },
    [isDateChecked],
  );

  function handleChange(event) {
    setFormData({
      ...formData,
      benefitEffectiveDate: event,
    });
  }

  return (
    <>
      <DateWidget
        {...props}
        onChange={handleChange}
        value={formData.benefitEffectiveDate || initialBenefitEffectiveDate}
      />
      <br />
      <br />
    </>
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
)(BenefitRelinquishmentDate);
