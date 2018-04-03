import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import chaiAsPromised from 'chai-as-promised';
import chai, { expect } from 'chai';

import ProgressButton from '@department-of-veterans-affairs/jean-pants/ProgressButton';

chai.use(chaiAsPromised);

describe('<ProgressButton>', () => {
  it('has sane looking features', () => {
    const tree = SkinDeep.shallowRender(<ProgressButton/>);
    const buttons = tree.everySubTree('button');
    expect(buttons).to.have.lengthOf(1);
  });

  it('calls handle() on click', () => {
    let progressButton;

    const updatePromise = new Promise((resolve, _reject) => {
      progressButton = ReactTestUtils.renderIntoDocument(
        <ProgressButton onButtonClick={() => { resolve(true); }}/>
      );
    });

    const button = ReactTestUtils.findRenderedDOMComponentWithTag(progressButton, 'button');
    ReactTestUtils.Simulate.click(button);

    return expect(updatePromise).to.eventually.eql(true);
  });
});
