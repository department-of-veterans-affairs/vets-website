import React from 'react';
import { expect } from 'chai';
import {
  subMonths,
  subDays,
  addMonths,
  addDays,
  format,
  formatDistanceToNow,
  parseISO,
} from 'date-fns';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { buildDateFormatter } from '../../utils/helpers';
import { renderWithRouter } from '../utils';

import DueDate from '../../components/DueDate';

const formatDate = buildDateFormatter();

describe('<DueDate>', () => {
  it('should render past due class when theres more than a years difference', () => {
    const dateString = format(subMonths(new Date(), 15), 'yyyy-MM-dd');
    const timeAgoFormatted = formatDistanceToNow(parseISO(dateString));
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(
      `Needed from you by ${formattedClaimDate} - Due ${timeAgoFormatted} ago`,
    );
    expect($('.past-due', container)).to.exist;
  });

  it('should render past due class when theres more than a months difference', () => {
    const dateString = format(subMonths(new Date(), 4), 'yyyy-MM-dd');
    const timeAgoFormatted = formatDistanceToNow(parseISO(dateString));
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(
      `Needed from you by ${formattedClaimDate} - Due ${timeAgoFormatted} ago`,
    );
    expect($('.past-due', container)).to.exist;
  });

  it('should render past due class when theres more than a days difference', () => {
    const dateString = format(subDays(new Date(), 3), 'yyyy-MM-dd');
    const timeAgoFormatted = formatDistanceToNow(parseISO(dateString));
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(
      `Needed from you by ${formattedClaimDate} - Due ${timeAgoFormatted} ago`,
    );
    expect($('.past-due', container)).to.exist;
  });

  it('should render past due class when theres more than a few hours difference', () => {
    const dateString = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const timeAgoFormatted = formatDistanceToNow(parseISO(dateString));
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(
      `Needed from you by ${formattedClaimDate} - Due ${timeAgoFormatted} ago`,
    );
    expect($('.past-due', container)).to.exist;
  });

  it('should render file due class when more than a days difference', () => {
    const dateString = format(addDays(new Date(), 3), 'yyyy-MM-dd');
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(`Needed from you by ${formattedClaimDate}`);
    expect($('.due-file', container)).to.exist;
  });

  it('should render file due class when more than a months difference', () => {
    const dateString = format(addMonths(new Date(), 10), 'yyyy-MM-dd');
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(`Needed from you by ${formattedClaimDate}`);
    expect($('.due-file', container)).to.exist;
  });

  it('should render file due class when more than a years difference', () => {
    const dateString = format(addMonths(new Date(), 15), 'yyyy-MM-dd');
    const { container, getByText } = renderWithRouter(
      <DueDate date={dateString} />,
    );
    const formattedClaimDate = formatDate(dateString);

    getByText(`Needed from you by ${formattedClaimDate}`);
    expect($('.due-file', container)).to.exist;
  });
});
