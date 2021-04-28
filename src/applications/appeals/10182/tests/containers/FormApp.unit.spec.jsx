import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { FormApp } from '../../containers/FormApp';

const profile = {
  vapContactInfo: {
    email: {
      emailAddress: 'test@user.com',
    },
    homePhone: {
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

const getData = ({ showNod = true, loggedIn = true } = {}) => ({
  props: {
    loggedIn,
    showNod,
    location: { pathname: '/introduction', search: '' },
    children: <div>children</div>,
    profile,
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
        profile,
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
  it('should render WIP alert', () => {
    const { props } = getData({ showNod: false });
    const tree = shallow(<FormApp {...props} />);
    // FormTitle rendered separately in WIP page
    const title = tree.find('FormTitle');
    expect(title).to.exist;
    expect(title.props().title).to.contain('Board Appeal');
    expect(title.props().subTitle).to.contain('10182');

    const alert = tree.find('AlertBox');
    expect(alert).to.exist;
    expect(alert.props().headline).to.contain('still working on this feature');

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

    expect(tree.find('#form-10182').length).to.equal(1);
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

    expect(tree.find('#form-10182').length).to.equal(1);
    expect(getIssues.notCalled).to.be.true;

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
            approxDecisionDate: '1900-01-01',
            decisionIssueId: 1,
            ratingIssueReferenceId: '2',
            ratingDecisionReferenceId: '3',
            ratingIssuePercentNumber: '10',
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

    expect(tree.find('#form-10182').length).to.equal(1);
    expect(setFormData.called).to.be.true;

    const formData = setFormData.args[0][0];
    const result = {
      address: profile.vapContactInfo.mailingAddress,
      phone: profile.vapContactInfo.homePhone,
      email: profile.vapContactInfo.email.emailAddress,
    };
    expect(formData.veteran).to.deep.equal(result);
    expect(formData.contestableIssues).to.deep.equal(contestableIssues.issues);

    tree.unmount();
  });
});
