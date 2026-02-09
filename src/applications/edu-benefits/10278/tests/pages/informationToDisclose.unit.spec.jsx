import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { DISCLOSURE_KEYS } from '../../helpers';

describe('22-10278 information to disclose page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.informationToDiscloseChapter.pages.informationToDisclose;

  const mockStore = configureStore();

  const renderPage = (formData = {}, storeData = {}) => {
    const store = mockStore({ form: { data: storeData } });

    return render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );
  };

  it('renders all checkboxes and descriptions', () => {
    const { container, getByText } = renderPage(
      { claimInformation: {} },
      { claimInformation: {} },
    );

    expect($$('va-checkbox', container).length).to.equal(
      DISCLOSURE_KEYS.length + 1,
    ); // +1 for "Select all"

    expect(container.querySelector('va-checkbox[label="Minor claimants only"]'))
      .to.exist;
    expect(getByText('This is for change of address or direct deposit')).to
      .exist;
    expect(getByText("Third parties can't initiate any changes to your record"))
      .to.exist;
  });

  it('shows the other text input when Other is selected', () => {
    const { container } = renderPage(
      { claimInformation: { other: true } },
      { claimInformation: { other: true } },
    );

    const otherInput = container.querySelector('va-text-input');
    expect(otherInput).to.exist;
    expect(otherInput.getAttribute('label')).to.equal(
      'Specify other information you’d like to disclose',
    );
    expect(otherInput.hasAttribute('required')).to.equal(true);
  });

  it('renders claimant and third party names from redux state', () => {
    const storeData = {
      claimantPersonalInformation: {
        fullName: { first: 'Taras', last: 'Kurilo' },
      },
      discloseInformation: { authorize: 'person' },
      thirdPartyPersonName: {
        fullName: { first: 'Jane', last: 'Doe' },
      },
    };

    const { getByText } = renderPage({ claimInformation: {} }, storeData);

    expect(getByText('Taras Kurilo')).to.exist;
    expect(getByText('Jane Doe')).to.exist;
  });
});
