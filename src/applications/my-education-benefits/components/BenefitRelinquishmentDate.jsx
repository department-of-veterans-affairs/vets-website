import React, { useEffect, useState } from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import { connect } from 'react-redux';
import moment from 'moment';
import DateWidget from 'platform/forms-system/src/js/widgets/DateWidget';

const BenefitRelinquishmentDate = props => {
  const { formData, setFormData } = props;
  const [isDateChecked, setIsDateChecked] = useState(false);

  useEffect(
    () => {
      if (
        formData?.mebAutoPopulateRelinquishmentDate &&
        formData?.benefitEffectiveDate &&
        !isDateChecked
      ) {
        const aYearAgo = moment(new Date()).subtract(1, 'y');

        if (formData?.benefitEffectiveDate.isBefore(aYearAgo)) {
          setFormData({
            ...formData,
            benefitEffectiveDate: moment(new Date())
              .subtract(1, 'y')
              .format('YYYY-MM-DD'),
          });

          setIsDateChecked(true);
        }
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

  const initialValue = formData?.mebAutoPopulateRelinquishmentDate
    ? moment(new Date())
        .subtract(1, 'y')
        .format('YYYY-MM-DD')
    : formData?.benefitEffectiveDate;

  return (
    <>
      <DateWidget
        {...props}
        onChange={handleChange}
        value={formData.benefitEffectiveDate || initialValue}
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
