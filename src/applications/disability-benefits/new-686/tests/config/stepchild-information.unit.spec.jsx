import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { changeDropdown } from '../helpers/index.js';
import {
	DefinitionTester,
	fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('686 stepchild information', () => {

  const formData = {
    'view:selectable686Options': {
      reportStepchildNotInHousehold: true,
    },
    stepChildren: [
      {
        first: 'Bobby',
        last: 'Joe',
      }
    ],
  };

	const {
		schema,
		uiSchema,
  } = formConfig.chapters.reportStepchildNotInHousehold.pages.stepchildInformation;
  
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    expect(form.find('input').length).to.equal(14);	
    expect(form.find('select').length).to.equal(1);	
    form.unmount();
  });
});