import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';

const options = [
  {
    value: 'isVeteran',
    label: 'Veteran',
  },
  {
    value: 'isServiceMember',
    label: 'Service member',
  },
  {
    value: 'VAEducationBenefits',
    label: 'Dependent of a Veteran or service member',
  },
  {
    value: 'ineligibleNotice',
    label: 'None of these',
  },
];

const StartPage = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ value }) => {
    switch (value) {
      case 'isVeteran':
      case 'isServiceMember':
        setPageState({ selected: value }, 'isVeteranOrServiceMember');
        break;
      case 'VAEducationBenefits':
        setPageState({ selected: value }, value);
        break;
      case 'ineligibleNotice':
      default:
        setPageState({ selected: value }, 'ineligibleNotice');
    }
  };

  return (
    <ErrorableRadioButtons
      name="claimant-relationship"
      label="Which of these best describes you?"
      id="claimant-relationship"
      options={options}
      onValueChange={handleValueChange}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: 'start',
  component: StartPage,
};
