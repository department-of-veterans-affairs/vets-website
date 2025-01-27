import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import StatementOfTruth, {
  signatureValidator,
} from '../../components/StatementOfTruth';

const signatureProps = {
  formData: {
    veteranFullName: {
      first: 'Jane',
      last: 'Doe',
    },
  },
};

describe('<StatementOfTruth>', () => {
  it('should render', () => {
    const wrapper = shallow(<StatementOfTruth {...signatureProps} />);
    expect(wrapper).to.not.be.undefined;
    wrapper.unmount();
  });
  describe('validate signature', () => {
    it('if matching names it should return no errors', () => {
      const signatureName = 'Jane Doe';
      const formData = {
        veteranFullName: {
          first: 'Jane',
          middle: '',
          last: 'Doe',
        },
      };
      const result = signatureValidator(signatureName, formData);
      expect(result).to.be.undefined;
    });

    it('should return error if not matching names', () => {
      const signatureName = 'Jean Doe';
      const formData = {
        veteranFullName: {
          first: 'John',
          last: 'Doe',
        },
      };
      const result = signatureValidator(signatureName, formData);
      expect(result).equal(
        'Please enter your full name exactly as entered on the form: John  Doe',
      );
    });
  });

  it('should handle empty formData', () => {
    const signatureName = 'Jean Doe';
    const formData = { veteranFullName: { first: '', last: '' } };
    const result = signatureValidator(signatureName, formData);
    expect(result).equal(
      'Please enter your full name exactly as entered on the form:   ',
    );
  });
});
