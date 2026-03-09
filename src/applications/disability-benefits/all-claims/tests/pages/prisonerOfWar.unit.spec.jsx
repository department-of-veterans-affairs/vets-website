import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { ERR_MSG_CSS_CLASS } from '../../constants';

const selectPowStatus = (container, value = 'Y') => {
  const powStatusRadio = $('va-radio', container);

  powStatusRadio.dispatchEvent(
    new CustomEvent('vaValueChange', {
      detail: { value },
      bubbles: true,
      composed: true,
    }),
  );
};

describe('Prisoner of war info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.prisonerOfWar;

  const formData = {
    serviceInformation: {
      servicePeriods: [{ dateRange: { from: '2009-01-01', to: '2013-01-01' } }],
    },
  };

  afterEach(() => {
    cleanup();
  });

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('should render confinement fields', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    selectPowStatus(container, 'Y');

    expect($$('input', container).length).to.equal(2);
    expect($$('select', container).length).to.equal(4);
  });

  it('should fail to submit when no data is filled out', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    await waitFor(() => {
      fireEvent.submit($('form', container));
      expect($('va-radio', container).error).to.not.be.null;
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should add another period', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );
    const formDOM = getFormDOM({ container });

    selectPowStatus(container, 'Y');
    formDOM.fillDate('root_view:isPow_confinements_0_from', '2010-05-05');
    formDOM.fillDate('root_view:isPow_confinements_0_to', '2011-05-05');

    fireEvent.click($('.va-growable-add-btn', container));

    expect($('.va-growable-background', container).textContent).to.contain(
      'May 5, 2010',
    );
  });

  it('should submit when data filled in', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    const formDOM = getFormDOM({ container });

    selectPowStatus(container, 'Y');
    formDOM.fillDate('root_view:isPow_confinements_0_from', '2010-05-05');
    formDOM.fillDate('root_view:isPow_confinements_0_to', '2011-05-05');

    fireEvent.submit($('form', container));
    expect($$(ERR_MSG_CSS_CLASS, container).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should show new disabilities', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...formData,
          newDisabilities: [{ condition: 'ASHD' }, { condition: 'scars' }],
        }}
      />,
    );

    selectPowStatus(container, 'Y');
    expect($$('va-checkbox', container).length).to.equal(2);
    expect($('va-checkbox[label="ASHD"]', container)).to.exist;
    expect($('va-checkbox[label="Scars"]', container)).to.exist;
  });

  it('should not show new disabilities section when none entered', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    selectPowStatus(container, 'Y');
    expect($$('input[type="checkbox"]', container).length).to.equal(0);
    expect(container.textContent).to.not.contain(
      'Which of your conditions is connected to your POW experience? ',
    );
  });

  it('should require confinement dates to be within a single service period', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    const formDOM = getFormDOM({ container });

    selectPowStatus(container, 'Y');
    formDOM.fillDate('root_view:isPow_confinements_0_from', '2010-05-05');
    formDOM.fillDate('root_view:isPow_confinements_0_to', '2014-05-05'); // After service period

    await waitFor(() => {
      fireEvent.submit($('form', container));
      expect($$(ERR_MSG_CSS_CLASS, container).length).to.equal(2);
      expect(onSubmit.called).to.be.false;
    });
  });
});
