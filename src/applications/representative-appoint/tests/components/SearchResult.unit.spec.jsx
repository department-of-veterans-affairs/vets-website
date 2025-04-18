import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { SearchResult } from '../../components/SearchResult';
import * as useV2FeatureToggle from '../../hooks/useV2FeatureVisibility';

describe('SearchResult Component', () => {
  let useV2FeatureVisibilityStub;

  afterEach(() => {
    useV2FeatureVisibilityStub.restore();
  });

  it('evaluates addressExists correctly', () => {
    const representative = {
      data: {
        attributes: {
          addressLine1: '123 Main St',
          city: '',
          stateCode: '',
          zipCode: '',
        },
      },
    };

    useV2FeatureVisibilityStub = sinon
      .stub(useV2FeatureToggle, 'default')
      .returns(false);

    const { container } = render(
      <SearchResult
        representative={representative}
        query={{}}
        handleSelectRepresentative={() => {}}
        loadingPOA={false}
      />,
    );

    const addressAnchor = container.querySelector('.address-anchor');
    expect(addressAnchor).to.exist;
    expect(addressAnchor.textContent).to.contain('123 Main St');
  });

  it('evaluates addressExists correctly when only city, stateCode, and zipCode exist', () => {
    const representative = {
      data: {
        attributes: {
          city: 'Anytown',
          stateCode: 'CT',
          zipCode: '43456',
        },
      },
    };

    useV2FeatureVisibilityStub = sinon
      .stub(useV2FeatureToggle, 'default')
      .returns(false);

    const { container } = render(
      <SearchResult
        representative={representative}
        query={{}}
        handleSelectRepresentative={() => {}}
        loadingPOA={false}
      />,
    );

    const addressAnchor = container.querySelector('.address-anchor');
    expect(addressAnchor).to.exist;
    expect(addressAnchor.textContent).to.contain('Anytown, CT');
  });

  it('includes the representative name in the select button text', () => {
    const representative = {
      data: {
        id: 1,
        attributes: {
          addressLine1: '123 Main St',
          city: '',
          stateCode: '',
          zipCode: '',
          fullName: 'Robert Smith',
        },
      },
    };

    useV2FeatureVisibilityStub = sinon
      .stub(useV2FeatureToggle, 'default')
      .returns(false);

    const { container } = render(
      <SearchResult
        representative={representative}
        query={{}}
        handleSelectRepresentative={() => {}}
        loadingPOA={false}
      />,
    );

    const selectButton = container.querySelector(
      '[data-testid="rep-select-1"]',
    );
    expect(selectButton).to.exist;
    expect(selectButton.getAttribute('text')).to.contain('Robert Smith');
  });

  context('when v2 is enabled', () => {
    let formData;

    beforeEach(() => {
      formData = {
        'view:v2IsEnabled': true,
        userIsDigitalSubmitEligible: true,
      };
    });

    context('when the user is userIsDigitalSubmitEligible', () => {
      context('when the representative accepts digital submission', () => {
        it('displays digital submission methods', () => {
          formData.representative = {
            data: {
              id: 1,
              type: 'individual',
              attributes: {
                addressLine1: '123 Main St',
                city: '',
                stateCode: '',
                zipCode: '',
                fullName: 'Robert Smith',
                individualType: 'representative',
                accreditedOrganizations: {
                  data: [{ attributes: { canAcceptDigitalPoaRequests: true } }],
                },
              },
            },
          };

          const { container } = render(
            <SearchResult
              representative={formData.representative}
              query={{}}
              handleSelectRepresentative={() => {}}
              loadingPOA={false}
              userIsDigitalSubmitEligible={
                formData?.userIsDigitalSubmitEligible &&
                formData?.['view:v2IsEnabled']
              }
            />,
          );

          const digitalSubmissionMethods = container.querySelector(
            '[data-testid="submission-methods-with-digital"]',
          );

          const nonDigitalSubmissionMethods = container.querySelector(
            '[data-testid="submission-methods-without-digital"]',
          );

          expect(digitalSubmissionMethods).to.exist;
          expect(nonDigitalSubmissionMethods).not.to.exist;
        });
      });

      context(
        'when the representative does not accept digital submission',
        () => {
          it('displays non digital submission methods', () => {
            formData.representative = {
              data: {
                id: 1,
                type: 'individual',
                attributes: {
                  addressLine1: '123 Main St',
                  city: '',
                  stateCode: '',
                  zipCode: '',
                  fullName: 'Robert Smith',
                  individualType: 'representative',
                  accreditedOrganizations: {
                    data: [
                      { attributes: { canAcceptDigitalPoaRequests: false } },
                    ],
                  },
                },
              },
            };

            const { container } = render(
              <SearchResult
                representative={formData.representative}
                query={{}}
                handleSelectRepresentative={() => {}}
                loadingPOA={false}
                userIsDigitalSubmitEligible={
                  formData?.userIsDigitalSubmitEligible &&
                  formData?.['view:v2IsEnabled']
                }
              />,
            );

            const digitalSubmissionMethods = container.querySelector(
              '[data-testid="submission-methods-with-digital"]',
            );

            const nonDigitalSubmissionMethods = container.querySelector(
              '[data-testid="submission-methods-without-digital"]',
            );

            expect(digitalSubmissionMethods).not.to.exist;
            expect(nonDigitalSubmissionMethods).to.exist;
          });
        },
      );
    });

    context('when the user is not userIsDigitalSubmitEligible', () => {
      beforeEach(() => {
        formData.userIsDigitalSubmitEligible = false;
      });

      it('does not display submission methods', () => {
        const representative = {
          data: {
            id: 1,
            type: 'individual',
            attributes: {
              addressLine1: '123 Main St',
              city: '',
              stateCode: '',
              zipCode: '',
              fullName: 'Robert Smith',
              individualType: 'representative',
            },
          },
        };

        const { container } = render(
          <SearchResult
            representative={representative}
            query={{}}
            handleSelectRepresentative={() => {}}
            loadingPOA={false}
            userIsDigitalSubmitEligible={
              formData?.userIsDigitalSubmitEligible &&
              formData?.['view:v2IsEnabled']
            }
          />,
        );

        const digitalSubmissionMethods = container.querySelector(
          '[data-testid="submission-methods-with-digital"]',
        );

        const nonDigitalSubmissionMethods = container.querySelector(
          '[data-testid="submission-methods-without-digital"]',
        );

        expect(digitalSubmissionMethods).not.to.exist;
        expect(nonDigitalSubmissionMethods).not.to.exist;
      });
    });
  });

  context('when v2 is not enabled', () => {
    const formData = {
      'view:v2IsEnabled': false,
    };

    it('does not display submission methods', () => {
      formData.representative = {
        data: {
          id: 1,
          type: 'individual',
          attributes: {
            addressLine1: '123 Main St',
            city: '',
            stateCode: '',
            zipCode: '',
            fullName: 'Robert Smith',
            individualType: 'representative',
          },
        },
      };

      const { container } = render(
        <SearchResult
          representative={formData.representative}
          query={{}}
          handleSelectRepresentative={() => {}}
          loadingPOA={false}
          userIsDigitalSubmitEligible={
            formData.userIsDigitalSubmitEligible && formData['view:v2IsEnabled']
          }
        />,
      );

      const digitalSubmissionMethods = container.querySelector(
        '[data-testid="submission-methods-with-digital"]',
      );

      const nonDigitalSubmissionMethods = container.querySelector(
        '[data-testid="submission-methods-without-digital"]',
      );

      expect(digitalSubmissionMethods).not.to.exist;
      expect(nonDigitalSubmissionMethods).not.to.exist;
    });
  });
});
