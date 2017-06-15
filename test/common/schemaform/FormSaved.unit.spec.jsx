import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import { FormSaved } from '../../../src/js/common/schemaform/FormSaved';

describe('Schemaform <FormSaved>', () => {
  it('should render', () => {
    const route = {
      pageList: [
        {
          path: 'testing'
        }
      ]
    };
    const lastSavedDate = 1497300513914;

    const tree = SkinDeep.shallowRender(
      <FormSaved lastSavedDate={lastSavedDate} route={route}/>
    );

    expect(tree.everySubTree('ProgressButton').length).to.equal(2);
    expect(tree.subTree('.usa-alert').text()).to.contain('6/12/2017 at');
  });
  it('should go back', () => {
    const route = {
      pageList: [
        {
          path: 'testing'
        }
      ]
    };
    const router = {
      goBack: sinon.spy()
    };

    const lastSavedDate = 1497300513914;

    const tree = SkinDeep.shallowRender(
      <FormSaved router={router} lastSavedDate={lastSavedDate} route={route}/>
    );

    tree.getMountedInstance().goBack();
    expect(router.goBack.called).to.be.true;
  });
  it('should go to first page', () => {
    const route = {
      pageList: [
        {
          path: 'testing'
        }
      ]
    };
    const router = {
      push: sinon.spy()
    };

    const lastSavedDate = 1497300513914;

    const tree = SkinDeep.shallowRender(
      <FormSaved router={router} lastSavedDate={lastSavedDate} route={route}/>
    );

    tree.getMountedInstance().goToBeginning();
    expect(router.push.firstCall.args[0]).to.equal('testing');
  });
});
