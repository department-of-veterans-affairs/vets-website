import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SortMenu from '../../../src/js/rx/components/SortMenu';

const props = {
  onChange: () => {},
  onClick: () => {},
  options: [
    {
      label: 'Prescription name',
      value: 'prescriptionName'
    },
    {
      label: 'Facility name',
      value: 'facilityName'
    },
    {
      label: 'Last submit date',
      value: 'lastSubmitDate'
    },
    {
      label: 'Last fill date',
      value: 'refillDate'
    }
  ],
  selected: {
    order: 'ASC',
    value: 'prescriptionName'
  }
};

describe('<SortMenu>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<SortMenu {...props}/>);
    expect(tree.getRenderOutput()).to.exist;
  });

  it('should render the correct options', () => {
    const tree = SkinDeep.shallowRender(<SortMenu {...props}/>);
    const options = tree.everySubTree('option');
    options.forEach((option, index) => {
      const { label, value } = props.options[index];
      expect(option.text()).to.equal(label);
      expect(option.props.value).to.equal(value);
    });
  });
});
