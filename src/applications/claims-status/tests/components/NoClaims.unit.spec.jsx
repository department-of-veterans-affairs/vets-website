import React from 'react';
import { expect } from 'chai';
import { renderWithRouter } from '../utils';
import NoClaims from '../../components/NoClaims';

describe('<NoClaims>', () => {
  it('should render default message when no recordType is provided', () => {
    const { getByText } = renderWithRouter(<NoClaims />);

    getByText('You do not have any submitted claims');
    getByText('This page shows only completed claim applications.');
  });

  it('should render filtered message when recordType is provided', () => {
    const { getByText, queryByText } = renderWithRouter(
      <NoClaims recordType="closed records" />,
    );

    getByText("We don't have any closed records for you in our system");
    expect(queryByText('You do not have any submitted claims')).to.be.null;
  });

  it('should render correct message for active records filter', () => {
    const { getByText } = renderWithRouter(
      <NoClaims recordType="active records" />,
    );

    getByText("We don't have any active records for you in our system");
  });
});
