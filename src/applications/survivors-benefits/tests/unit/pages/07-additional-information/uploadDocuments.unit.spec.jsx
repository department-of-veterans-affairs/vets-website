import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import uploadDocuments from '../../../../config/chapters/07-additional-information/uploadDocuments';

export const getData = ({ loggedIn = true } = {}) => ({
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('Upload documents page', () => {
  const { schema, uiSchema } = uploadDocuments;
  it('renders the upload documents page', async () => {
    const screen = render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />
      </Provider>,
    );
    const formDOM = getFormDOM(screen);

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Submit your supporting documents',
      }),
    ).to.exist;
    const fileInput = $('va-file-input-multiple[name="root_files"]', formDOM);
    expect(fileInput.getAttribute('hint')).to.equal(
      'You can upload a .pdf, .jpg, or .jpeg file. Your file should be no larger than 50 MB (non-PDF) or 99 MB (PDF only).',
    );
  });
});
