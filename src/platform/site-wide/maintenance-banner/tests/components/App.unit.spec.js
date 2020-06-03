// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { uniqueId } from 'lodash';
// Relative
import App from '../../components/App';

describe('<App>', () => {
  const firstID = uniqueId('app_');
  const secondID = uniqueId('app_');

  const defaultProps = {
    navItemsLookup: {
      [firstID]: {
        description: 'Some description',
        expanded: false,
        hasChildren: true,
        href: '/pittsburgh-health-care',
        id: firstID,
        label: 'Location',
        order: 0,
        parentID: uniqueId('app_'),
      },
      [secondID]: {
        description: 'Some description',
        expanded: false,
        hasChildren: false,
        href: '/pittsburgh-health-care/location',
        id: secondID,
        label: 'Pittsburgh Health Care',
        order: 0,
        parentID: undefined,
      },
    },
  };

  it('should not render when there are no nav items to show', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });

  it('should render when there are nav items', () => {
    const wrapper = shallow(<App {...defaultProps} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });
});
