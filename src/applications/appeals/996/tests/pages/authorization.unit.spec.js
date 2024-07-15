import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

const mockStore = () => ({
  getState: () => ({
    form: { data: { hlrUpdatedContent: true } },
    featureToggles: {
      // eslint-disable-next-line camelcase
      hlr_updateed_contnet: true,
      hlrUpdateedContnet: true,
    },
  }),
  subscribe: () => {},
  dispatch: () => ({
    setFormData: () => {},
    getContestableIssues: () => {},
  }),
});

describe('HLR opt-in page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.conditions.pages.authorization;

  it('should not render a checkbox when toggle is enabled', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );
    expect($$('va-checkbox', container).length).to.equal(0);
  });

  it('should allow submit when toggle is enabled', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    fireEvent.submit($('form', container));
    expect(onSubmit.called).to.be.true;
  });
});
