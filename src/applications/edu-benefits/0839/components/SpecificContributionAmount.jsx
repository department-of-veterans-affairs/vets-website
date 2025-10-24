import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, connect } from 'react-redux';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const SpecificContributionAmount = ({ id, value, onChange, required }) => {
  const formData = useSelector(state => state.form?.data);
  const { pathname } = window.location;
  const pathParts = pathname.split('/');
  const yellowRibbonIndex = pathParts.findIndex(
    part => part === 'yellow-ribbon-program-request',
  );
  const index =
    yellowRibbonIndex !== -1 && pathParts[yellowRibbonIndex + 1]
      ? parseInt(pathParts[yellowRibbonIndex + 1], 10)
      : 0;
  const currentItem = formData?.yellowRibbonProgramRequest?.[index];
  const unlimitedIndividuals =
    currentItem?.eligibleIndividualsGroup?.unlimitedIndividuals;
  const isUsaSchool = currentItem?.institutionDetails?.isUsaSchool;

  const titleText =
    unlimitedIndividuals !== true
      ? 'Enter the maximum annual contribution amount for this degree level or professional school'
      : 'Maximum contribution amount';
  const label = titleText;

  const description =
    'Enter the total annual amount per student, not per term or credit hour. Amounts over $99,999 are treated as unlimited by the system.';

  return (
    <div>
      <VaTextInput
        id={id}
        name={id}
        label={label}
        hint={unlimitedIndividuals && isUsaSchool ? description : ''}
        value={value || ''}
        onInput={e => onChange(e.target.value)}
        required={required}
        inputmode="decimal"
        pattern="[0-9]*"
        charMax={5}
        inputPrefix="$"
        className="specific-contribution-amount-input"
      />
    </div>
  );
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

SpecificContributionAmount.propTypes = {
  id: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default connect(mapStateToProps)(SpecificContributionAmount);
