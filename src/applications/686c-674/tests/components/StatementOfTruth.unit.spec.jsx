import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import StatementOfTruth, {
  signatureValidator,
} from '../../components/StatementOfTruth';

const signatureProps = {
  formData: {
    veteranInformation: {
      fullName: {
        first: 'Jane',
        last: 'Doe',
      },
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
      const signatureName = 'Jane A Doe'; // ← FIXED
      const formData = {
        veteranInformation: {
          fullName: {
            first: 'Jane',
            middle: 'A',
            last: 'Doe',
          },
        },
      };
      const result = signatureValidator(signatureName, formData);
      expect(result).to.be.undefined;
    });

    it('should return error if not matching names', () => {
      const signatureName = 'Jean Doe';
      const formData = {
        veteranInformation: {
          fullName: {
            first: 'John',
            middle: 'A',
            last: 'Doe',
          },
        },
      };
      const result = signatureValidator(signatureName, formData);
      expect(result).equal(
        'Please enter your full name exactly as entered on the form: John A Doe',
      );
    });
  });

  it('should handle empty formData', () => {
    const wrapper = shallow(
      <StatementOfTruth
        formData={{
          veteranInformation: {
            fullName: {
              first: '',
              middle: '',
              last: '',
            },
          },
        }}
      />,
    );
    expect(wrapper).to.not.be.undefined;
    wrapper.unmount();
  });
});
