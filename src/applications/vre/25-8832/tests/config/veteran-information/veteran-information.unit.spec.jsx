import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../../config/form';

describe('Chapter 36 Veteran Information', () => {
  const {
    schema,
    uiSchema,
    depends,
  } = formConfig.chapters.veteranInformation.pages.veteranInformation;

  const formData = {
    status: 'isSpouse',
  };
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });

  it('should return true if dependent', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(depends(formData)).to.be.true;
    form.unmount();
  });

  it('should not submit without required fields', async () => {
    const onSubmit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const errorElements = container.querySelectorAll('.usa-input-error');
      expect(errorElements.length).to.equal(3);
    });

    expect(onSubmit.called).to.be.false;
  });

  it('should submit with required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    fillData(form, 'input#root_veteranInformation_fullName_first', 'Johnny');
    fillData(form, 'input#root_veteranInformation_fullName_last', 'Appleseed');
    fillData(form, 'input#root_veteranInformation_ssn', '370947141');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
