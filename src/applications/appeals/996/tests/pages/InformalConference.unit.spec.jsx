import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import informalConference from '../../pages/informalConference';

import { mockStore } from '../../../shared/tests/test-helpers';

const { schema, uiSchema } = informalConference;

describe('Higher-Level Review 0996 informal conference', () => {
  it('should render informal conference form', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          formData={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect($$('va-radio-option', container).length).to.equal(3);
  });

  /* Successful submits */
  it('successfully submits when "no" informal conference is selected', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          schema={schema}
          data={{ informalConference: 'no' }}
          formData={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));
    expect($$('[error]', container).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  /* Unsuccessful submits */
  it('prevents submit when informal conference is not selected', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          schema={schema}
          data={{}}
          formData={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));
    expect($$('[error]', container).length).to.equal(1);
    expect(onSubmit.called).not.to.be.true;
  });
});
