import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';
import { SHOW_REVISED_ADD_DISABILITIES_PAGE } from '../../constants';

import { showRevisedNewDisabilitiesPage } from '../../content/addDisabilities';

describe('showRevisedNewDisabilitiesPage', () => {
  it('should return false if the toggle is not enabled', () => {
    const formData = {};
    expect(showRevisedNewDisabilitiesPage(formData)).to.be.false;
  });

  it('should show new combobox container', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.disabilities.pages.addDisabilitiesRevised;
    const onSubmit = sinon.spy();
    const screen = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:claimType': {
            'view:claimingNew': true,
            'view:claimingIncrease': true,
          },
          newDisabilities: ['test condition'],
          // no rated disability selected
          ratedDisabilities: [{}, {}],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    const labelStr = 'What new condition do you want to claim?';
    expect(screen.getByText(labelStr)).to.exist;
  });

  it('should submit when form is completed', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.disabilities.pages.addDisabilitiesRevised;
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          newDisabilities: [
            {
              condition: 'Test',
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  describe('toggle enabled', () => {
    beforeEach(() => {
      window.sessionStorage.setItem(SHOW_REVISED_ADD_DISABILITIES_PAGE, true);
    });

    afterEach(() => {
      window.sessionStorage.removeItem(SHOW_REVISED_ADD_DISABILITIES_PAGE);
    });

    it('should return true if the toggle is enabled', () => {
      const formData = {};
      expect(showRevisedNewDisabilitiesPage(formData)).to.be.true;
    });
  });
});
