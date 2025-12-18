import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import PayeeInformationCard from '../../components/PayeeInformationCard';

describe('<PayeeInformationCard />', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without crashing', () => {
    const { container, unmount } = render(<PayeeInformationCard />);
    expect(container).to.exist;
    unmount();
  });

  it('should render applicantName and showAdditionalInformation', () => {
    const { container } = render(
      <PayeeInformationCard
        showAdditionalInformation
        applicantName="applicantName"
      />,
    );

    expect(container.querySelector('va-additional-info')).to.exist;
  });

  it('should handle Chapter 1606 if applicantChapter is A', () => {
    const { getByText, container } = render(
      <PayeeInformationCard
        showAdditionalInformation={false}
        applicantName="applicantName"
        applicantChapter={[{ benefitType: 'A' }]}
      />,
    );

    expect(container.querySelectorAll('li')).to.have.lengthOf(1);
    expect(
      getByText('Montgomery GI Bill (MGIB) – Selective Reserve (Chapter 1606)'),
    ).to.exist;
  });

  it('should handle Chapter 30 if applicantChapter is B', () => {
    const { getByText, container } = render(
      <PayeeInformationCard
        showAdditionalInformation={false}
        applicantName="applicantName"
        applicantChapter={[{ benefitType: 'B' }]}
      />,
    );

    expect(container.querySelectorAll('li')).to.have.lengthOf(1);
    expect(getByText('Montgomery GI Bill (MGIB) – Active Duty (Chapter 30)')).to
      .exist;
  });

  it('should render va-loading-indicator when loading for applicantName', () => {
    const { container } = render(
      <PayeeInformationCard
        showAdditionalInformation
        applicantName="applicantName"
        loading
      />,
    );

    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('should render va-loading-indicator when loading for applicantChapter', () => {
    const { container } = render(
      <PayeeInformationCard
        showAdditionalInformation={false}
        applicantChapter={[]}
        loading
      />,
    );

    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('should render applicantClaimNumber when applicantClaimNumber is not empty', () => {
    const { getByText } = render(
      <PayeeInformationCard applicantClaimNumber="applicantClaimNumber" />,
    );

    expect(getByText('applicantClaimNumber')).to.exist;
  });
});
