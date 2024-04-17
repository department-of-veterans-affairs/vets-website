import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { buildDateFormatter } from '../../utils/helpers';
import { renderWithRouter } from '../utils';

import DueDate from '../../components/DueDate';

const formatDate = buildDateFormatter();

describe('<DueDate>', () => {
  it('should render past due class when theres more than a years difference', () => {
    const date = moment().subtract(15, 'month');
    const dateString = date.format('YYYY-MM-DD');
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(
      `Needed from you by ${formattedClaimDate} - Due ${date.fromNow()}`,
    );
    expect($('.past-due', container)).to.exist;
  });

  it('should render past due class when theres more than a months difference', () => {
    const date = moment().subtract(4, 'month');
    const dateString = date.format('YYYY-MM-DD');
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(
      `Needed from you by ${formattedClaimDate} - Due ${date.fromNow()}`,
    );
    expect($('.past-due', container)).to.exist;
  });

  it('should render past due class when theres more than a days difference', () => {
    const date = moment().subtract(3, 'day');
    const dateString = date.format('YYYY-MM-DD');
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(
      `Needed from you by ${formattedClaimDate} - Due ${date.fromNow()}`,
    );
    expect($('.past-due', container)).to.exist;
  });

  it('should render past due class when theres more than a few hours difference', () => {
    const date = moment().subtract(1, 'day');
    const dateString = date.format('YYYY-MM-DD');
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(
      `Needed from you by ${formattedClaimDate} - Due ${date.fromNow()}`,
    );
    expect($('.past-due', container)).to.exist;
  });

  it('should render file due class when more than a days difference', () => {
    const date = moment().add(3, 'day');
    const dateString = date.format('YYYY-MM-DD');
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(`Needed from you by ${formattedClaimDate}`);
    expect($('.due-file', container)).to.exist;
  });

  it('should render file due class when more than a months difference', () => {
    const date = moment().add(10, 'month');
    const dateString = date.format('YYYY-MM-DD');
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(`Needed from you by ${formattedClaimDate}`);
    expect($('.due-file', container)).to.exist;
  });

  it('should render file due class when more than a years difference', () => {
    const date = moment().add(15, 'month');
    const dateString = date.format('YYYY-MM-DD');
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(`Needed from you by ${formattedClaimDate}`);
    expect($('.due-file', container)).to.exist;
  });
});
