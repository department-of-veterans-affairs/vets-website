import { expect } from 'chai';
import { render } from '@testing-library/react';
import SupportingDocuments from '../../../../config/chapters/12-supporting-documents/supportingDocuments';

describe('Supporting documents page', () => {
  const renderPage = formData =>
    render(SupportingDocuments.uiSchema['ui:description']({ formData }));

  it('renders fallback when no documents are required', () => {
    const { getByText } = renderPage({ ownedAssets: [], trusts: [] });
    expect(
      getByText(/There are no documents that we require from you right now/i),
    ).to.exist;
  });

  it('renders farm income document link when FARM asset is present', () => {
    const { getByText, queryByText } = renderPage({
      ownedAssets: [{ assetType: 'FARM' }],
    });
    expect(
      queryByText(
        /Because you’ve indicated you have a farm, you’ll need to submit these supporting documents:/,
      ),
    ).to.exist;
    expect(getByText(/Get VA Form 21P-4165 \(opens in new tab\)/))
      .to.have.attribute('href')
      .that.includes('21p-4165');
    expect(queryByText(/Get VA Form 21P-4185/)).to.be.null;
  });

  it('renders business income document link when BUSINESS asset is present', () => {
    const { getByText, queryByText } = renderPage({
      ownedAssets: [{ assetType: 'BUSINESS' }],
    });
    expect(
      queryByText(
        /Because you’ve indicated you have a business, you’ll need to submit these supporting documents:/,
      ),
    ).to.exist;
    expect(getByText(/Get VA Form 21P-4185 \(opens in new tab\)/))
      .to.have.attribute('href')
      .that.includes('21p-4185');
    expect(queryByText(/Get VA Form 21P-4165/)).to.be.null;
  });

  it('renders both business and farm document links with correct phrase', () => {
    const { getByText, queryByText } = renderPage({
      ownedAssets: [{ assetType: 'BUSINESS' }, { assetType: 'FARM' }],
    });
    expect(
      getByText(
        /Because you’ve indicated you have a farm, and a business, you’ll need to submit these supporting documents:/,
      ),
    ).to.exist;
    expect(getByText(/Get VA Form 21P-4185 \(opens in new tab\)/)).to.exist;
    expect(getByText(/Get VA Form 21P-4165 \(opens in new tab\)/)).to.exist;
    expect(queryByText(/you have a trust, you’ll need to submit/)).to.be.null;
  });

  it('renders trust documentation list', () => {
    const { getByText, queryByText } = renderPage({
      trusts: [{ name: 'Test Trust' }],
    });
    expect(
      getByText(
        /Because you’ve indicated you have a trust, you’ll need to submit these supporting documents:/,
      ),
    ).to.exist;
    expect(getByText(/Initial contract from financial institution/)).to.exist;
    expect(queryByText(/Get VA Form 21P-4185/)).to.be.null;
    expect(queryByText(/Get VA Form 21P-4165/)).to.be.null;
  });

  it('renders business, farm, and trust sections with correct phrase', () => {
    const { getByText } = renderPage({
      ownedAssets: [{ assetType: 'BUSINESS' }, { assetType: 'FARM' }],
      trusts: [{ name: 'Sample Trust' }],
    });

    expect(
      getByText(
        /Because you’ve indicated you have a farm, a business, and a trust, you’ll need to submit these supporting documents:/,
      ),
    ).to.exist;
    expect(getByText(/Get VA Form 21P-4185 \(opens in new tab\)/))
      .to.have.attribute('href')
      .that.includes('21p-4185');
    expect(getByText(/Get VA Form 21P-4165 \(opens in new tab\)/))
      .to.have.attribute('href')
      .that.includes('21p-4165');
    expect(getByText(/Initial contract from financial institution/)).to.exist;
    expect(getByText(/Current statement showing surrender value/)).to.exist;
    expect(getByText(/Schedule of assets/)).to.exist;
  });

  it('includes the additional info component in all scenarios', () => {
    const { container } = renderPage({});
    expect(container.querySelector('va-additional-info')).to.exist;
  });
});
