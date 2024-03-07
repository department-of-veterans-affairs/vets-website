import React from 'react';
import PropType from 'prop-types';

const MoreInfoCard = ({ marginTop }) => {
  return (
    <div className={`vads-u-margin-top--${marginTop}`}>
      <va-card background>
        <h6 className="vads-u-font-family--serif vads-u-font-size--lg vads-u-font-weight--bold">
          More Information
        </h6>
        <hr className="vads-u-margin-top--0" />
      </va-card>
    </div>
  );
};

MoreInfoCard.propTypes = {
  marginTop: PropType.string,
};

export default MoreInfoCard;
