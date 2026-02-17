import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const getProps = () => {
  return {
    mockStore: {
      getState: () => ({
        form: { data: {} },
      }),
      subscribe: () => {},
      dispatch: () => ({
        setFormData: () => {},
      }),
    },
  };
};

describe('form config options', () => {
  it('should scroll and show text correctly', async () => {
    const { mockStore } = getProps();
    const { schema, uiSchema, scrollAndFocusTarget } =
      formConfig.chapters.statementInfoChapter.pages.claimOwnershipPage;

    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    scrollAndFocusTarget();

    await waitFor(() => {
      expect(
        container.querySelector(
          'va-radio[label="Are you submitting this statement to support your claim or someone else’s claim?"]',
        ),
      ).to.exist;
    });
  });

  it('should show titles correctly conditionally claimantPersonalInfoChapter', () => {
    const { title } = formConfig.chapters.claimantPersonalInfoChapter;

    let titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Your personal information');

    titleText = title({
      formData: { claimOwnership: 'third-party', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Claimant’s personal information');
  });

  it('should show titles correctly conditionally claimantIdInfoChapter', () => {
    const { title } = formConfig.chapters.claimantIdInfoChapter;

    let titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Your identification information');

    titleText = title({
      formData: { claimOwnership: 'third-party', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Claimant’s identification information');
  });

  it('should show titles correctly conditionally claimantAddrInfoChapter', () => {
    const { title } = formConfig.chapters.claimantAddrInfoChapter;

    let titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Your mailing address');

    titleText = title({
      formData: { claimOwnership: 'third-party', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Claimant’s mailing address');
  });

  it('should show titles correctly conditionally claimantContactInfoChapter', () => {
    const { title } = formConfig.chapters.claimantContactInfoChapter;

    let titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Your contact information');

    titleText = title({
      formData: { claimOwnership: 'third-party', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Claimant’s contact information');
  });

  it('should show titles correctly conditionally veteranPersonalInfoChapter', () => {
    const { title } = formConfig.chapters.veteranPersonalInfoChapter;

    let titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'veteran' },
    });
    expect(titleText).to.equal('Your personal information');

    titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Veteran’s personal information');
  });

  it('should show titles correctly conditionally veteranIdentificationInfo', () => {
    const { title } = formConfig.chapters.veteranIdentificationInfo;

    let titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'veteran' },
    });
    expect(titleText).to.equal('Your identification information');

    titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Veteran’s identification information');
  });

  it('should show titles correctly conditionally veteranMailingAddressInfo', () => {
    const { title } = formConfig.chapters.veteranMailingAddressInfo;

    let titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'veteran' },
    });
    expect(titleText).to.equal('Your mailing address');

    titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Veteran’s mailing address');
  });

  it('should show titles correctly conditionally veteranContactInfo', () => {
    const { title } = formConfig.chapters.veteranContactInfo;

    let titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'veteran' },
    });
    expect(titleText).to.equal('Your contact information');

    titleText = title({
      formData: { claimOwnership: 'self', claimantType: 'non-veteran' },
    });
    expect(titleText).to.equal('Veteran’s contact information');
  });
});
