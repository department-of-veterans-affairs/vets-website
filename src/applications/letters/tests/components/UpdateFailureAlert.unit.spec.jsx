import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import UpdateFailureAlert from '../../components/UpdateFailureAlert';

const defaultProps = {
  addressObject: {
    addressOne: '123 Main St N',
    city: 'Bigtowne',
    stateCode: 'BS',
    countryName: 'Elsweyre',
  },
};

describe('<UpdateFailureAlert>', () => {
  it('should render failure message', () => {
    const tree = mount(<UpdateFailureAlert {...defaultProps} />);

    expect(tree.find('.usa-alert-heading').text()).to.contain(
      "We aren't able to save your updated address",
    );
    tree.unmount();
  });
});
