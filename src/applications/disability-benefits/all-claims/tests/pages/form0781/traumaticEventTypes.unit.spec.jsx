import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { checkVaCheckbox } from '@department-of-veterans-affairs/platform-testing/helpers';
import formConfig from '../../../config/form';
import eventTypes from '../../../pages/form0781/traumaticEventTypes';
import {
  eventTypesPageTitle,
  eventTypesDescription,
  eventTypesQuestion,
} from '../../../content/traumaticEventTypes';
import { TRAUMATIC_EVENT_TYPES } from '../../../constants';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../../content/form0781';

describe('Traumatic event types', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.mentalHealth.pages.eventTypes;

  it('should define a uiSchema object', () => {
    expect(eventTypes.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(eventTypes.schema).to.be.an('object');
  });

  it('should have the correct title in uiSchema', () => {
    const { container: uiTitleContainer } = render(
      <div>{eventTypes.uiSchema['ui:title']}</div>,
    );
    const renderedUITitleText = uiTitleContainer.textContent.trim();

    const { container: titleWithTagContainer } = render(
      <div>{titleWithTag(eventTypesPageTitle, form0781HeadingTag)}</div>,
    );
    const expectedTitleText = titleWithTagContainer.textContent.trim();

    expect(renderedUITitleText).to.equal(expectedTitleText);
  });

  it('should have the correct description in uiSchema', () => {
    expect(eventTypes.uiSchema['ui:description']).to.equal(
      eventTypesDescription,
    );
  });

  it('should render the mental health support alert description in uiSchema', () => {
    expect(
      eventTypes.uiSchema['view:mentalHealthSupportAlert']['ui:description'],
    ).to.equal(mentalHealthSupportAlert);
  });

  it('should render with all checkboxes', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    getByText(eventTypesPageTitle);

    expect($$('va-checkbox-group', container).length).to.equal(1);
    expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
      eventTypesQuestion,
    );

    // fail fast - verify the correct number of checkboxes are present
    expect($$('va-checkbox', container).length).to.equal(
      Object.keys(TRAUMATIC_EVENT_TYPES).length,
    );

    // verify each checkbox exists with user facing label
    Object.values(TRAUMATIC_EVENT_TYPES).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
  });

  it('should submit without selecting any event types', () => {
    const onSubmit = sinon.spy();

    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit when 1 or more event types are selected', async () => {
    const formData = {};
    const onSubmit = sinon.spy();

    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    const checkboxGroup = $('va-checkbox-group', container);

    checkVaCheckbox(checkboxGroup, 'combat');
    checkVaCheckbox(checkboxGroup, 'nonMst');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });
});
