import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Prescription from '../../../src/js/rx/components/Prescription.jsx';
import { prescriptions } from '../../util/rx-helpers.js';

const item = prescriptions.data[0];

const props = {
  ...item,
  glossaryModalHandler: () => {},
  refillModalHandler: () => {},
  dispatch: () => {}
};

describe('<Prescription>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Prescription {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should render tracking link if applicable', () => {
    const newProps = {
      ...props,
      attributes: {
        ...props.attributes,
        isTrackable: true,
      },
    };

    const tree = SkinDeep.shallowRender(<Prescription {...newProps}/>);
    expect(tree.subTree('TrackPackageLink')).to.exist;
  });

  it('should not render tracking link if not applicable', () => {
    const tree = SkinDeep.shallowRender(<Prescription {...props}/>);
    expect(tree.subTree(['.rx-track-package-link'])).to.be.false;
  });

  it('should show Message Provider link when no refills remaining', () => {
    const newProps = {
      ...props,
      attributes: {
        ...props.attributes,
        refillRemaining: 0,
      },
    };

    const tree = SkinDeep.shallowRender(<Prescription {...newProps}/>);
    expect(tree.subTree('.rx-call-provider')).to.exist;
  });

  it('should not show Message Provider link if refills remaining', () => {
    const tree = SkinDeep.shallowRender(<Prescription {...props}/>);
    expect(tree.subTree(['.rx-call-provider'])).to.be.false;
  });

  it('should show SubmitRefill button if refillable', () => {
    const newProps = {
      ...props,
      attributes: {
        ...props.attributes,
        isRefillable: true,
      },
    };

    const tree = SkinDeep.shallowRender(<Prescription {...newProps}/>);
    expect(tree.subTree('SubmitRefill')).to.exist;
  });

  it('should show refill status if not refillable', () => {
    const tree = SkinDeep.shallowRender(<Prescription {...props}/>);
    expect(tree.subTree(['.rx-prescription-status'])).to.exist;
    expect(tree.subTree('GlossaryLink')).to.exist;
  });
});
