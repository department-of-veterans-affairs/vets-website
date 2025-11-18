import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationSeparationPay from '../../components/confirmationFields/ConfirmationSeparationPay';
import {
  NO,
  SEPARATION_PAY_BRANCH_TITLE,
  SEPARATION_PAY_DATE_TITLE,
  SEPARATION_PAY_SECTION_TITLE,
  SEPARATION_PAY_TITLE,
  YES,
} from '../../constants';

describe('ConfirmationSeparationPay', () => {
  it('should render correctly when hasSeparationPay is false/no', () => {
    const formData = {
      hasSeparationPay: false,
    };
    const { container, getByText } = render(
      <ConfirmationSeparationPay formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText(SEPARATION_PAY_SECTION_TITLE)).to.exist;
    expect(getByText(SEPARATION_PAY_TITLE)).to.exist;
    expect(getByText(NO)).to.exist;
  });

  it('should render correctly when hasSeparationPay is true/yes', () => {
    const formData = { hasSeparationPay: true };
    const { container, getByText } = render(
      <ConfirmationSeparationPay formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText(SEPARATION_PAY_SECTION_TITLE)).to.exist;
    expect(getByText(SEPARATION_PAY_TITLE)).to.exist;
    expect(getByText(YES)).to.exist;
  });

  it('should render correctly when hasSeparationPay is true/yes with optional date', () => {
    const separationPayDate = '2020';
    const formData = {
      hasSeparationPay: true,
      'view:separationPayDetails': { separationPayDate },
    };
    const { container, getByText } = render(
      <ConfirmationSeparationPay formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText(SEPARATION_PAY_SECTION_TITLE)).to.exist;
    expect(getByText(SEPARATION_PAY_TITLE)).to.exist;
    expect(getByText(YES)).to.exist;
    expect(getByText(SEPARATION_PAY_DATE_TITLE)).to.exist;
    expect(getByText(separationPayDate)).to.exist;
  });

  it('should render correctly when hasSeparationPay is true/yes with optional branch', () => {
    const separationPayBranch = 'Air Force';
    const formData = {
      hasSeparationPay: true,
      'view:separationPayDetails': { separationPayBranch },
    };
    const { container, getByText } = render(
      <ConfirmationSeparationPay formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText(SEPARATION_PAY_SECTION_TITLE)).to.exist;
    expect(getByText(SEPARATION_PAY_TITLE)).to.exist;
    expect(getByText(YES)).to.exist;
    expect(getByText(SEPARATION_PAY_BRANCH_TITLE)).to.exist;
    expect(getByText(separationPayBranch)).to.exist;
  });

  it('should render correctly when hasSeparationPay is true/yes with optional date and branch', () => {
    const separationPayBranch = 'Air Force';
    const separationPayDate = '2024';
    const formData = {
      hasSeparationPay: true,
      'view:separationPayDetails': { separationPayBranch, separationPayDate },
    };
    const { container, getByText } = render(
      <ConfirmationSeparationPay formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText(SEPARATION_PAY_SECTION_TITLE)).to.exist;
    expect(getByText(SEPARATION_PAY_TITLE)).to.exist;
    expect(getByText(YES)).to.exist;
    expect(getByText(SEPARATION_PAY_DATE_TITLE)).to.exist;
    expect(getByText(SEPARATION_PAY_BRANCH_TITLE)).to.exist;
    expect(getByText(separationPayBranch)).to.exist;
  });
});
