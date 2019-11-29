import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import TypeOfCareUnavailableModal from '../../components/TypeOfCareUnavailableModal';

const typeOfCare = 'Podiatry';

describe('VAOS <TypeOfCareUnavailableModal>', () => {
  it('should not render modal if showCancelModal is false', () => {
    const tree = shallow(
      <TypeOfCareUnavailableModal showModal={false} typeOfCare={typeOfCare} />,
    );

    expect(tree.text()).to.equal('');
    tree.unmount();
  });

  it('should render confirmation modal', () => {
    const tree = shallow(
      <TypeOfCareUnavailableModal showModal typeOfCare={typeOfCare} />,
    );

    const modal = tree.find('Modal');
    expect(modal.exists()).to.be.true;
    expect(modal.props().title).to.equal(
      'You canʼt schedule a Podiatry appointment right now',
    );
    expect(
      tree
        .find('Modal')
        .find('button')
        .prop('children'),
    ).to.equal('Ok');

    tree.unmount();
  });
});
