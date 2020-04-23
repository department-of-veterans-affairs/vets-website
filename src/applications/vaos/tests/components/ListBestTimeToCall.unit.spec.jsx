import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ListBestTimeToCall from '../../components/ListBestTimeToCall';

describe('<ListBestTimeToCall>', () => {
  it('should return "Call in the morning"', () => {
    const tree = shallow(
      <ListBestTimeToCall timesToCall={['In the morning']} />,
    );
    expect(tree.text()).to.equal('Call in the morning');
    tree.unmount();
  });

  it('should return "Call in the evening"', () => {
    const tree = shallow(
      <ListBestTimeToCall timesToCall={['In the evening']} />,
    );
    expect(tree.text()).to.equal('Call in the evening');
    tree.unmount();
  });

  it('should return "Call in the morning or in the evening"', () => {
    const tree = shallow(
      <ListBestTimeToCall timesToCall={['In the morning', 'In the evening']} />,
    );
    expect(tree.text()).to.equal('Call in the morning or in the evening');
    tree.unmount();
  });

  it('should return "Call in the morning, in the afternoon, or in the evening"', () => {
    const tree = shallow(
      <ListBestTimeToCall
        timesToCall={['In the morning', 'In the afternoon', 'In the evening']}
      />,
    );
    expect(tree.text()).to.equal(
      'Call in the morning, in the afternoon, or in the evening',
    );
    tree.unmount();
  });

  it('should return null', () => {
    const tree = shallow(<ListBestTimeToCall timesToCall={[]} />);
    expect(tree.text()).to.equal('');
    tree.unmount();
  });
});
