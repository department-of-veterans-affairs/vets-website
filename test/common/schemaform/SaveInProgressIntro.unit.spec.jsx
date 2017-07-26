import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import SaveInProgressIntro from '../../../src/js/common/schemaform/SaveInProgressIntro';

describe('Schemaform <SaveInProgressIntro>', () => {
  const pageList = [{
    path: 'wrong-path'
  }, {
    path: 'testing'
  }];

  it('should render in progress message', () => {
    const user = {
      profile: {
        savedForms: [
          { form: '1010ez' }
        ],
        prefillsAvailable: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <SaveInProgressIntro
          pageList={pageList}
          formId="1010ez"
          user={user}/>
    );

    expect(tree.subTree('.usa-alert').text()).to.contain('In progress');
    expect(tree.subTree('.usa-alert').text()).to.contain('Expires in');
    expect(tree.subTree('withRouter(FormStartControls)')).not.to.be.false;
    expect(tree.subTree('withRouter(FormStartControls)').props.prefillAvailable).to.be.false;
    expect(tree.subTree('withRouter(FormStartControls)').props.startPage).to.equal('testing');
  });
  it('should pass prefills available prop', () => {
    const user = {
      profile: {
        savedForms: [
          { form: '1010ez' }
        ],
        prefillsAvailable: ['1010ez']
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <SaveInProgressIntro
          pageList={pageList}
          formId="1010ez"
          user={user}/>
    );

    expect(tree.subTree('withRouter(FormStartControls)').props.prefillAvailable).to.be.true;
  });
  it('should render sign in message', () => {
    const user = {
      profile: {
        savedForms: [
          { form: '1010ez' }
        ],
        prefillsAvailable: []
      },
      login: {
        currentlyLoggedIn: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <SaveInProgressIntro
          pageList={pageList}
          formId="1010ez"
          user={user}/>
    );

    expect(tree.subTree('SignInLink')).not.to.be.false;
    expect(tree.subTree('withRouter(FormStartControls)')).not.to.be.false;
  });

  it('should render no message if signed in with no saved form', () => {
    const user = {
      profile: {
        savedForms: [],
        prefillsAvailable: []
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const tree = SkinDeep.shallowRender(
      <SaveInProgressIntro
          pageList={pageList}
          formId="1010ez"
          user={user}/>
    );

    expect(tree.subTree('.usa-alert')).to.be.false;
    expect(tree.subTree('withRouter(FormStartControls)')).not.to.be.false;
  });

  it('should render loading indicator while profile is loading', () => {
    const user = {
      profile: {
        savedForms: [
          { form: '1010ez' }
        ],
        prefillsAvailable: [],
        loading: true
      },
      login: {
        currentlyLoggedIn: false
      }
    };

    const tree = SkinDeep.shallowRender(
      <SaveInProgressIntro
          pageList={pageList}
          formId="1010ez"
          user={user}/>
    );

    expect(tree.subTree('LoadingIndicator')).not.to.be.false;
    expect(tree.subTree('withRouter(FormStartControls)')).to.be.false;
  });
});
