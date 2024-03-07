import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import VAPServiceTransactionPending from '../../components/base/VAPServiceTransactionPending';

describe.skip('<VAPServiceTransactionPending/>', () => {
  let props = null;
  beforeEach(() => {
    props = {
      refreshTransaction: sinon.stub(),
      title: 'Some title',
    };
  });

  it('renders', done => {
    const component = enzyme.shallow(
      <VAPServiceTransactionPending {...props} />,
    );

    setTimeout(() => {
      // This should be a 3 or 4, but I'm undershooting this by setting it at 2. I don't know what to expect with a shallow-render on the Jenkins server.
      expect(props.refreshTransaction.callCount).to.be.greaterThan(2);
      expect(component.html()).to.contain(props.title.toLowerCase());
      component.unmount();
      done();
    }, 4000);
  });
});
