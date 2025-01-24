import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { SearchResult } from '../../components/SearchResult';
import * as useV2FeatureToggle from '../../hooks/useV2FeatureVisibility';

describe('SearchResult Component', () => {
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

    const useV2FeatureVisibilityStub = sinon
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

    useV2FeatureVisibilityStub.restore();
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

    const useV2FeatureVisibilityStub = sinon
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

    useV2FeatureVisibilityStub.restore();
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

    const useV2FeatureVisibilityStub = sinon
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

    useV2FeatureVisibilityStub.restore();
  });

  context('when v2 is enabled', () => {
    context('when the user is userIsDigitalSubmitEligible', () => {
      context('when the representative accepts digital submission', () => {
        it('displays digital submission methods', () => {
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
                accreditedOrganizations: {
                  data: [{ attributes: { canAcceptDigitalPoaRequests: true } }],
                },
              },
            },
          };

          const useV2FeatureVisibilityStub = sinon
            .stub(useV2FeatureToggle, 'default')
            .returns(true);

          const { container } = render(
            <SearchResult
              representative={representative}
              query={{}}
              handleSelectRepresentative={() => {}}
              loadingPOA={false}
              userIsDigitalSubmitEligible
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

          useV2FeatureVisibilityStub.restore();
        });
      });

      context(
        'when the representative does not accept digital submission',
        () => {
          it('displays non digital submission methods', () => {
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
                  accreditedOrganizations: {
                    data: [
                      { attributes: { canAcceptDigitalPoaRequests: false } },
                    ],
                  },
                },
              },
            };

            const useV2FeatureVisibilityStub = sinon
              .stub(useV2FeatureToggle, 'default')
              .returns(true);

            const { container } = render(
              <SearchResult
                representative={representative}
                query={{}}
                handleSelectRepresentative={() => {}}
                loadingPOA={false}
                userIsDigitalSubmitEligible
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

            useV2FeatureVisibilityStub.restore();
          });
        },
      );
    });

    context('when the user is not userIsDigitalSubmitEligible', () => {
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

        const useV2FeatureVisibilityStub = sinon
          .stub(useV2FeatureToggle, 'default')
          .returns(true);

        const { container } = render(
          <SearchResult
            representative={representative}
            query={{}}
            handleSelectRepresentative={() => {}}
            loadingPOA={false}
            userIsDigitalSubmitEligible={false}
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

        useV2FeatureVisibilityStub.restore();
      });
    });
  });

  context('when v2 is not enabled', () => {
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

      const useV2FeatureVisibilityStub = sinon
        .stub(useV2FeatureToggle, 'default')
        .returns(false);

      const { container } = render(
        <SearchResult
          representative={representative}
          query={{}}
          handleSelectRepresentative={() => {}}
          loadingPOA={false}
          userIsDigitalSubmitEligible
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

      useV2FeatureVisibilityStub.restore();
    });
  });
});
