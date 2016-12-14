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

  it('should render a loading screen', () => {
    const tree = SkinDeep.shallowRender(
      <Detail {...props } loading prescription={null}/>
    );
    expect(tree.dive(['LoadingIndicator'])).to.not.be.undefined;
  });

  it('should render details if there is a prescription', () => {
    const tree = SkinDeep.shallowRender(<Detail {...props}/>);
    expect(tree.dive(['h2']).text()).to.equal(item.attributes.prescriptionName);
    expect(tree.dive(['#rx-info'])).to.not.be.undefined;
  });

  it('should render order history table if there is tracking data', () => {
    const tree = SkinDeep.shallowRender(<Detail {...props}/>);
    const orderHistory = tree.dive(['OrderHistory']);
    expect(orderHistory).to.not.be.undefined;
  });

  it('should not render order history table without tracking data', () => {
    const prescription = { rx: item, trackings: [] };
    const tree = SkinDeep.shallowRender(
      <Detail {...props} prescription={prescription}/>
    );

    // Should still render the order history section with a disclaimer
    // about expiration of tracking data.
    const orderHistory = tree.dive(['#rx-order-history']);
    expect(orderHistory.subTree('OrderHistory')).to.be.false;
  });

  it('should render a contact card if there is an prescription', () => {
    const tree = SkinDeep.shallowRender(<Detail {...props}/>);
    const contactCard = tree.subTree('ContactCard');
    expect(contactCard).to.not.be.false;
    expect(contactCard.props.facilityName)
      .to.equal(item.attributes.facilityName);
    expect(contactCard.props.phoneNumber)
      .to.equal(props.prescription.trackings[0].attributes.rxInfoPhoneNumber);
  });
});
