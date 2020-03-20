import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('686 add child - child additional information', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addChild.pages.addChildAdditionalInformation;

  const formData = {
    'view:selectable686Options': {
      addChild: true,
    },
    childrenToAdd: [
      {
        first: 'Bill',
        last: 'Bob',
        ssn: '370947141',
        birthDate: '1997-04-02',
      },
    ],
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });
});
