import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';

const formData = {
  street: 'MILITARY ADDY 3',
  street2: 'street 2',
  street3: 'street 3',
  city: 'Nowhere',
  country: 'USA',
  state: 'MI',
  postalCode: '22312',
};

describe('<AddressViewField>', () => {
  it('should render', () => {
    const component = shallow(<AddressViewField formData={formData} />);

    const text = component.text();

    expect(text).to.contain(formData.street);
    expect(text).to.contain(formData.street2);
    expect(text).to.contain(formData.street3);
    expect(text).to.contain(formData.city);
    expect(text).to.contain(formData.state);
    expect(text).to.contain(formData.postalCode);
    expect(text).to.not.contain(formData.country);

    component.unmount();
  });
});
