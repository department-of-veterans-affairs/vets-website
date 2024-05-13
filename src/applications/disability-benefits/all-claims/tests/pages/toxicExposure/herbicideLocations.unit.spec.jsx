import React from 'react';
import { render } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import formConfig from '../../../config/form';

import {
  herbicidePageTitle,
  herbicideQuestion,
} from '../../../content/toxicExposure';
import { HERBICIDE_LOCATIONS } from '../../../constants';

describe('Herbicide Location', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.herbicideLocations;

  it('should render locations page with all checkboxes', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    getByText(herbicidePageTitle);

    expect($$('va-checkbox-group', container).length).to.equal(1);
    expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
      herbicideQuestion,
    );

    Object.values(HERBICIDE_LOCATIONS).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
  });

  it('should submit without selecting any locations', () => {
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

  it('should submit with locations selected', async () => {
    const onSubmit = sinon.spy();

    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    const checkboxGroup = $('va-checkbox-group', container);
    await checkboxGroup.__events.vaChange({
      target: { checked: true, dataset: { key: 'cambodia' } },
      detail: { checked: true },
    });

    await checkboxGroup.__events.vaChange({
      target: { checked: true, dataset: { key: 'laos' } },
      detail: { checked: true },
    });

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });
});
