import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe.skip('686 upload additional evidence for spouse', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.marriageAdditionalEvidence;

  const formData = {
    'view:selectable686Options': {
      addSpouse: true,
    },
    marriageType: 'TRIBAL',
    spouseEvidenceDocumentType: 'Marriage Certificate / License',
  };
  it('should render', () => {
    const form = shallow(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={{ formData }}
        />
      </Provider>,
    );
    expect(form.find('input').length).to.equal(0);
    form.unmount();
  });

  it('should submit an empty form', () => {
    const onSubmit = sinon.spy();
    const form = shallow(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={{ formData }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit a valid form', () => {
    const onSubmit = sinon.spy();
    const fileData = {
      ...formData,
      ...{
        files: [
          { confirmationCode: 'testing' },
          { confirmationCode: 'testing2' },
        ],
      },
    };
    const form = shallow(
      <Provider store={uploadStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={{ fileData }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
