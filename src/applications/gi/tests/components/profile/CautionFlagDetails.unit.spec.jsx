import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import CautionFlagDetails from '../../../components/profile/CautionFlagDetails';

describe('<CautionFlagDetails>', () => {
  it('should render', () => {
    const tree = shallow(
      <CautionFlagDetails
        cautionFlags={[
          {
            title: 'Test',
          },
        ]}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  it('should not render without caution flags', () => {
    const tree = shallow(<CautionFlagDetails cautionFlags={[]} />);
    expect(tree.type()).to.equal(null);
    tree.unmount();
  });
  it('renders valid caution flags', () => {
    const flags = [
      { title: 'Test Flag 1', description: 'Description 1' },
      { title: 'Test Flag 2', description: 'Description 2' },
    ];
    const tree = shallow(<CautionFlagDetails cautionFlags={flags} />);
    expect(tree.find('.cautionFlagDetails').children()).to.have.lengthOf(
      flags.length,
    );
    tree.unmount();
  });
  it('sorts caution flags by title in case-insensitive alphabetical order', () => {
    const flags = [
      { title: 'b Flag', description: 'Description B' },
      { title: 'A Flag', description: 'Description A' },
    ];
    const tree = shallow(<CautionFlagDetails cautionFlags={flags} />);
    const firstAlertBox = tree.find('AlertBox').first();
    expect(firstAlertBox.props().headline.props.children).to.equal('A Flag');
    tree.unmount();
  });
  it('correctly passes flag details to AlertBox', () => {
    const flag = {
      title: 'Test Flag',
      description: 'Description',
      linkText: 'Click here',
      linkUrl: 'http://example.com',
    };
    const tree = shallow(<CautionFlagDetails cautionFlags={[flag]} />);
    const alertBox = tree.find('AlertBox').first();
    expect(alertBox.props().headline.props.children).to.equal(flag.title);
    expect(alertBox.props().content.props.children[0].props.children).to.equal(
      flag.description,
    );
    tree.unmount();
  });
  it('handles click events on links and records them', () => {
    const flag = {
      title: 'Test Flag',
      description: 'Description',
      linkText: 'Click here',
      linkUrl: 'http://example.com',
    };
    const recordEventSpy = sinon.spy();
    const tree = mount(<CautionFlagDetails cautionFlags={[flag]} />);
    const link = tree.find('a').first();
    link.simulate('click');
    expect(recordEventSpy.calledOnce).to.be.false;
    expect(
      recordEventSpy.calledWith({
        event: 'nav-warning-alert-box-content-link-click',
        alertBoxHeading: flag.title,
      }),
    ).to.be.false;
    tree.unmount();
  });
});
