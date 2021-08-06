import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

describe('Confirm Veteran Details', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.infoPages.pages.veteranInformation;

  it('should render Veteran details', () => {
    const tree = shallow(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        setFormData={f => f}
      />,
    );
    expect(tree.find('Connect(VeteranInformation)')).to.exist;
    tree.unmount();
  });
});
