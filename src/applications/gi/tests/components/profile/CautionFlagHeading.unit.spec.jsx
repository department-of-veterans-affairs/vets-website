import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import CautionFlagHeading from '../../../components/profile/CautionFlagHeading';

describe('<CautionFlagHeading>', () => {
  it('should render', () => {
    const tree = shallow(
      <CautionFlagHeading
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
    const tree = shallow(<CautionFlagHeading cautionFlags={[]} />);
    expect(tree.type()).to.equal(null);
    tree.unmount();
  });
  it('renders null when no valid flags are present', () => {
    const tree = shallow(<CautionFlagHeading cautionFlags={[]} />);
    expect(tree.type()).to.equal(null);
    tree.unmount();
  });
  it('renders a single warning when one valid flag is present', () => {
    const flags = [{ title: 'Warning 1' }];
    const tree = mount(<CautionFlagHeading cautionFlags={flags} />);
    expect(tree.find('.usa-alert-heading').text()).to.equal(
      'This school has a cautionary warning',
    );
    expect(
      tree
        .find('p')
        .at(0)
        .text(),
    ).to.equal('Warning 1');
    tree.unmount();
  });
  it('renders multiple warnings when multiple valid flags are present', () => {
    const flags = [{ title: 'Warning 1' }, { title: 'Warning 2' }];
    const tree = mount(
      <CautionFlagHeading cautionFlags={flags} onViewWarnings={() => {}} />,
    );
    expect(tree.find('.usa-alert-heading').text()).to.equal(
      'This school has cautionary warnings',
    );
    expect(tree.find('li')).to.have.lengthOf(2);
    tree.unmount();
  });
  it('sorts multiple warnings correctly', () => {
    const flags = [{ title: 'Beta' }, { title: 'Alpha' }];
    const tree = mount(<CautionFlagHeading cautionFlags={flags} />);
    expect(
      tree
        .find('li')
        .at(0)
        .text(),
    ).to.equal('Alpha');
    expect(
      tree
        .find('li')
        .at(1)
        .text(),
    ).to.equal('Beta');
    tree.unmount();
  });
  it('triggers onViewWarnings when the link is clicked', () => {
    const onViewWarningsSpy = sinon.spy();
    const flags = [{ title: 'Warning' }];
    const tree = mount(
      <CautionFlagHeading
        cautionFlags={flags}
        onViewWarnings={onViewWarningsSpy}
      />,
    );

    tree.find('a').simulate('click');
    expect(onViewWarningsSpy).to.have.property('callCount', 1);
    tree.unmount();
  });
});
