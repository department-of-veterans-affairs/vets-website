import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import moment from 'moment';

import formConfig from '../../config/form';
import initialData from '../schema/initialData';

import ConfirmationPage from '../../containers/ConfirmationPage';
import { SELECTED, SAVED_CLAIM_TYPE } from '../../constants';
import { WIZARD_STATUS } from 'applications/static-pages/wizard';

const data = {
  user: {
    profile: {
      userFullName: {
        first: 'Foo',
        middle: 'Man',
        last: 'Choo',
      },
    },
  },
  form: {
    formId: formConfig.formId,
    submission: {
      response: Date.now(),
    },
    data: {
      ...initialData,
      contestedIssues: [
        {
          [SELECTED]: true,
          attributes: {
            ratingIssueSubjectText: 'test 543',
          },
        },
        {
          [SELECTED]: false,
          attributes: {
            ratingIssueSubjectText: 'test 987',
          },
        },
      ],
    },
  },
};

describe('Confirmation page', () => {
  const fakeStore = {
    getState: () => data,
    subscribe: () => {},
    dispatch: () => {},
  };

  it('should render the confirmation page', () => {
    const tree = mount(<ConfirmationPage store={fakeStore} />);
    expect(tree).not.to.be.undefined;
    tree.unmount();
  });
  it('should render the user name', () => {
    const tree = mount(<ConfirmationPage store={fakeStore} />);
    expect(tree.text()).to.contain('Foo Man Choo');
    tree.unmount();
  });
  it('should render the submit date', () => {
    const date = moment(data.form.submission.response).format('MMM D, YYYY');
    const tree = mount(<ConfirmationPage store={fakeStore} />);
    expect(tree.text()).to.contain(date);
    tree.unmount();
  });
  it('should render the selected contested issue', () => {
    const tree = mount(<ConfirmationPage store={fakeStore} />);
    const list = tree.find('ul').text();
    expect(list).to.contain('test 543');
    expect(list).not.to.contain('test 987');
    tree.unmount();
  });
  it('should reset the wizard sessionStorage', () => {
    sessionStorage.setItem(WIZARD_STATUS, 'foo');
    sessionStorage.setItem(SAVED_CLAIM_TYPE, 'bar');
    const tree = mount(<ConfirmationPage store={fakeStore} />);
    expect(sessionStorage.getItem(WIZARD_STATUS)).to.be.null;
    expect(sessionStorage.getItem(SAVED_CLAIM_TYPE)).to.be.null;
    tree.unmount();
  });
});
