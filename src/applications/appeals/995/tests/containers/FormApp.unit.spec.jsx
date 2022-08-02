import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { VA_FORM_IDS } from 'platform/forms/constants';

import { Form0995App } from '../../containers/App';

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

const saved0995 = [
  {
    form: VA_FORM_IDS.FORM_20_0995,
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

describe('Form0995App', () => {
  it('should render', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const tree = mount(
      <Provider store={mockStore}>
        <Form0995App {...props} />
      </Provider>,
    );
    const article = tree.find('#form-0995');
    expect(article).to.exist;
    expect(article.props()['data-location']).to.eq('introduction');
    expect(tree.find('h1').text()).to.eq('Intro');
    expect(tree.find('Connect(RoutedSavableApp)')).to.exist;
    expect(tree.find('va-loading-indicator')).to.have.lengthOf(0);

    tree.unmount();
  });

  it('should show contestable issue loading indicator', () => {
    const { props, mockStore } = getData({ savedForms: saved0995 });
    const getIssues = sinon.spy();
    const tree = mount(
      <Provider store={mockStore}>
        <Form0995App
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
    const { props, mockStore } = getData({ loggedIn: false });
    const getIssues = sinon.spy();
    const tree = mount(
      <Provider store={mockStore}>
        <Form0995App {...props} getContestableIssues={getIssues} />
      </Provider>,
    );

    tree.setProps();
    expect(getIssues.notCalled).to.be.true;

    tree.unmount();
  });

  it('should not throw an error if profile is null', () => {
    const getIssues = sinon.spy();
    const mockProfile = {
      vapContactInfo: {
        email: null,
        mobilePhone: null,
        mailingAddress: null,
      },
    };
    const { props, mockStore } = getData({
      mockProfile,
      savedForms: saved0995,
    });
    const tree = mount(
      <Provider store={mockStore}>
        <Form0995App
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
    const setFormData = sinon.spy();
    const { props, mockStore } = getData({ savedForms: saved0995 });
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
        <Form0995App
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
});
