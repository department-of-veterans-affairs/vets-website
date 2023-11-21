import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor, fireEvent } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';
import { fillDataWithRtl } from '../../util';

describe('686 report dependent death', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.deceasedDependents.pages.dependentInformation;

  const formData = {
    'view:selectable686Options': { reportDeath: true },
  };

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={formData}
      />,
    );
    expect(container.querySelectorAll('input').length).to.eql(8);
    expect(container.querySelectorAll('select').length).to.eql(2);
  });

  it('should not submit an empty form', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={formData}
      />,
    );

    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.eql(5);
      expect(onSubmit.called).to.be.false;
    });
  });

  [
    {
      dependentType: 'SPOUSE',
      target: '#root_deaths_0_dependentType_0',
      expectedInputs: 8,
    },
    {
      dependentType: 'DEPENDENT_PARENT',
      target: '#root_deaths_0_dependentType_1',
      expectedInputs: 8,
    },
    {
      dependentType: 'CHILD',
      target: '#root_deaths_0_dependentType_2',
      expectedInputs: 13,
    },
  ].forEach(({ target, expectedInputs, dependentType }) => {
    it(`select ${dependentType} as dependentType`, async () => {
      const { container } = render(
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />,
      );

      fillDataWithRtl({
        container,
        inputs: target,
        useUserEvent: true,
      });

      await waitFor(() => {
        expect(container.querySelectorAll('input').length).to.equal(
          expectedInputs,
        );
      });
    });
  });

  it('should submit a valid form with a dependent spouse', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={formData}
      />,
    );

    // change dependent type: SPOUSE
    fillDataWithRtl({
      container,
      inputs: '#root_deaths_0_dependentType_0',
      useUserEvent: true,
    });
    const inputs = {
      'input#root_deaths_0_fullName_first': 'Billy',
      'input#root_deaths_0_fullName_last': 'Bob',
      'input#root_deaths_0_ssn': '123211234',
      'select#root_deaths_0_birthDateMonth': 1,
      'select#root_deaths_0_birthDateDay': 1,
      'input#root_deaths_0_birthDateYear': '2010',
    };

    fillDataWithRtl({ container, inputs });

    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });

  it('should submit a valid form with a dependent child', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={formData}
      />,
    );

    fillDataWithRtl({
      container, // select dependent type: CHILD
      inputs: '#root_deaths_0_dependentType_2',
      useUserEvent: true,
    });
    fillDataWithRtl({
      container, // checkbox child status: child under 18
      inputs: '#root_deaths_0_childStatus_childUnder18',
      useUserEvent: true,
    });
    const inputs = {
      'input#root_deaths_0_fullName_first': 'Billy',
      'input#root_deaths_0_fullName_last': 'Bob',
      'input#root_deaths_0_ssn': '123211234',
      'select#root_deaths_0_birthDateMonth': 1,
      'select#root_deaths_0_birthDateDay': 1,
      'input#root_deaths_0_birthDateYear': '2010',
    };

    fillDataWithRtl({ container, inputs });

    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });

  it('should not submit when child is selected without any subtypes', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    // dependent type CHILD
    fillDataWithRtl({
      container, // select dependent type: CHILD
      inputs: '#root_deaths_0_dependentType_2',
      useUserEvent: true,
    });

    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(5);
      expect(onSubmit.called).to.be.false;
    });
  });
});
