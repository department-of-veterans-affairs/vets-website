import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RefillMedicationList from '../../../components/RefillPrescriptions/RefillMedicationList';

describe('RefillMedicationList component', () => {
  const defaultProps = {
    medications: [],
    testId: 'refill-medication-list',
  };

  const setup = (props = defaultProps) => {
    return shallow(<RefillMedicationList {...props} />);
  };

  it('renders without errors', () => {
    const wrapper = setup();
    expect(wrapper.exists()).to.be.true;
  });

  it('renders empty state when no medications are provided', () => {
    const wrapper = setup();
    expect(wrapper.find('ul')).to.have.lengthOf(0);
  });

  it('renders medication list correctly', () => {
    const medications = [
      { prescriptionId: 1, prescriptionName: 'Medication 1' },
      { prescriptionId: 2, prescriptionName: 'Medication 2' },
    ];
    const wrapper = setup({ medications });
    expect(wrapper.find('li')).to.have.lengthOf(medications.length);
  });
});
