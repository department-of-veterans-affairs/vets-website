import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { Detail } from '../../../src/js/rx/containers/Detail';
import { prescriptions, trackings } from '../../util/rx-helpers.js';

const rx = prescriptions.data[0];

const props = {
  alert: {
    content: '',
    status: 'info',
    visible: false
  },
  loading: false,
  prescription: null,
  params: {
    id: rx.id
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

  it('should display details if there is a prescription', () => {
    const prescription = { rx, trackings }
    const tree = SkinDeep.shallowRender(
      <Detail {...props} prescription={prescription}/>
    );
    expect(tree.dive(['h2']).text())
      .to.equal(rx.attributes.prescriptionName);
    expect(tree.dive(['#rx-info'])).to.not.be.undefined;
  });

  it('should display order history if the prescription has an order history', () => {
    const prescription = { rx, trackings }
    const tree = SkinDeep.shallowRender(
      <Detail {...props} prescription={prescription}/>
    );
    expect(tree.dive(['#rx-order-history'])).to.not.be.undefined;
  });

  it('should display a contact card if there is an prescription', () => {
    const prescription = { rx, trackings }
    const tree = SkinDeep.shallowRender(
      <Detail {...props} prescription={prescription}/>
    );
    const contactCard = tree.subTree('ContactCard');
    expect(contactCard).to.not.be.false;
    expect(contactCard.props.facilityName)
      .to.equal(rx.attributes.facilityName);
  });
});
