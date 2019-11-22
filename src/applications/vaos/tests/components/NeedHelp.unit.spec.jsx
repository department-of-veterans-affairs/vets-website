import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import NeedHelp from '../../components/NeedHelp';

describe('VAOS <NeedHelp>', () => {
  it('should render', () => {
    const tree = shallow(<NeedHelp />);

    expect(tree.find('h2').text()).to.contain('Need help?');

    const links = tree.find('a');
    expect(links.length).to.equal(5);
    expect(links.at(0).props().href).to.equal('tel:8772228387');
    expect(links.at(0).text()).to.equal('877-222-8387');
    expect(links.at(1).props().href).to.equal('tel:8008778339');
    expect(links.at(1).text()).to.equal('800-877-8339');
    expect(links.at(2).props().href).to.equal('tel:8772228387');
    expect(links.at(2).text()).to.equal('877-222-8387');
    expect(links.at(3).props().href).to.equal('tel:8008778339');
    expect(links.at(3).text()).to.equal('800-877-8339');
    expect(links.at(4).text()).to.equal('Leave feedback for this application');
    tree.unmount();
  });
});
