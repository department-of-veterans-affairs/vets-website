import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { FormApp } from '../../containers/FormApp';
import { SELECTED } from '../../constants';

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

const getData = ({
  showNod = true,
  isLoading = false,
  loggedIn = true,
  mockProfile = profile,
} = {}) => ({
  props: {
    isLoading,
    loggedIn,
    showNod,
    location: { pathname: '/introduction', search: '' },
    children: <div>children</div>,
    profile: mockProfile,
    formData: {},
    setFormData: () => {},
    getContestableIssues: () => {},
  },
  mockStore: {
    getState: () => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        form10182_nod: showNod,
      },
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: mockProfile,
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

describe('FormApp', () => {
  it('should render', () => {
    const { props } = getData();
    const tree = shallow(<FormApp {...props} />);
    const article = tree.find('#form-10182');
    expect(article).to.exist;
    expect(article.props()['data-location']).to.eq('introduction');

    // FormTitle rendered in children
    expect(tree.find('FormTitle')).to.have.lengthOf(0);

    expect(tree.find('Connect(RoutedSavableApp)')).to.exist;

    tree.unmount();
  });
  it('should render loading indicator', () => {
    const { props } = getData({ isLoading: true });
    const tree = shallow(<FormApp {...props} />);
    const loading = tree.find('va-loading-indicator');
    expect(loading).to.exist;
    tree.unmount();
  });
  it('should render WIP alert', () => {
    const { props } = getData({ showNod: false });
    const tree = shallow(<FormApp {...props} />);

    tree.setProps();
    // FormTitle rendered separately in WIP page
    const title = tree.find('FormTitle');
    expect(title).to.exist;
    expect(title.props().title).to.contain('Board Appeal');
    expect(title.props().subTitle).to.contain('10182');

    const alert = tree.find('va-alert');
    expect(alert.text()).to.contain('still working on this feature');

    tree.unmount();
  });

  it('should call API if logged in', async () => {
    const getIssues = sinon.spy();
    const { props, mockStore } = getData();
    const tree = mount(
      <Provider store={mockStore}>
        <FormApp {...props} getContestableIssues={getIssues} />,
      </Provider>,
    );

    tree.setProps();
    expect(getIssues.called).to.be.true;

    tree.unmount();
  });
  it('should not call API if not logged in', () => {
    const getIssues = sinon.spy();
    const { props, mockStore } = getData({ loggedIn: false });
    const tree = mount(
      <Provider store={mockStore}>
        <FormApp {...props} getContestableIssues={getIssues} />,
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
    const { props, mockStore } = getData({ mockProfile });
    const tree = mount(
      <Provider store={mockStore}>
        <FormApp {...props} getContestableIssues={getIssues} />,
      </Provider>,
    );

    tree.setProps();
    expect(getIssues.called).to.be.true;

    tree.unmount();
  });

  it('should set form data', () => {
    const setFormData = sinon.spy();
    const { props, mockStore } = getData();
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
        <FormApp
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
    expect(formData.contestableIssues).to.deep.equal([
      contestableIssues.issues[1],
      contestableIssues.issues[0],
    ]);
    // check sorted
    expect(
      formData.contestableIssues[0].attributes.approxDecisionDate,
    ).to.equal('2021-01-01');

    tree.unmount();
  });

  it('should update areaOfDisagreement from selected issues', () => {
    const setFormData = sinon.spy();
    const { props, mockStore } = getData();
    const contestableIssues = {
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
      contestableIssues: contestableIssues.issues,
      additionalIssues: [{ issue: 'other issue', [SELECTED]: true }],
      veteran: {
        email: profile.vapContactInfo.email.emailAddress,
        phone: profile.vapContactInfo.mobilePhone,
        address: profile.vapContactInfo.mailingAddress,
      },
    };
    const tree = mount(
      <Provider store={mockStore}>
        <FormApp
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
      { ...formData.contestableIssues[0], index: 0 },
      { ...formData.additionalIssues[0], index: 1 },
    ]);

    tree.unmount();
  });
});
