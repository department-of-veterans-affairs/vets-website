import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { AskVAPage } from '../../../src/js/disability-benefits/containers/AskVAPage';

describe('<AskVAPage>', () => {
  it('should render disabled button', () => {
    const router = {
      push: sinon.spy()
    };

    const tree = SkinDeep.shallowRender(
      <AskVAPage
          decisionRequestError={null}
          router={router}/>
    );
    expect(tree.everySubTree('button')[0].props.disabled).to.be.true;
    expect(router.push.called).to.be.false;
  });

  it('should render enabled button', () => {
    const router = {
      push: sinon.spy()
    };
    const submitRequest = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AskVAPage
          decisionRequestError={null}
          params={{ id: 1 }}
          submitRequest={submitRequest}
          router={router}/>
    );

    tree.subTree('ErrorableCheckbox').props.onValueChange(true);
    expect(tree.everySubTree('button')[0].props.disabled).to.be.null;
  });

  it('should render disabled submitting button', () => {
    const router = {
      push: sinon.spy()
    };
    const submitRequest = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AskVAPage
          loadingDecisionRequest
          decisionRequestError={null}
          params={{ id: 1 }}
          submitRequest={submitRequest}
          router={router}/>
    );

    expect(tree.everySubTree('button')[0].props.disabled).to.be.true;
    expect(tree.everySubTree('button')[0].text()).to.equal('Submitting...');
  });

  it('should submit request', () => {
    const router = {
      push: sinon.spy()
    };
    const submitRequest = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AskVAPage
          decisionRequestError={null}
          params={{ id: 1 }}
          submitRequest={submitRequest}
          router={router}/>
    );

    tree.subTree('ErrorableCheckbox').props.onValueChange(true);
    tree.subTree('button').props.onClick();
    expect(submitRequest.called).to.be.true;
  });
});
