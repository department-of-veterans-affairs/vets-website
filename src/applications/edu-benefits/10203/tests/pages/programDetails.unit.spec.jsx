import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Program Details', () => {
  let sandbox;
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.programDetails.pages.programDetails;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    expect(form.find('input').length).to.equal(5);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should successfully submit', () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{
          degreeName: 'Test Degree',
          schoolName: 'Test School',
          schoolCity: 'Test',
          schoolState: 'MA',
          schoolCountry: 'USA',
        }}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should require degreeName', async () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{
          schoolName: 'Test School',
          schoolCity: 'Test',
          schoolState: 'MA',
          schoolCountry: 'USA',
        }}
      />,
    );
    form.find('form').simulate('submit');

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });

  it('should require schoolName', async () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{
          degreeName: 'Test Degree',
          schoolCity: 'Test',
          schoolState: 'MA',
          schoolCountry: 'USA',
        }}
      />,
    );
    form.find('form').simulate('submit');

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });

  it('should require schoolCity', async () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{
          degreeName: 'Test Degree',
          schoolName: 'Test School',
          schoolState: 'MA',
          schoolCountry: 'USA',
        }}
      />,
    );
    form.find('form').simulate('submit');

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });

  it('should require schoolState for USA', async () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{
          schoolCity: 'Test',
          degreeName: 'Test Degree',
          schoolName: 'Test School',
          schoolCountry: 'USA',
        }}
      />,
    );
    form.find('form').simulate('submit');

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });

  it('should require schoolState for CAN', async () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{
          schoolCity: 'Test',
          degreeName: 'Test Degree',
          schoolName: 'Test School',
          schoolCountry: 'CAN',
        }}
      />,
    );
    form.find('form').simulate('submit');

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });

  it('should require schoolState for MEX', async () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{
          schoolCity: 'Test',
          degreeName: 'Test Degree',
          schoolName: 'Test School',
          schoolCountry: 'MEX',
        }}
      />,
    );
    form.find('form').simulate('submit');

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });

  it('should not require schoolState for countries other than USA, CAN, and MEX', () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{
          schoolCity: 'Test',
          degreeName: 'Test Degree',
          schoolName: 'Test School',
          schoolCountry: 'AFG',
        }}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should require schoolCountry', async () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{
          degreeName: 'Test Degree',
          schoolName: 'Test School',
          schoolCity: 'Test',
          schoolState: 'MA',
          schoolCountry: '',
        }}
      />,
    );
    form.find('form').simulate('submit');

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });
});
