/* eslint-disable camelcase */
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../../config/form';
import { simulateInputChange } from '../../../helpers';

describe('hca Toxic Exposure config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.toxicExposure;
  const { defaultDefinitions: definitions } = formConfig;
  const subject = () => {
    const onSubmitSpy = sinon.spy();
    const mockStore = {
      getState: () => ({
        featureToggles: {
          hcaTeraBranchingEnabled: true,
          hca_tera_branching_enabled: true,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmitSpy}
          uiSchema={uiSchema}
        />
      </Provider>,
    );
    const selectors = () => ({
      submitBtn: container.querySelector('button[type="submit"]'),
      inputs: container.querySelectorAll('input'),
      errors: container.querySelectorAll('.usa-input-error'),
    });
    return { container, selectors, onSubmitSpy };
  };

  it('should render', () => {
    const { selectors } = subject();
    expect(selectors().inputs.length).to.equal(2);
  });

  it('should not submit empty form', async () => {
    const { selectors, onSubmitSpy } = subject();
    await waitFor(() => {
      const { errors, submitBtn } = selectors();
      fireEvent.click(submitBtn);
      expect(errors.length).to.equal(1);
      expect(onSubmitSpy.called).to.be.false;
    });
  });

  it('should submit with valid data', async () => {
    const { container, selectors, onSubmitSpy } = subject();
    await waitFor(() => {
      const { errors, submitBtn } = selectors();
      simulateInputChange(container, '#root_hasTeraResponseYes', 'Y');
      fireEvent.click(submitBtn);
      expect(errors.length).to.equal(0);
      expect(onSubmitSpy.called).to.be.true;
    });
  });
});
