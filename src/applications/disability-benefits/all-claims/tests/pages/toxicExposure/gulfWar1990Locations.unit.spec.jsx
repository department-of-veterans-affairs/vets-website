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
import {
  gulfWar1990PageTitle,
  gulfWar1990Question,
  noneAndLocationError,
} from '../../../content/toxicExposure';
import { GULF_WAR_1990_LOCATIONS } from '../../../constants';

describe('Gulf War 1990 Locations', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.gulfWar1990Locations;

  it('should render with all checkboxes', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    getByText(gulfWar1990PageTitle);

    expect($$('va-checkbox-group', container).length).to.equal(1);
    expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
      gulfWar1990Question,
    );

    // fail fast - verify we have the right number of checkboxes
    expect($$('va-checkbox', container).length).to.equal(
      Object.keys(GULF_WAR_1990_LOCATIONS).length,
    );

    // verify that each checkbox exists with user facing label
    Object.values(GULF_WAR_1990_LOCATIONS).forEach(option => {
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
    checkVaCheckbox(checkboxGroup, 'oman');
    checkVaCheckbox(checkboxGroup, 'syria');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should display error when location and "none"', async () => {
    const formData = {};
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );
    const checkboxGroup = $('va-checkbox-group', container);
    checkVaCheckbox(checkboxGroup, 'afghanistan');
    checkVaCheckbox(checkboxGroup, 'none');

    userEvent.click(getByText('Submit'));
    expect($('va-checkbox-group').error).to.equal(noneAndLocationError);
  });

  it('should submit with `none` and `notsure` selected', async () => {
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
    checkVaCheckbox(checkboxGroup, 'none');
    checkVaCheckbox(checkboxGroup, 'notsure');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit with `notsure` and other locations selected', async () => {
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
    checkVaCheckbox(checkboxGroup, 'oman');
    checkVaCheckbox(checkboxGroup, 'syria');
    checkVaCheckbox(checkboxGroup, 'notsure');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });
});
