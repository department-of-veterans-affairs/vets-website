// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Relative
import LabelText from '../../components/LabelText';

describe('<LabelText>', () => {
  it('should always render a <div /> tag.', () => {
    const defaultProps = {
      item: {
        description: 'Some description',
        expanded: true,
        hasChildren: true,
        href: '',
        id: '00c9a1ff-3550-4f54-9239-c769fc6edab1',
        label: 'Location',
        order: 0,
        parentID: '8e5668a6-90d9-4913-bc9f-c8f6788d7a2e',
      },
    };

    const wrapper = shallow(<LabelText {...defaultProps} />);
    expect(wrapper.name()).to.equal('div');
    wrapper.unmount();
  });
});
