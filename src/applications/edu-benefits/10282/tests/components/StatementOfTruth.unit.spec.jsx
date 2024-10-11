import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import StatementOfTruth from '../../components/StatementOfTruth';

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
});
