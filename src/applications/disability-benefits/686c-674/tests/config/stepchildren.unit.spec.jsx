import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

const fillDataWithRtl = ({ container, inputs }) => {
  if (Array.isArray(inputs) && inputs?.length) {
    inputs.forEach(({ target, value }) => {
      const element = container.querySelector(target);
      fireEvent.change(element, { target: { value } });
    });
  } else if (typeof inputs === 'object') {
    Object.entries(inputs).forEach(([inputTarget, inputValue]) => {
      const element = container.querySelector(inputTarget);
      if (!element) {
        throw new Error(
          `Could not find elment ${inputTarget}. Try running screen.debug()`,
        );
      }
      fireEvent.change(element, { target: { value: inputValue } });
    });
  }
};

describe('686 stepchildren', () => {
  const formData = {
    'view:selectable686Options': {
      reportStepchildNotInHousehold: true,
    },
  };

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportStepchildNotInHousehold.pages.stepchildren;

  it('should render', () => {
    const { container } = render(
      <div>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
          definitions={formConfig.defaultDefinitions}
        />
      </div>,
    );

    expect(container.querySelectorAll('input').length).to.equal(5);
    expect(container.querySelectorAll('select').length).to.equal(2);
  });

  it('should not allow you to proceed without required fields filled', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <div>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
          onSubmit={onSubmit}
          definitions={formConfig.defaultDefinitions}
        />
      </div>,
    );
    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
      expect(container.querySelectorAll(`.usa-input-error`).length).to.eql(4);
    });
  });

  it('should should submit with required fields filled out', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <div>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
          onSubmit={onSubmit}
          definitions={formConfig.defaultDefinitions}
        />
      </div>,
    );

    const inputs = {
      'input#root_stepChildren_0_fullName_first': 'Bill',
      'input#root_stepChildren_0_fullName_last': 'Bob',
      'input#root_stepChildren_0_ssn': '123211234',
      'select#root_stepChildren_0_birthDateMonth': 1,
      'select#root_stepChildren_0_birthDateDay': 1,
      'input#root_stepChildren_0_birthDateYear': '2010',
    };

    fillDataWithRtl({ container, inputs });

    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit.called).to.be.true;
      expect(container.querySelectorAll(`.usa-input-error`).length).to.eql(0);
    });
  });
});
