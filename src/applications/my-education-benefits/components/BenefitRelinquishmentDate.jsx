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
    if (moment(formData?.benefitEffectiveDate).isBefore(aYearAgo)) {
      returnDate = aYearAgo.format('YYYY-MM-DD');
    } else {
      returnDate = moment(formData?.benefitEffectiveDate).format('YYYY-MM-DD');
    }

    return returnDate;
  };

  const [dateValue, setDateValue] = useState(
    formData?.mebAutoPopulateRelinquishmentDate ? populateDate() : '',
  );

  useEffect(
    () => {
      if (
        formData?.mebAutoPopulateRelinquishmentDate &&
        (!formData?.benefitEffectiveDate ||
          moment(formData?.benefitEffectiveDate).isBefore(aYearAgo))
      ) {
        setFormData({
          ...formData,
          benefitEffectiveDate: aYearAgo.format('YYYY-MM-DD'),
        });
      }
    },
    [formData?.benefitEffectiveDate, setFormData],
  );

  // useEffect(
  //   () => {
  //     if (formData?.mebAutoPopulateRelinquishmentDate && !isDateChecked) {
  //       const aYearAgo = moment(new Date()).subtract(1, 'y');

  //       const shouldUpdateDate = !formData?.benefitEffectiveDate || moment(formData?.benefitEffectiveDate).isBefore(aYearAgo)
  //       if (shouldUpdateDate) {
  //         setFormData({
  //           ...formData,
  //           benefitEffectiveDate: aYearAgo.format('YYYY-MM-DD')
  //         });
  //         console.log(formData?.benefitEffectiveDate, "IN THE USEEFFECT")
  //         setIsDateChecked(true);
  //       }
  //     }
  //   },
  //   [formData, setFormData],
  // );

  function handleChange(event) {
    if (event !== null && event !== undefined) {
      setFormData({
        ...formData,
        benefitEffectiveDate: event,
      });

      setDateValue(event);
    }
  }

  // const dateValue = formData?.mebAutoPopulateRelinquishmentDate
  //   ? formData?.benefitEffectiveDate || moment(new Date())
  //       .subtract(1, 'y')
  //       .format('YYYY-MM-DD')
  //   : undefined;
  return (
    <>
      <DateWidget {...props} onChange={handleChange} value={dateValue} />
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
