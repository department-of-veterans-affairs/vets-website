import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';

describe('Schemaform: ObjectField', () => {
  const baseData = {
    city: 'city',
    state: 'state',
    country: 'country',
  };
  it('should render', () => {
    const formData = {
      ...baseData,
      street: 's1',
      line2: 's2',
      line3: 's3',
      postalCode: '012345',
    };
    const tree = SkinDeep.shallowRender(
      <AddressViewField formData={formData} />,
    );
    // console.log(tree.text());
    expect(tree.everySubTree('AddressViewField')).not.to.be.empty;
  });
});
