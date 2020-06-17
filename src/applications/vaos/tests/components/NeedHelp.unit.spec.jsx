import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import NeedHelp from '../../components/NeedHelp';

describe('VAOS <NeedHelp>', () => {
  it('should render', () => {
    const tree = shallow(<NeedHelp />);

    expect(tree.find('h2').text()).to.contain('Need help?');
    expect(tree.hasClass('vads-u-margin-top--9')).be.true;

    const links = tree.find('a');
    expect(links.length).to.equal(3);
    expect(links.at(0).props().href).to.equal('tel:8774705947');
    expect(links.at(0).text()).to.equal('877-470-5947');
    expect(links.at(1).props().href).to.equal('tel:8666513180');
    expect(links.at(1).text()).to.equal('866-651-3180');
    expect(links.at(2).props().href).to.equal(
      'https://veteran.apps.va.gov/feedback-web/v1/?appId=85870ADC-CC55-405E-9AC3-976A92BBBBEE',
    );
    expect(links.at(2).text()).to.equal(
      'Leave feedback about this application',
    );
    tree.unmount();
  });
  it('should have aria labels to hide from screen reader', () => {
    const tree = shallow(<NeedHelp />);

    expect(tree.find('hr[aria-hidden="true"]').exists()).to.be.true;
    tree.unmount();
  });
});
