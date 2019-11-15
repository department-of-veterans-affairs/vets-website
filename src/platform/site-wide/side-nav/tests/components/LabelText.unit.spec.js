// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { uniqueId } from 'lodash';
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
        id: uniqueId(),
        label: 'Location',
        order: 0,
        parentID: uniqueId(),
      },
    };

    const wrapper = shallow(<LabelText {...defaultProps} />);
    expect(wrapper.name()).to.equal('div');
    wrapper.unmount();
  });
});
