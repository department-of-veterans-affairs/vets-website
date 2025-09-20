import PropTypes from 'prop-types';
import React from 'react';

const MedicarePartCAddtlInfo = ({ formData, formContext }) => {
  const hasPartC =
    formData?.medicare?.[Number(formContext.pagePerItemIndex)]
      .medicarePlanType === 'c';
  return (
    hasPartC && (
      <va-additional-info
        trigger="Why do we need Parts A and B information if you have a Part C plan?"
        class="vads-u-margin-bottom--4"
      >
        We need to confirm the dates you first became eligible for Parts A and
        B.
      </va-additional-info>
    )
  );
};

MedicarePartCAddtlInfo.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  formData: PropTypes.shape({
    medicare: PropTypes.array,
  }),
};

export default MedicarePartCAddtlInfo;
