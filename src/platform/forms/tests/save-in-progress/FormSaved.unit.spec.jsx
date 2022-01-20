import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { FormSaved } from '../../save-in-progress/FormSaved';

describe('Schemaform <FormSaved>', () => {
  const route = {
    pageList: [
      {
        path: 'wrong-path',
      },
      {
        path: 'testing',
      },
    ],
    formConfig: {
      formId: '123',
      saveInProgress: {
        messages: {
          saved: 'Your education benefits (123) application has been saved.',
        },
      },
    },
  };
  const formId = VA_FORM_IDS.FORM_10_10EZ;
  const user = () => ({
    profile: {
      prefillsAvailable: [],
    },
    login: {
      verifyUrl: 'http://fake-verify-url',
    },
  });
  const lastSavedDate = 1497300513914;
  const expirationDate = moment().unix() + 2000;

  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={route}
        user={user()}
      />,
    );
    expect(tree.subTree('withRouter(FormStartControls)')).not.to.be.false;
    expect(
      tree.subTree('withRouter(FormStartControls)').props.startPage,
    ).to.equal('testing');
    expect(tree.subTree('.usa-alert').text()).to.contain('June 12, 2017, at');
    expect(tree.subTree('.usa-alert').text()).to.contain('will expire on');
    expect(tree.subTree('.usa-alert').text()).to.contain(
      'Your education benefits (123) application has been saved.',
    );
  });
  it('should display verify link if user is not verified', () => {
    const tree = SkinDeep.shallowRender(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={route}
        user={user()}
      />,
    );

    expect(tree.everySubTree('.usa-alert').length).to.equal(2);
  });
  it('should not display verify link if user is verified', () => {
    const u = user();
    u.profile.verified = true;
    const tree = SkinDeep.shallowRender(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={route}
        user={u}
      />,
    );

    expect(tree.everySubTree('.usa-alert').length).to.equal(1);
  });
  it('should still show start a new button', () => {
    const tree = SkinDeep.shallowRender(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={route}
        user={user()}
      />,
    );
    expect(tree.subTree('withRouter(FormStartControls)').props.resumeOnly).to
      .not.be.true;
  });
  it('should config form controls to be resume only', () => {
    const thisRoute = {
      pageList: [
        {
          path: 'wrong-path',
        },
        {
          path: 'testing',
        },
      ],
      formConfig: {
        formId: '123',
        saveInProgress: {
          resumeOnly: true,
          messages: {
            saved: 'Your education benefits (123) application has been saved.',
          },
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={thisRoute}
        user={user()}
      />,
    );
    expect(tree.subTree('withRouter(FormStartControls)').props.resumeOnly).to.be
      .true;
  });

  it('should handle form config being empty', () => {
    const thisRoute = {
      pageList: [
        {
          path: 'wrong-path',
        },
        {
          path: 'testing',
        },
      ],
      formConfig: {},
    };
    const tree = SkinDeep.shallowRender(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={thisRoute}
        user={user()}
      />,
    );
    expect(tree.subTree('withRouter(FormStartControls)')).exist;
  });
  it('should handle save in progress being empty', () => {
    const thisRoute = {
      pageList: [
        {
          path: 'wrong-path',
        },
        {
          path: 'testing',
        },
      ],
      formConfig: {
        saveInProgress: {},
      },
    };
    const tree = SkinDeep.shallowRender(
      <FormSaved
        scrollParams={{}}
        location={{}}
        formId={formId}
        lastSavedDate={lastSavedDate}
        expirationDate={expirationDate}
        route={thisRoute}
        user={user()}
      />,
    );
    expect(tree.subTree('withRouter(FormStartControls)')).to.exist;
  });
});
