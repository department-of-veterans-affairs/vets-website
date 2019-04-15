import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { ConnectedApp } from '../../components/ConnectedApp';

const account = {
  id: 'fake-id',
  type: 'connected_accounts',
  attributes: {
    href: 'example.com',
    logo: 'example.com/fancy_duck.jpg',
    title: 'Ducks R Us',
    created: '2018-11-05T17:29:40+0000',
    grants: ['Stuff', 'Things'],
  },
};

describe('<ConnectedApp>', () => {
  it('opening the row and clicking button opens the confirm delete modal', () => {
    const tree = SkinDeep.shallowRender(
      <ConnectedApp {...account} confirmDelete={() => null} />,
    );

    const row = tree.dive(['.va-connected-acct-row']);
    const toggleButton = row.subTree('.va-connected-acct-row-details-toggle');
    toggleButton.props.onClick();

    tree.subTree('.usa-button-primary').props.onClick({ target: {} });

    expect(tree.subTree('AccountModal').props.modalOpen).to.be.true;
  });

  it('calls confirm delete', () => {
    const confirmDelete = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <div>
        <ConnectedApp {...account} confirmDelete={confirmDelete} />
      </div>,
    );

    tree.subTree('ConnectedApp').props.confirmDelete('fake-id');
    expect(confirmDelete.firstCall.calledWith('fake-id')).to.be.true;
  });
});
