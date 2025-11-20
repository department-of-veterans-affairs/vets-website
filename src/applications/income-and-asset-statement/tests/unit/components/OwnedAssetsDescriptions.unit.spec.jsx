import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as arrayBuilderHelpers from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import {
  DocumentMailingAddressDescription,
  AdditionalFormNeededDescription,
  DocumentUploadGuidelinesDescription,
  SummaryDescription,
} from '../../../components/OwnedAssetsDescriptions';

describe('OwnedAssetsDescriptions Components', () => {
  let sandbox;
  let mockStore;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(arrayBuilderHelpers, 'getArrayIndexFromPathName').returns(0);

    mockStore = {
      getState: () => ({
        form: {
          data: {
            ownedAssets: [
              {
                assetType: 'FARM',
              },
            ],
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  const renderWithProvider = component => {
    return render(<Provider store={mockStore}>{component}</Provider>);
  };

  describe('DocumentMailingAddressDescription', () => {
    it('should render farm-specific content for FARM asset type', () => {
      const { container } = renderWithProvider(
        <DocumentMailingAddressDescription />,
      );

      expect(container.innerHTML).to.include(
        'Pension Claim Questionnaire for Farm Income (VA Form 21P-4165)',
      );
      expect(container.innerHTML).to.include(
        'Since you aren’t uploading the form now',
      );
      expect(container.innerHTML).to.include(
        'U.S. Department of Veterans Affairs',
      );
      expect(container.innerHTML).to.include('Pension Intake Center');
    });

    it('should render business-specific content for BUSINESS asset type', () => {
      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [
              {
                assetType: 'BUSINESS',
              },
            ],
          },
        },
      });

      const { container } = renderWithProvider(
        <DocumentMailingAddressDescription />,
      );

      expect(container.innerHTML).to.include(
        'Report of Income from Property or Business (VA Form 21p-4185)',
      );
      expect(container.innerHTML).to.include(
        'Since you aren’t uploading the form now',
      );
    });

    it('should handle undefined asset type gracefully', () => {
      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [{}],
          },
        },
      });

      const { container } = renderWithProvider(
        <DocumentMailingAddressDescription />,
      );

      expect(container.innerHTML).to.include(
        'Since you aren’t uploading the form now',
      );
      expect(container.innerHTML).to.include(
        'Report of Income from Property or Business (VA Form 21p-4185)',
      );
    });

    it('should handle missing ownedAssets array', () => {
      mockStore.getState = () => ({
        form: {
          data: {},
        },
      });

      const { container } = renderWithProvider(
        <DocumentMailingAddressDescription />,
      );

      expect(container.innerHTML).to.include(
        'Since you aren’t uploading the form now',
      );
    });

    it('should include complete mailing address', () => {
      const { container } = renderWithProvider(
        <DocumentMailingAddressDescription />,
      );

      expect(container.innerHTML).to.include('PO Box 5365');
      expect(container.innerHTML).to.include('Janesville, WI 53547-5365');
      expect(container.innerHTML).to.include('va-address-block');
    });
  });

  describe('AdditionalFormNeededDescription', () => {
    it('should render farm form information for FARM asset type', () => {
      const { container } = renderWithProvider(
        <AdditionalFormNeededDescription />,
      );

      expect(container.innerHTML).to.include('Since you added a farm');
      expect(container.innerHTML).to.include(
        'Pension Claim Questionnaire for Farm Income (VA Form 21P-4165)',
      );
      expect(container.innerHTML).to.include(
        'Get VA Form 21P-4165 to download',
      );
      expect(container.innerHTML).to.include(
        '/find-forms/about-form-21p-4165/',
      );
    });

    it('should render business form information for BUSINESS asset type', () => {
      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [
              {
                assetType: 'BUSINESS',
              },
            ],
          },
        },
      });

      const { container } = renderWithProvider(
        <AdditionalFormNeededDescription />,
      );

      expect(container.innerHTML).to.include('Since you added a business');
      expect(container.innerHTML).to.include(
        'Report of Income from Property or Business (VA Form 21p-4185)',
      );
      expect(container.innerHTML).to.include(
        'Get VA Form 21p-4185 to download',
      );
      expect(container.innerHTML).to.include(
        '/find-forms/about-form-21p-4185/',
      );
    });

    it('should return null for undefined asset type', () => {
      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [{}],
          },
        },
      });

      const { container } = renderWithProvider(
        <AdditionalFormNeededDescription />,
      );

      expect(container.innerHTML).to.equal('');
    });

    it('should return null for non-FARM/BUSINESS asset types', () => {
      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [
              {
                assetType: 'RENTAL_PROPERTY',
              },
            ],
          },
        },
      });

      const { container } = renderWithProvider(
        <AdditionalFormNeededDescription />,
      );

      expect(container.innerHTML).to.equal('');
    });

    it('should include external link attributes', () => {
      const { container } = renderWithProvider(
        <AdditionalFormNeededDescription />,
      );

      const link = container.querySelector('va-link');
      expect(link).to.not.be.null;
      expect(link.hasAttribute('external')).to.be.true;
    });
  });

  describe('DocumentUploadGuidelinesDescription', () => {
    it('should render farm form guidelines for FARM asset type', () => {
      const { container } = renderWithProvider(
        <DocumentUploadGuidelinesDescription />,
      );

      expect(container.innerHTML).to.include(
        'Pension Claim Questionnaire for Farm Income (VA Form 21P-4165)',
      );
      expect(container.innerHTML).to.include('Be sure that the');
      expect(container.innerHTML).to.include(
        'you submit follow these guidelines',
      );
    });

    it('should render business form guidelines for BUSINESS asset type', () => {
      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [
              {
                assetType: 'BUSINESS',
              },
            ],
          },
        },
      });

      const { container } = renderWithProvider(
        <DocumentUploadGuidelinesDescription />,
      );

      expect(container.innerHTML).to.include(
        'Report of Income from Property or Business (VA Form 21p-4185)',
      );
    });

    it('should include file type guidelines', () => {
      const { container } = renderWithProvider(
        <DocumentUploadGuidelinesDescription />,
      );

      expect(container.innerHTML).to.include('.pdf, .jpeg, or .png file');
      expect(container.innerHTML).to.include('20MB');
    });

    it('should handle undefined asset type with fallback', () => {
      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [{}],
          },
        },
      });

      const { container } = renderWithProvider(
        <DocumentUploadGuidelinesDescription />,
      );

      expect(container.innerHTML).to.include(
        'Report of Income from Property or Business (VA Form 21p-4185)',
      );
      expect(container.innerHTML).to.include('follow these guidelines');
    });

    it('should use correct file size constant', () => {
      const { container } = renderWithProvider(
        <DocumentUploadGuidelinesDescription />,
      );

      expect(container.innerHTML).to.include('20');
      expect(container.innerHTML).to.include('MB');
    });
  });

  describe('SummaryDescription', () => {
    it('should render complete summary content', () => {
      const { container } = renderWithProvider(<SummaryDescription />);

      expect(container.innerHTML).to.include('Types of property to report');
      expect(container.innerHTML).to.include('Establish the asset’s value');
      expect(container.innerHTML).to.include(
        'Documents you may need to submit',
      );
    });

    it('should include all property types examples', () => {
      const { container } = renderWithProvider(<SummaryDescription />);

      expect(container.innerHTML).to.include('Rental property');
      expect(container.innerHTML).to.include('Farm income');
      expect(container.innerHTML).to.include('Business income');
    });

    it('should include all required form information', () => {
      const { container } = renderWithProvider(<SummaryDescription />);

      expect(container.innerHTML).to.include('VA Form 21P-4165');
      expect(container.innerHTML).to.include('VA Form 21P-4185');
      expect(container.innerHTML).to.include(
        'Pension Claim Questionnaire for Farm Income',
      );
      expect(container.innerHTML).to.include(
        'Report of Income from Property or Business',
      );
    });

    it('should include value assessment guidance', () => {
      const { container } = renderWithProvider(<SummaryDescription />);

      expect(container.innerHTML).to.include(
        'subtract any unpaid mortgage or debt',
      );
      expect(container.innerHTML).to.include(
        'licensed appraiser, realtor, or trusted online estimate',
      );
      expect(container.innerHTML).to.include(
        'Don’t use a property tax assessment',
      );
    });

    it('should have proper heading structure', () => {
      const { container } = renderWithProvider(<SummaryDescription />);

      const h1 = container.querySelector('h1');
      const h2s = container.querySelectorAll('h2');

      expect(h1).to.be.null;
      expect(h2s.length).to.equal(3);
    });

    it('should use correct CSS classes', () => {
      const { container } = renderWithProvider(<SummaryDescription />);

      const h2s = container.querySelectorAll('h2');

      h2s.forEach(h2 => {
        expect(h2.className).to.include('vads-u-font-size--h3');
        expect(h2.className).to.include('vads-u-margin-top--0');
      });
    });
  });

  describe('useOwnedAssetContext hook integration', () => {
    it('should handle different array indices', () => {
      arrayBuilderHelpers.getArrayIndexFromPathName.returns(1);

      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [{ assetType: 'FARM' }, { assetType: 'BUSINESS' }],
          },
        },
      });

      const { container } = renderWithProvider(
        <DocumentMailingAddressDescription />,
      );

      expect(container.innerHTML).to.include(
        'Report of Income from Property or Business (VA Form 21p-4185)',
      );
    });

    it('should handle out-of-bounds array index', () => {
      arrayBuilderHelpers.getArrayIndexFromPathName.returns(5);

      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [{ assetType: 'FARM' }],
          },
        },
      });

      const { container } = renderWithProvider(
        <DocumentMailingAddressDescription />,
      );

      // still should render without error
      expect(container.innerHTML).to.include(
        'Since you aren’t uploading the form now',
      );
    });

    it('should handle missing form data entirely', () => {
      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [],
          },
        },
      });

      const { container } = renderWithProvider(
        <DocumentMailingAddressDescription />,
      );

      expect(container.innerHTML).to.include(
        'Since you aren’t uploading the form now',
      );
    });

    it('should handle null form data', () => {
      mockStore.getState = () => ({
        form: {
          data: null,
        },
      });

      const { container } = renderWithProvider(
        <DocumentMailingAddressDescription />,
      );

      expect(container.innerHTML).to.include(
        'Since you aren’t uploading the form now',
      );
    });
  });

  describe('Error boundary scenarios', () => {
    it('should not throw when Redux store is missing expected structure', () => {
      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [],
          },
        },
      });

      expect(() => {
        renderWithProvider(<DocumentMailingAddressDescription />);
      }).to.not.throw();
    });

    it('should handle components being rendered outside form context', () => {
      mockStore.getState = () => ({
        form: {
          data: {
            ownedAssets: [],
          },
        },
      });

      expect(() => {
        renderWithProvider(<SummaryDescription />);
      }).to.not.throw();
    });
  });
});
