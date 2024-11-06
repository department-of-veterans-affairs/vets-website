import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from './Checkbox';

export default function CompareCheckbox({
  institution,
  compareChecked,
  handleCompareUpdate,
  cityState,
}) {
  const name = `${institution} ${cityState}`;
  return (
    <div className="vads-u-padding--0 vads-u-margin-top--neg2 vads-u-margin-bottom--0p5">
      <Checkbox
        label="Compare"
        checked={compareChecked}
        onChange={handleCompareUpdate}
        name={name}
        showArialLabelledBy={false}
        screenReaderOnly={name}
        ariaLabel={name}
      />
    </div>
  );
}
CompareCheckbox.propTypes = {
  compareChecked: PropTypes.bool.isRequired,
  handleCompareUpdate: PropTypes.func.isRequired,
  institution: PropTypes.string.isRequired,
  cityState: PropTypes.string,
};
