import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { VA_FORM_IDS } from 'platform/forms/constants';

import SaveStatus from '../../save-in-progress/SaveStatus';
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
    const { container } = render(<SaveStatus {...props} />);
    expect(container).to.not.be.undefined;
  });
  it('should show last saved date', () => {
    const testProps = {
      ...props,
      form: { ...props.form, autoSavedStatus: SAVE_STATUSES.success },
    };
    const { container } = render(<SaveStatus {...testProps} />);
    expect(container.textContent).to.include('saved your application');
  });
  it('should show saving', () => {
    const testProps = {
      ...props,
      form: { ...props.form, autoSavedStatus: SAVE_STATUSES.pending },
    };
    const { container } = render(<SaveStatus {...testProps} />);
    expect(container.textContent).to.have.string('Saving...');
  });
  it('should not show a status for an unsaved form', () => {
    const testProps = {
      ...props,
      form: {
        ...props.form,
        autoSavedStatus: undefined,
        lastSavedDate: undefined,
      },
    };
    const { container } = render(<SaveStatus {...testProps} />);
    expect(container.textContent).to.not.have.string('saved your application');
    expect(container.textContent).to.not.have.string('Saving...');
  });
  it('should show session expired error', () => {
    const testProps = {
      ...props,
      form: { ...props.form, autoSavedStatus: SAVE_STATUSES.noAuth },
    };
    const { container } = render(<SaveStatus {...testProps} />);
    expect(container.textContent).to.have.string('no longer signed in');
  });
  it('should show client error', () => {
    const testProps = {
      ...props,
      form: { ...props.form, autoSavedStatus: SAVE_STATUSES.clientFailure },
    };
    const { container } = render(<SaveStatus {...testProps} />);
    expect(container.textContent).to.have.string('unable to connect');
  });
  it('should show regular error', () => {
    const testProps = {
      ...props,
      form: { ...props.form, autoSavedStatus: SAVE_STATUSES.failure },
    };
    const { container } = render(<SaveStatus {...testProps} />);
    expect(container.textContent).to.have.string('having some issues');
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
    const { container } = render(
      <SaveStatus {...appSavedSuccessfullyMessageProps} />,
    );
    const successContainer = container.querySelector(
      '.saved-success-container',
    );
    expect(successContainer.textContent).to.include(
      'Custom message saying your app has been saved.',
    );
    expect(successContainer.textContent).to.include('ID number is 98765');
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
    const { container } = render(
      <SaveStatus {...appSavedSuccessfullyMessageProps} />,
    );
    const successContainer = container.querySelector(
      '.saved-success-container',
    );
    const text = successContainer.textContent;
    expect(text).to.include('September 18, 2017, at');
    expect(text).to.include('custom application type ID number is 98765');
  });

  it('should unmask in-progress form ID in DataDog RUM', () => {
    const { container } = render(
      <SaveStatus
        form={{
          formId: VA_FORM_IDS.FORM_10_10EZ,
          lastSavedDate: 1505770055000,
          autoSavedStatus: 'success',
          inProgressFormId: 98765,
        }}
        formConfig={{}}
      />,
    );
    const strongElement = container.querySelector('strong');
    expect(strongElement.getAttribute('data-dd-privacy')).to.equal('allow');
    expect(strongElement.getAttribute('data-dd-action-name')).to.equal(
      'in-progress-form-id',
    );
  });
});
