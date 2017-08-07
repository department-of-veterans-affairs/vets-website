import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { FormSaved } from '../../../src/js/common/schemaform/FormSaved';

describe('Schemaform <FormSaved>', () => {
  const route = {
    pageList: [
      {
        path: 'wrong-path'
      },
      {
        path: 'testing'
      }
    ],
    formConfig: {
    }
  };
  const user = {
    profile: {
      prefillsAvailable: []
    },
    login: {
      verifyUrl: 'http://fake-verify-url'
    }
  };
  const lastSavedDate = 1497300513914;

  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <FormSaved lastSavedDate={lastSavedDate} route={route} user={user}/>
    );

    expect(tree.subTree('withRouter(FormStartControls)')).not.to.be.false;
    expect(tree.subTree('withRouter(FormStartControls)').props.startPage).to.equal('testing');
    expect(tree.subTree('.usa-alert').text()).to.contain('6/12/2017 at');
  });
  it('should display verify link if user is not verified', () => {
    const tree = SkinDeep.shallowRender(
      <FormSaved lastSavedDate={lastSavedDate} route={route} user={user}/>
    );

    expect(tree.everySubTree('.usa-alert').length).to.equal(2);
  });
  it('should not display verify link if user is verified', () => {
    user.profile.accountType = 3;
    const tree = SkinDeep.shallowRender(
      <FormSaved lastSavedDate={lastSavedDate} route={route} user={user}/>
    );

    expect(tree.everySubTree('.usa-alert').length).to.equal(1);
  });
});
