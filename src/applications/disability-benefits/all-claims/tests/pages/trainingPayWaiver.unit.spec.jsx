import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('trainingPayWaiver', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.additionalInformation.pages.trainingPayWaiver;
  const { defaultDefinitions } = formConfig;

  it('should render with va-radio component', () => {
    const { container } = render(
      <DefinitionTester
        definitions={defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
      />,
    );

    expect(container.querySelector('va-radio')).to.exist;
    expect(container.querySelectorAll('va-radio-option').length).to.equal(2);
  });

  it('should not submit when user does not make a selection', async () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        definitions={defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(getByText(/submit/i));

    await waitFor(() => {
      expect($('va-radio', container).error).to.not.be.null;
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit when user makes a selection', async () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        definitions={defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        onSubmit={onSubmit}
        data={{
          waiveTrainingPay: true,
        }}
        formData={{
          waiveTrainingPay: true,
        }}
      />,
    );

    fireEvent.click(getByText(/submit/i));

    await waitFor(() => {
      expect($('va-radio', container).error).to.be.null;
      expect(onSubmit.calledOnce).to.be.true;
    });
  });
});
