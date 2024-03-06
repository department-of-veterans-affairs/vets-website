import React, { useEffect } from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import { connect } from 'react-redux';
import moment from 'moment';
import DateWidget from 'platform/forms-system/src/js/widgets/DateWidget';

const BenefitRelinquishmentDate = props => {
  const { formData, setFormData } = props;
  useEffect(() => {
    setFormData({
      ...formData,
      benefitEffectiveDate: moment(new Date()).format('YYYY-MM-DD'),
    });
  }, []);

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
        value={
          formData.benefitEffectiveDate ||
          moment(new Date())
            .subtract(1, 'y')
            .format('YYYY-MM-DD')
        }
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
