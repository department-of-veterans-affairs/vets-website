import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addChild: true,
  },
  childrenToAdd: [{}],
};
describe('686 add child child address part one', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildChildAddressPartOne;

  it('should render', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    const formDOM = getFormDOM(form);
    expect(formDOM.querySelectorAll('va-text-input').length).to.eq(6);
  });

  it('should render custom city error', async () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            'view:selectable686Options': { addChild: true },
            childrenToAdd: [
              {
                doesChildLiveWithYou: false,
                address: { city: 'APO', isMilitary: false },
              },
            ],
          }}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    const form = container?.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const cityInput = container.querySelector(
        'va-text-input[name*="_address_city"]',
      );
      expect(cityInput).to.exist;
      expect(cityInput.getAttribute('error')).to.equal(
        'Enter a valid city name',
      );
    });
  });
});
