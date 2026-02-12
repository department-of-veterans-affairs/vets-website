import { expect } from 'chai';
import {
  truncateMiddleName,
  truncateName,
  combineCityState,
  combineMarriageDates,
} from '../../../utils/transformers/helpers';

describe('truncateMiddleName', () => {
  it('should truncate the middle name to its first initial', () => {
    const name = {
      first: 'John',
      middle: 'Michael',
      last: 'Doe',
    };
    const result = truncateMiddleName(name);
    expect(result).to.deep.equal({
      first: 'John',
      middle: 'M',
      last: 'Doe',
    });
  });

  it('should return the name unchanged if there is no middle name', () => {
    const name = {
      first: 'Jane',
      last: 'Smith',
    };
    const result = truncateMiddleName(name);
    expect(result).to.deep.equal(name);
  });

  it('should return undefined if the name is undefined', () => {
    const result = truncateMiddleName(undefined);
    expect(result).to.be.undefined;
  });
});

describe('truncateName', () => {
  it('should truncate the middle name to its first initial', () => {
    const name = {
      first: 'John',
      middle: 'Michael',
      last: 'Doe',
    };
    const result = truncateName(name, 10, 1, 10);
    expect(result).to.deep.equal({
      first: 'John',
      middle: 'M',
      last: 'Doe',
    });
  });

  it('should return the name unchanged if there is no middle name', () => {
    const name = {
      first: 'Jane',
      last: 'Smith',
    };
    const result = truncateName(name, 1, null, 1);
    expect(result).to.deep.equal({ first: 'J', middle: undefined, last: 'S' });
  });

  it('should return undefined if the name is undefined', () => {
    const result = truncateName(undefined);
    expect(result).to.be.undefined;
  });
});

describe('combineCityState', () => {
  it('should combine city and state into a single string', () => {
    const city = 'New York';
    const state = 'NY';
    const result = combineCityState(city, state);
    expect(result).to.equal('New York, NY');
  });

  it('should return just the city if state is not provided', () => {
    const city = 'Los Angeles';
    const result = combineCityState(city);
    expect(result).to.equal('Los Angeles');
  });

  it('should return just the state if city is not provided', () => {
    const state = 'CA';
    const result = combineCityState(undefined, state);
    expect(result).to.equal('CA');
  });

  it('should return an empty string if neither city nor state is provided', () => {
    const result = combineCityState();
    expect(result).to.equal('');
  });
});

describe('combineMarriageDates', () => {
  it('should combine marriage start and end dates into a single string', () => {
    const startDate = '01/01/2000';
    const endDate = '12/31/2020';
    const result = combineMarriageDates(startDate, endDate);
    expect(result).to.equal('01/01/2000 - 12/31/2020');
  });

  it('should return just the start date if end date is not provided', () => {
    const startDate = '01/01/2000';
    const result = combineMarriageDates(startDate);
    expect(result).to.equal('01/01/2000');
  });

  it('should return just the end date if start date is not provided', () => {
    const endDate = '12/31/2020';
    const result = combineMarriageDates(undefined, endDate);
    expect(result).to.equal('12/31/2020');
  });

  it('should return an  empty string if neither start date nor end date is provided', () => {
    const result = combineMarriageDates();
    expect(result).to.equal('');
  });
});
