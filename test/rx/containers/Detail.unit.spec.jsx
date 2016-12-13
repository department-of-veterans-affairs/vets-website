import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { Detail } from '../../../src/js/rx/containers/Detail';
import { prescriptions, trackings } from '../../util/rx-helpers.js';

const item = prescriptions.data[0];

const props = {
  alert: {
    content: '',
    status: 'info',
    visible: false
  },
  loading: false,
  prescription: {
    rx: item,
    trackings: trackings.data
  },
  params: {
    id: item.id
  },

  openGlossaryModal: () => {},
  openRefillModal: () => {},
  dispatch: () => {}
};

describe('<Detail>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Detail {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should display a loading screen', () => {
    const tree = SkinDeep.shallowRender(<Detail {...props } loading />);
    expect(tree.dive(['LoadingIndicator'])).to.not.be.undefined;
  });

  it('should display details if an item is provided', () => {
    const tree = SkinDeep.shallowRender(<Detail {...props}/>);
    expect(tree.dive(['h2']).text())
      .to.equal(item.attributes.prescriptionName);
    expect(tree.dive(['#rx-info'])).to.not.be.undefined;
  });

  it('should display order history if the item has an order history', () => {
    const tree = SkinDeep.shallowRender(<Detail {...props}/>);
    expect(tree.dive(['#rx-order-history'])).to.not.be.undefined;
  });

  it('should display a contact card if there is an item', () => {
    const tree = SkinDeep.shallowRender(<Detail {...props}/>);
    const contactCard = tree.subTree('ContactCard');
    expect(contactCard).to.not.be.false;
    expect(contactCard.props.facilityName)
      .to.equal(item.attributes.facilityName);
  });
});
