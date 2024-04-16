import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import moment from 'moment';

import { buildDateFormatter } from '../../utils/helpers';
import DueDate from '../../components/DueDate';

const formatDate = buildDateFormatter();

describe('<DueDate>', () => {
  it('should render past due class when less than a years difference', () => {
    const date = moment()
      .subtract(15, 'month')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate} - due a year ago`;

    expect(tree.everySubTree('.past-due')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render past due class when less than a months difference', () => {
    const date = moment()
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate} - due 2 days ago`;

    expect(tree.everySubTree('.past-due')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render past due class when less than day difference', () => {
    const date = moment()
      .subtract(1, 'hour')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate} - due 16 hours ago`;

    expect(tree.everySubTree('.past-due')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render file due class when less than a day difference', () => {
    const date = moment()
      .add(1, 'day')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate} - due in 8 hours`;

    expect(tree.everySubTree('.due-file')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render file due class when more than a months difference', () => {
    const date = moment()
      .add(10, 'month')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate} - due in 10 months`;

    expect(tree.everySubTree('.due-file')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });

  it('should render file due class when more than a years difference', () => {
    const date = moment()
      .add(15, 'month')
      .format('YYYY-MM-DD');
    const tree = SkinDeep.shallowRender(<DueDate date={date} />);
    const formattedClaimDate = formatDate(date);
    const dueDateHeader = `Needed from you by ${formattedClaimDate} - due in a year`;

    expect(tree.everySubTree('.due-file')).not.to.be.empty;
    expect(tree.everySubTree('.due-date-header')[0].text()).to.equal(
      dueDateHeader,
    );
  });
});
