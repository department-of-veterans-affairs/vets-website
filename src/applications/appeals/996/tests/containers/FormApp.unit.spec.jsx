import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { Form0996App } from '../../containers/Form0996App';
import { setHlrWizardStatus, removeHlrWizardStatus } from '../../wizard/utils';
import { SELECTED } from '../../constants';

import maximalTestV1 from '../fixtures/data/maximal-test-v1.json';
import migratedMaximalTestV1 from '../fixtures/data/migrated/maximal-test-v1-to-v2.json';

const profile = {
  vapContactInfo: {
    email: {
      emailAddress: 'test@user.com',
    },
    mobilePhone: {
      countryCode: '2',
      areaCode: '345',
      phoneNumber: '6789012',
      phoneNumberExt: '34',
      updatedAt: '2021-01-01',
    },
    mailingAddress: {
      addressLine1: '123 test',
      addressLine2: 'c/o foo',
      addressLine3: 'suite 99',
      city: 'Big City',
      stateCode: 'NV',
      zipCode: '10101',
      countryName: 'USA',
      internationalPostalCode: '12345',
      updatedAt: '2021-01-01',
    },
  },
};

const savedHlr = [
  {
    form: VA_FORM_IDS.FORM_20_0996,
    metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
  },
];

const getData = ({
  loggedIn = true,
  mockProfile = profile,
  savedForms = [],
} = {}) => ({
  props: {
    loggedIn,
    location: { pathname: '/introduction', search: '' },
    children: <h1>Intro</h1>,
    profile: mockProfile,
    formData: { benefitType: 'compensation' },
    setFormData: () => {},
    getContestableIssues: () => {},
    router: { push: () => {} },
  },
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: { ...mockProfile, savedForms },
      },
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('Form0996App', () => {
  it('should render', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const { props, mockStore } = getData({ loggedIn: false });
    const tree = mount(
      <Provider store={mockStore}>
        <Form0996App {...props} />
      </Provider>,
    );
    const article = tree.find('#form-0996');
    expect(article).to.exist;
    expect(article.props()['data-location']).to.eq('introduction');
    expect(tree.find('h1').text()).to.eq('Intro');
    expect(tree.find('Connect(RoutedSavableApp)')).to.exist;
    expect(tree.find('va-loading-indicator')).to.have.lengthOf(0);

    tree.unmount();
  });

  it('should redirect to /start', () => {
    removeHlrWizardStatus();
    const { props, mockStore } = getData({ savedForms: savedHlr });
    const routerPushSpy = sinon.spy();
    const tree = mount(
      <Provider store={mockStore}>
        <Form0996App {...props} router={{ push: routerPushSpy }} />,
      </Provider>,
    );

    expect(tree.find('va-loading-indicator').html()).to.contain('restart');
    expect(tree.find('va-loading-indicator')).to.have.lengthOf(1);
    expect(routerPushSpy.called).to.be.true;
    expect(routerPushSpy.args[0][0]).to.eq('/start');

    tree.unmount();
  });

  it('should show contestable issue loading indicator', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const { props, mockStore } = getData({ savedForms: savedHlr });
    const getIssues = sinon.spy();
    const tree = mount(
      <Provider store={mockStore}>
        <Form0996App
          {...props}
          getContestableIssues={getIssues}
          contestableIssues={{
            issues: [],
            status: '',
            error: '',
            benefitType: 'compensation',
          }}
        />
      </Provider>,
    );

    tree.setProps();
    expect(tree.find('va-loading-indicator').html()).to.contain(
      'Loading your previous decision',
    );
    expect(getIssues.calledOnce).to.be.true;
    tree.unmount();
  });
  it('should not call API if not logged in', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const { props, mockStore } = getData({ loggedIn: false });
    const getIssues = sinon.spy();
    const tree = mount(
      <Provider store={mockStore}>
        <Form0996App {...props} getContestableIssues={getIssues} />
      </Provider>,
    );

    tree.setProps();
    expect(getIssues.notCalled).to.be.true;

    tree.unmount();
  });

  it('should not throw an error if profile is null', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const getIssues = sinon.spy();
    const mockProfile = {
      vapContactInfo: {
        email: null,
        mobilePhone: null,
        mailingAddress: null,
      },
    };
    const { props, mockStore } = getData({ mockProfile, savedForms: savedHlr });
    const tree = mount(
      <Provider store={mockStore}>
        <Form0996App
          {...props}
          getContestableIssues={getIssues}
          contestableIssues={{
            issues: [],
            status: '',
            error: '',
            benefitType: 'compensation',
          }}
        />
      </Provider>,
    );

    tree.setProps();
    expect(getIssues.calledOnce).to.be.true;

    tree.unmount();
  });

  it('should set form data', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const setFormData = sinon.spy();
    const { props, mockStore } = getData({ savedForms: savedHlr });
    const contestableIssues = {
      status: 'done', // any truthy value to skip get contestable issues action
      issues: [
        {
          type: 'contestableIssue',
          attributes: {
            ratingIssueSubjectText: 'tinnitus',
            approxDecisionDate: '2020-01-01',
            decisionIssueId: 1,
            ratingIssueReferenceId: '2',
            ratingDecisionReferenceId: '3',
            ratingIssuePercentNumber: '10',
          },
        },
        {
          type: 'contestableIssue',
          attributes: {
            ratingIssueSubjectText: 'Sore foot',
            approxDecisionDate: '2021-01-01',
            decisionIssueId: 2,
            ratingIssueReferenceId: '3',
            ratingDecisionReferenceId: '2',
            ratingIssuePercentNumber: '1',
          },
        },
      ],
    };
    const tree = mount(
      <Provider store={mockStore}>
        <Form0996App
          {...props}
          setFormData={setFormData}
          contestableIssues={contestableIssues}
        />
      </Provider>,
    );

    tree.setProps();
    expect(setFormData.called).to.be.true;

    const formData = setFormData.args[0][0];
    const result = {
      address: profile.vapContactInfo.mailingAddress,
      phone: profile.vapContactInfo.mobilePhone,
      email: profile.vapContactInfo.email.emailAddress,
    };
    expect(formData.veteran).to.deep.equal(result);
    expect(formData.contestedIssues).to.deep.equal([
      contestableIssues.issues[1],
      contestableIssues.issues[0],
    ]);
    // check sorted
    expect(formData.contestedIssues[0].attributes.approxDecisionDate).to.equal(
      '2021-01-01',
    );

    tree.unmount();
  });
  it('should update areaOfDisagreement from selected issues', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const setFormData = sinon.spy();
    const { props, mockStore } = getData({ savedForms: savedHlr });
    const contestableIssues = {
      benefitType: 'compensation',
      status: 'done', // any truthy value to skip get contestable issues action
      issues: [
        {
          type: 'contestableIssue',
          attributes: {
            ratingIssueSubjectText: 'tinnitus',
          },
          [SELECTED]: true,
        },
      ],
    };
    const formData = {
      benefitType: 'compensation',
      contestedIssues: contestableIssues.issues,
      additionalIssues: [{ issue: 'other issue', [SELECTED]: true }],
      veteran: {
        email: profile.vapContactInfo.email.emailAddress,
        phone: profile.vapContactInfo.mobilePhone,
        address: profile.vapContactInfo.mailingAddress,
      },
    };
    const tree = mount(
      <Provider store={mockStore}>
        <Form0996App
          {...props}
          setFormData={setFormData}
          formData={formData}
          contestableIssues={contestableIssues}
        />
      </Provider>,
    );

    tree.setProps();
    expect(setFormData.called).to.be.true;

    const updatedFormData = setFormData.args[0][0];
    expect(updatedFormData.areaOfDisagreement.length).to.eq(2);
    expect(updatedFormData.areaOfDisagreement).to.deep.equal([
      { ...formData.contestedIssues[0], index: 0 },
      { ...formData.additionalIssues[0], index: 1 },
    ]);

    tree.unmount();
  });

  it('should force transform of v1 data', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const setFormData = sinon.spy();
    const { props, mockStore } = getData({ savedForms: savedHlr });
    const contestableIssues = {
      status: 'done', // any truthy value to skip get contestable issues action
      issues: maximalTestV1.data.contestedIssues,
      benefitType: 'compensation',
      legacyCount: 0,
    };
    const tree = mount(
      <Provider store={mockStore}>
        <Form0996App
          {...props}
          formData={maximalTestV1.data}
          setFormData={setFormData}
          contestableIssues={contestableIssues}
        />
      </Provider>,
    );

    tree.setProps();
    expect(setFormData.called).to.be.true;

    const formData = setFormData.args[0][0];
    expect(formData).to.deep.equal(migratedMaximalTestV1);

    tree.unmount();
  });
});
