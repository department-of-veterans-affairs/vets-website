import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import {
	DefinitionTester,
	fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('686 stepchildren', () => {

	const formData = {
    'view:selectable686Options': {
      reportStepchildNotInHousehold: true,
    },
  };

	const {
		schema,
		uiSchema,
	} = formConfig.chapters.reportStepchildNotInHousehold.pages.stepchildren;

	it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
      />,
    );
		expect(form.find('input').length).to.equal(3);
		expect(form.find('select').length).to.equal(1);
    form.unmount();
	});
	
	it('should not allow you to proceed without required fields filled', () => {
		const onSubmit = sinon.spy();
		it('should render', () => {
			const form = mount(
				<DefinitionTester
					schema={schema}
					uiSchema={uiSchema}
					data={formData}
					onSubmit={onSubmit}
					definitions={formConfig.defaultDefinitions}
				/>,
			);
			form.find('form').simulate('submit');
    	expect(form.find('.usa-input-error').length).to.equal(3);
			form.unmount();
		});
	});
});

