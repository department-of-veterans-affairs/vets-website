import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ProofOfVeteranStatusCard from './ProofOfVeteranStatusCard';

const testData = {
  edipi: '6198661986',
  formattedFullName: 'First Last',
  latestService: 'United States Army • 2009-2013',
  totalDisabilityRating: 70,
};

const renderWithTestData = data => {
  return render(
    <ProofOfVeteranStatusCard
      edipi={data.edipi}
      formattedFullName={data.formattedFullName}
      latestService={data.latestService}
      totalDisabilityRating={data.totalDisabilityRating}
    />,
  );
};

describe('ProofOfVeteranStatusCard', () => {
  it('should render the heading', () => {
    const view = renderWithTestData(testData);
    expect(view.queryByText(/Proof of Veteran status/)).to.exist;
  });
  it('should render the full name', () => {
    const view = renderWithTestData(testData);
    expect(view.queryByText(/Name/)).to.exist;
    expect(view.queryByText(/First Last/)).to.exist;
  });
  it('should render the latest service', () => {
    const view = renderWithTestData(testData);
    expect(view.queryByText(/Latest period of service/)).to.exist;
    expect(view.queryByText(/United States Army • 2009-2013/)).to.exist;
  });
  it('should render the DoD ID Number', () => {
    const view = renderWithTestData(testData);
    expect(view.queryByText(/DoD ID Number/)).to.exist;
    expect(view.queryByText(/6198661986/)).to.exist;
  });
  it('should render the VA disability rating when it exists', () => {
    const view = renderWithTestData(testData);
    expect(view.queryByText(/VA disability rating/)).to.exist;
    expect(view.queryByText(/70/)).to.exist;
  });
  it('should not render the VA disability rating when it is zero', () => {
    const view = renderWithTestData({
      ...testData,
      totalDisabilityRating: 0,
    });
    expect(view.queryByText(/VA disability rating/)).not.to.exist;
    expect(view.queryByText(/^0%$/)).not.to.exist;
  });
  it('should not render the VA disability rating when it is null', () => {
    const view = renderWithTestData({
      ...testData,
      totalDisabilityRating: null,
    });
    expect(view.queryByText(/VA disability rating/)).not.to.exist;
    expect(view.queryByText(/^null%$/)).not.to.exist;
  });
  it('should render the description', () => {
    const view = renderWithTestData(testData);
    expect(
      view.queryByText(/This status doesn’t entitle you to any VA benefits./),
    ).to.exist;
  });
  it('should render the description', () => {
    const view = renderWithTestData(testData);
    expect(
      view.queryByText(/This status doesn’t entitle you to any VA benefits./),
    ).to.exist;
  });
  it('should render the description', () => {
    const view = renderWithTestData(testData);
    expect(
      view.queryByAltText(/Seal of the U.S. Department of Veterans Affairs/),
    ).to.exist;
  });
});
