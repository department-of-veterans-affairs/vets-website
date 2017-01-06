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
});
