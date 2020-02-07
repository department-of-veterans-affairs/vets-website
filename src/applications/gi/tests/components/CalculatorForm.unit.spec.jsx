import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import CalculatorForm from '../../components/profile/CalculatorForm';

const props = {
  eligibility: {
    onlineClasses: 'no',
  },

  profile: {
    attributes: {
      facilityCode: '11900146',
      institution: 'MAIN FACILITY',
      physicalCity: 'Test',
      physicalState: 'TN',
      physicalCountry: 'USA',
      physicalZip: '12345',
      country: 'USA',
      dodBah: '100',
      facilityMap: {
        main: {
          institution: {
            facilityCode: '11900146',
          },
        },
      },
    },
  },
};

const invalidInput = {
  beneficiaryLocationQuestion: 'other',
  beneficiaryZIP: '888',
};

const displayed = {
  beneficiaryLocationQuestion: true,
};

const tree = mount(
  <CalculatorForm
    profile={props.profile}
    eligibility={props.eligibility}
    inputs={invalidInput}
    displayedInputs={displayed}
    onShowModal={() => {}}
    onInputChange={() => {}}
  />,
);

describe('<CalculatorForm>', () => {
  it('should display error message when beneficiary zip is less than 5 digits', () => {
    const textBox = tree.find('#errorable-text-input-1');
    textBox.simulate('blur');
    const errorMessage = tree
      .find('#errorable-text-input-1-error-message')
      .text();
    tree.unmount();

    expect(errorMessage).to.equal('Error Postal code must be a 5-digit number');
  });
});

const validInput = {
  beneficiaryLocationQuestion: 'other',
  beneficiaryZIP: '60641',
};

const treeValid = mount(
  <CalculatorForm
    profile={props.profile}
    eligibility={props.eligibility}
    inputs={validInput}
    displayedInputs={displayed}
    onShowModal={() => {}}
    onInputChange={() => {}}
  />,
);

describe('<CalculatorForm> Valid', () => {
  it('should display empty string when beneficiary zip is a valid 5 digit zipcode', () => {
    const textBox2 = treeValid.find('#errorable-text-input-2');
    textBox2.simulate('blur');
    const errorMessage = treeValid.find(
      '#errorable-text-input-2-error-message',
    );
    treeValid.unmount();

    expect(errorMessage.length).to.equal(0);
  });
});
