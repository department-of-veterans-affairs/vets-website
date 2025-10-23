import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { VA_FORM_IDS } from 'platform/forms/constants';

import SaveStatus from '../../save-in-progress/SaveStatus.jsx';
import { SAVE_STATUSES } from '../../save-in-progress/actions';

describe('<SaveStatus>', () => {
  const props = {
    form: {
      formId: VA_FORM_IDS.FORM_10_10EZ,
      lastSavedDate: 1505770055000,
    },
    user: {
      login: {
        currentlyLoggedIn: true,
      },
    },
    formConfig: {},
  };
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<SaveStatus {...props} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
  it('should show last saved date', () => {
    props.form.autoSavedStatus = SAVE_STATUSES.success;
    const tree = SkinDeep.shallowRender(<SaveStatus {...props} />);
    expect(tree.text()).to.include('We’ve saved your application.');
  });
  it('should show saving', () => {
    props.form.autoSavedStatus = SAVE_STATUSES.pending;
    const tree = SkinDeep.shallowRender(<SaveStatus {...props} />);
    expect(tree.text()).to.have.string('Saving...');
  });
  it('should not show a status for an unsaved form', () => {
    props.form.autoSavedStatus = undefined;
    props.form.lastSavedDate = undefined;
    const tree = SkinDeep.shallowRender(<SaveStatus {...props} />);
    expect(tree.text()).to.not.have.string('We’ve saved your application.');
    expect(tree.text()).to.not.have.string('Saving...');
  });
  it('should show session expired error', () => {
    props.form.autoSavedStatus = SAVE_STATUSES.noAuth;
    const tree = SkinDeep.shallowRender(<SaveStatus {...props} />);
    expect(tree.text()).to.have.string('no longer signed in');
  });
  it('should show client error', () => {
    props.form.autoSavedStatus = SAVE_STATUSES.clientFailure;
    const tree = SkinDeep.shallowRender(<SaveStatus {...props} />);
    expect(tree.text()).to.have.string('unable to connect');
  });
  it('should show regular error', () => {
    props.form.autoSavedStatus = SAVE_STATUSES.failure;
    const tree = SkinDeep.shallowRender(<SaveStatus {...props} />);
    expect(tree.text()).to.have.string('having some issues');
  });
  it('should display the appSavedSuccessfullyMessage & SiP ID', () => {
    const appSavedSuccessfullyMessageProps = {
      ...props,
      form: {
        formId: VA_FORM_IDS.FORM_10_10EZ,
        lastSavedDate: 1505770055000,
        autoSavedStatus: 'success',
        inProgressFormId: 98765,
      },
      formConfig: {
        customText: {
          appSavedSuccessfullyMessage:
            'Custom message saying your app has been saved.',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <SaveStatus {...appSavedSuccessfullyMessageProps} />,
    );
    expect(tree.subTree('.saved-success-container').text()).to.include(
      'Custom message saying your app has been saved.',
    );
    expect(tree.subTree('.saved-success-container').text()).to.include(
      'ID number is 98765',
    );
  });
  it('should display the appSavedSuccessfullyMessage with custom app type & SiP ID', () => {
    const appSavedSuccessfullyMessageProps = {
      ...props,
      form: {
        formId: VA_FORM_IDS.FORM_10_10EZ,
        lastSavedDate: 1505770055000,
        autoSavedStatus: 'success',
        loadedData: {
          metadata: {
            inProgressFormId: 98765,
          },
        },
      },
      formConfig: {
        customText: {
          appType: 'custom application type',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <SaveStatus {...appSavedSuccessfullyMessageProps} />,
    );
    const text = tree.subTree('.saved-success-container').text();
    expect(text).to.include('September 18, 2017, at');
    expect(text).to.include('custom application type ID number is 98765');
  });
});
