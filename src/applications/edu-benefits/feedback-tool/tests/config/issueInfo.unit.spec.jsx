import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { checkVaCheckbox } from '@department-of-veterans-affairs/platform-testing/helpers';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import formConfig from '../../config/form';

describe('feedback tool issue info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.issueInformation.pages.issueInformation;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('va-checkbox').length).to.equal(12);
    form.unmount();
  });

  it('should not submit without required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with required information', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const checkboxGroup = $('va-checkbox-group', container);
    checkVaCheckbox(checkboxGroup, 'Accreditation');

    fireEvent.change($('textarea#root_issueDescription', container), {
      target: { value: 'test' },
    });
    fireEvent.change($('textarea#root_issueResolution', container), {
      target: { value: 'test' },
    });

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });
});
