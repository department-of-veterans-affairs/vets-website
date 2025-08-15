import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import supportingDocuments from '../../pages/supportingDocuments';

describe('Medallions supportingDocuments page', () => {
  it('renders the supporting documents info', () => {
    const form = mount(
      <DefinitionTester
        schema={supportingDocuments.schema}
        uiSchema={supportingDocuments.uiSchema}
        data={{}}
      />,
    );
    expect(form.text()).to.include(
      'On the next screen, we’ll ask you to submit supporting documents',
    );
    expect(form.text()).to.include('The Veteran’s separation papers (DD214)');
    form.unmount();
  });
});
