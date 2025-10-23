import { expect } from 'chai';
import { formatISO, add, endOfToday } from 'date-fns';

import {
  isNotExpired,
  isActiveItf,
  findLastItf,
  isSupportedBenefitType,
  isOutsideForm,
} from '../../utils';
import { ITF_STATUSES, ITF_SUPPORTED_BENEFIT_TYPES } from '../../constants';

describe('isNotExpired', () => {
  it('should return true', () => {
    expect(isNotExpired(formatISO(endOfToday()))).to.be.true;
    expect(isNotExpired(formatISO(add(new Date(), { days: 1 })))).to.be.true;
    expect(isNotExpired(formatISO(add(new Date(), { month: 1 })))).to.be.true;
  });
  it('should return false', () => {
    expect(isNotExpired()).to.be.false;
    expect(isNotExpired(formatISO(add(new Date(), { days: -1 })))).to.be.false;
    expect(isNotExpired(formatISO(add(new Date(), { months: -1 })))).to.be
      .false;
  });
});

describe('isActiveItf', () => {
  it('should return true if active & not expired', () => {
    expect(
      isActiveItf({
        status: ITF_STATUSES.active,
        expirationDate: formatISO(add(new Date(), { days: 1 })),
      }),
    ).to.be.true;
    expect(
      isActiveItf({
        status: ITF_STATUSES.active,
        expirationDate: formatISO(add(new Date(), { months: 1 })),
      }),
    ).to.be.true;
  });
  it('should return false', () => {
    expect(isActiveItf()).to.be.false;
    expect(isActiveItf({})).to.be.false;
    expect(
      isActiveItf({
        status: '',
        expirationDate: formatISO(add(new Date(), { days: -1 })),
      }),
    ).to.be.false;
    expect(
      isActiveItf({
        status: ITF_STATUSES.active,
        expirationDate: '',
      }),
    ).to.be.false;
    expect(
      isActiveItf({
        status: ITF_STATUSES.active,
        expirationDate: formatISO(add(new Date(), { days: -1 })),
      }),
    ).to.be.false;
    expect(
      isActiveItf({
        status: ITF_STATUSES.active,
        expirationDate: formatISO(add(new Date(), { months: -1 })),
      }),
    ).to.be.false;
  });
});

describe('findLastItf', () => {
  it('should return the latest ITF', () => {
    const itfList = () => [
      {
        id: '1',
        creationDate: '2018-01-21T19:53:45.810+00:00',
        expirationDate: '2019-01-21T19:53:45.810+00:00',
        participantId: 1,
        source: 'EBN',
        status: 'expired',
        type: 'compensation',
      },
      {
        id: '2',
        creationDate: '2021-02-21T19:53:45.810+00:00',
        expirationDate: '2022-02-21T19:53:45.810+00:00',
        participantId: 1,
        source: 'EBN',
        status: 'active',
        type: 'compensation',
      },
      {
        id: '3',
        creationDate: '2023-03-21T19:53:45.810+00:00',
        expirationDate: '2024-03-21T19:53:45.810+00:00',
        participantId: 1,
        source: 'EBN',
        status: 'duplicate',
        type: 'compensation',
      },
      {
        id: '4',
        creationDate: '2019-04-21T19:53:45.810+00:00',
        expirationDate: '2020-04-21T19:53:45.810+00:00',
        participantId: 1,
        source: 'EBN',
        status: 'expired',
        type: 'compensation',
      },
    ];
    expect(findLastItf(itfList())).to.deep.equal(itfList()[2]);
  });
});

describe('supportedBenefitType', () => {
  it('should return true', () => {
    expect(isSupportedBenefitType(ITF_SUPPORTED_BENEFIT_TYPES[0])).to.be.true;
    expect(isSupportedBenefitType(ITF_SUPPORTED_BENEFIT_TYPES[1])).to.be.true;
    expect(isSupportedBenefitType('pension')).to.be.true;
  });
  it('should return false', () => {
    expect(isSupportedBenefitType()).to.be.false;
    expect(isSupportedBenefitType('foo')).to.be.false;
    expect(isSupportedBenefitType('1234')).to.be.false;
    expect(isSupportedBenefitType(1234)).to.be.false;
  });
});

describe('isOutsideForm', () => {
  it('should return true', () => {
    expect(isOutsideForm('/start')).to.be.true;
    expect(isOutsideForm('/introduction')).to.be.true;
    expect(isOutsideForm('/confirmation')).to.be.true;
    expect(isOutsideForm('/form-saved')).to.be.true;
    expect(isOutsideForm('/error')).to.be.true;
    expect(isOutsideForm('/resume')).to.be.true;
    expect(isOutsideForm('/start/')).to.be.true;
    expect(isOutsideForm('/introduction/')).to.be.true;
    expect(isOutsideForm('/confirmation/')).to.be.true;
    expect(isOutsideForm('/form-saved/')).to.be.true;
    expect(isOutsideForm('/error/')).to.be.true;
    expect(isOutsideForm('/resume/')).to.be.true;
  });
  it('should return false', () => {
    expect(isOutsideForm('')).to.be.false;
    expect(isOutsideForm('/')).to.be.false;
    expect(isOutsideForm('/middle')).to.be.false;
    expect(isOutsideForm('/form')).to.be.false;
    expect(isOutsideForm('/resum')).to.be.false;
    expect(isOutsideForm('/err')).to.be.false;
  });
});
