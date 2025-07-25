import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils';
import { waitFor } from '@testing-library/dom';
import { ERR_MSG_CSS_CLASS } from '../../constants';

import formConfig from '../../config/form';

describe('781a last incident details', () => {
  const page = formConfig.chapters.disabilities.pages.secondaryFinalIncident;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', async () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:selectablePtsdTypes': {
            'view:mstPtsdType': true,
          },
        }}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('textarea').length).to.equal(1);
    form.unmount();
  });

  it('should submit when no data is filled out', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:mstPtsdType': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });

  it('should submit when data filled in', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:mstPtsdType': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fillData(
      form,
      'textarea#root_additionalSecondaryIncidentText',
      'Lorem epsum Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
    );
    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);

      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });
});
