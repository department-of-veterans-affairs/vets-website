import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import SaveInProgressIntro from '../../../src/js/common/schemaform/SaveInProgressIntro';

describe('Schemaform <SaveInProgressIntro>', () => {
  const pageList = [{
    path: 'wrong-path'
  }, {
    path: 'testing'
  }];
  const fetchInProgressForm = () => {};
  const removeInProgressForm = () => {};
  const updateLogInUrl = () => {};

  it('should render in progress message', () => {
    const user = {
      profile: {
        savedForms: [
          { form: '1010ez', metadata: { last_updated: 3000, expires_at: moment().unix() + 2000 } } // eslint-disable-line camelcase
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
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        updateLogInUrl={updateLogInUrl}/>
    );

    expect(tree.subTree('.usa-alert').text()).to.contain('In progress');
    expect(tree.subTree('.usa-alert').text()).to.contain('will expire on');
    expect(tree.subTree('withRouter(FormStartControls)')).not.to.be.false;
    expect(tree.subTree('withRouter(FormStartControls)').props.prefillAvailable).to.be.false;
    expect(tree.subTree('withRouter(FormStartControls)').props.startPage).to.equal('testing');
  });
  it('should pass prefills available prop', () => {
    const user = {
      profile: {
        savedForms: [
          { form: '1010ez', metadata: { last_updated: 3000, expires_at: moment().unix() + 2000 } } // eslint-disable-line camelcase
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
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        updateLogInUrl={updateLogInUrl}/>
    );

    expect(tree.subTree('withRouter(FormStartControls)').props.prefillAvailable).to.be.true;
  });
  it('should render sign in message', () => {
    const user = {
      profile: {
        savedForms: [
          { form: '1010ez', metadata: { last_updated: 3000, expires_at: moment().unix() + 2000 } } // eslint-disable-line camelcase
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
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        updateLogInUrl={updateLogInUrl}/>
    );

    expect(tree.subTree('SignInLink')).not.to.be.false;
    expect(tree.subTree('withRouter(FormStartControls)')).not.to.be.false;
  });

  it('should render message if signed in with no saved form', () => {
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
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        updateLogInUrl={updateLogInUrl}/>
    );

    expect(tree.subTree('.usa-alert').text()).to.contain('You can save this form in progress');
    expect(tree.subTree('withRouter(FormStartControls)')).not.to.be.false;
  });

  it('should render loading indicator while profile is loading', () => {
    const user = {
      profile: {
        savedForms: [
          { form: '1010ez', metadata: { last_updated: 3000, expires_at: moment().unix() + 2000 } } // eslint-disable-line camelcase
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
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        updateLogInUrl={updateLogInUrl}/>
    );

    expect(tree.subTree('LoadingIndicator')).not.to.be.false;
    expect(tree.subTree('withRouter(FormStartControls)')).to.be.false;
  });
  it('should render message if signed in with an expired form', () => {
    const user = {
      profile: {
        savedForms: [
          { form: '1010ez', metadata: { last_updated: 3000, expires_at: moment().unix() - 1000 } } // eslint-disable-line camelcase
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
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        updateLogInUrl={updateLogInUrl}/>
    );

    expect(tree.subTree('.usa-alert').text()).to.contain('You can save this form in progress');
    expect(tree.subTree('withRouter(FormStartControls)')).not.to.be.false;
  });
});
