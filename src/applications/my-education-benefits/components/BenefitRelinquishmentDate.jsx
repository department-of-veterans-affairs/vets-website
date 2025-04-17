import React, { useEffect, useState } from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import { connect } from 'react-redux';
import moment from 'moment';
import DateWidget from 'platform/forms-system/src/js/widgets/DateWidget';

const BenefitRelinquishmentDate = props => {
  const { formData, setFormData } = props;

  const aYearAgo = moment(new Date()).subtract(1, 'y');
  const populateDate = () => {
    let returnDate;
    if (
      moment(formData?.benefitEffectiveDate).isBefore(aYearAgo) ||
      formData?.benefitEffectiveDate === undefined
    ) {
      returnDate = aYearAgo.format('YYYY-MM-DD');
    } else {
      returnDate = moment(formData?.benefitEffectiveDate).format('YYYY-MM-DD');
    }
    return returnDate;
  };

  const [dateValue, setDateValue] = useState(
    formData?.mebAutoPopulateRelinquishmentDate
      ? populateDate()
      : formData?.benefitEffectiveDate,
  );

  useEffect(() => {
    setFormData({
      ...formData,
      benefitEffectiveDate: dateValue,
    });
  }, []);

  useEffect(() => {
    if (
      formData?.mebAutoPopulateRelinquishmentDate &&
      (!formData?.benefitEffectiveDate ||
        moment(formData?.benefitEffectiveDate).isBefore(aYearAgo))
    ) {
      setFormData({
        ...formData,
        benefitEffectiveDate: dateValue,
      });
    }
  }, [formData?.benefitEffectiveDate, dateValue, setFormData]);

  function handleChange(event) {
    if (event !== null && event !== undefined) {
      setFormData({
        ...formData,
        benefitEffectiveDate: event,
      });

      setDateValue(event);
    }
  }

  return (
    <>
      <DateWidget {...props} onChange={handleChange} value={dateValue} />
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
