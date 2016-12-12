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
    console.log(tree.toString());
    expect(tree.dive(['.loading-indicator'])).to.not.be.undefined;
  });

  it('should display details if an item is provided', () => {
    const tree = SkinDeep.shallowRender(<Detail {...props}/>);
    console.log(tree.toString());
    expect(tree.dive(['.rx-table'])).to.not.be.undefined;
    expect(tree.dive(['h2']).text())
      .to.equal(props.prescription.rx.attributes.prescriptionName);
  });
});
