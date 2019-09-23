/* eslint-disable no-console */
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

const inputs = {
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
    inputs={inputs}
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

    expect(errorMessage).to.equal('Error Zip code must be a 5-digit number');
  });
});
