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
import formConfig from '../../../config/form';
import {
  gulfWar2001PageTitle,
  gulfWar2001Question,
} from '../../../content/toxicExposure';
import { GULF_WAR_2001_LOCATIONS } from '../../../constants';

describe('Gulf War 2001 Locations', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.gulfWar2001Locations;

  it('should render with all checkboxes', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    getByText(gulfWar2001PageTitle);

    expect($$('va-checkbox-group', container).length).to.equal(1);
    expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
      gulfWar2001Question,
    );

    // fail fast - verify we have the right number of checkboxes
    expect($$('va-checkbox', container).length).to.equal(
      Object.keys(GULF_WAR_2001_LOCATIONS).length,
    );

    // verify that each checkbox exists with user facing label
    Object.values(GULF_WAR_2001_LOCATIONS).forEach(option => {
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
      target: { checked: true, dataset: { key: 'yemen' } },
      detail: { checked: true },
    });

    await checkboxGroup.__events.vaChange({
      target: { checked: true, dataset: { key: 'airspace' } },
      detail: { checked: true },
    });

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });
});
