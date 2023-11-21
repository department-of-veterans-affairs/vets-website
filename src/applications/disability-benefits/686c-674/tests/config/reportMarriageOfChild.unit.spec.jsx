import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';
import { fillDataWithRtl } from '../../util';

describe('686 report the marriage of a child', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildMarriage.pages.childInformation;

  const formData = {
    'view:selectable686Options': {
      reportMarriageOfChildUnder18: true,
    },
  };

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(container.querySelectorAll('input').length).to.equal(8);
  });

  it('should not submit an empty form', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );

    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(5);
      expect(onSubmit.called).to.be.false;
    });
  });

  // empty last name
  it('should not submit a form with an incomplete name', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    const inputs = {
      'input#root_childMarriage_fullName_first': 'john',
      'select#root_childMarriage_dateMarriedMonth': 1,
      'select#root_childMarriage_dateMarriedDay': 1,
      'input#root_childMarriage_dateMarriedYear': '2010',
      'input#root_childMarriage_ssn': '123211234',
      'select#root_childMarriage_birthDateMonth': 1,
      'select#root_childMarriage_birthDateDay': 1,
      'input#root_childMarriage_birthDateYear': '2010',
    };

    fillDataWithRtl({
      container,
      inputs,
    });

    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
  });

  // empty date
  it('should not submit a form without a date', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );

    const inputs = {
      'input#root_childMarriage_fullName_first': 'john',
      'input#root_childMarriage_fullName_last': 'doe',
      'input#root_childMarriage_dateMarriedYear': '2010',
      'input#root_childMarriage_ssn': '123211234',
      'select#root_childMarriage_birthDateMonth': 1,
      'select#root_childMarriage_birthDateDay': 1,
      'input#root_childMarriage_birthDateYear': '2010',
    };

    fillDataWithRtl({ container, inputs });
    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit a valid form without a suffix or middle name', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );

    const inputs = {
      'input#root_childMarriage_fullName_first': 'john',
      'input#root_childMarriage_fullName_last': 'doe',
      'select#root_childMarriage_dateMarriedMonth': 1,
      'select#root_childMarriage_dateMarriedDay': 1,
      'input#root_childMarriage_dateMarriedYear': '2010',
      'input#root_childMarriage_ssn': '123211234',
      'select#root_childMarriage_birthDateMonth': 1,
      'select#root_childMarriage_birthDateDay': 1,
      'input#root_childMarriage_birthDateYear': '2010',
    };

    fillDataWithRtl({
      container,
      inputs,
    });

    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });

  it('should submit a valid form with a suffix and middle name', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );

    const inputs = {
      'input#root_childMarriage_fullName_first': 'john',
      'input#root_childMarriage_fullName_middle': 'jeffrey',
      'input#root_childMarriage_fullName_last': 'doe',
      'select#root_childMarriage_dateMarriedMonth': 1,
      'select#root_childMarriage_dateMarriedDay': 1,
      'input#root_childMarriage_dateMarriedYear': '2010',
      'input#root_childMarriage_ssn': '123211234',
      'select#root_childMarriage_birthDateMonth': 1,
      'select#root_childMarriage_birthDateDay': 1,
      'input#root_childMarriage_birthDateYear': '2010',
    };

    fillDataWithRtl({
      container,
      inputs,
    });

    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });
});
