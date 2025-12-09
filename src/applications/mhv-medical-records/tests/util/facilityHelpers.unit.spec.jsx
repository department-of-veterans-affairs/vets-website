import { expect } from 'chai';
import { render } from '@testing-library/react';
import { formatFacilityUnorderedList } from '../../util/facilityHelpers';

describe('formatFacilityUnorderedList', () => {
  it('should return empty string when facilities is null', () => {
    expect(formatFacilityUnorderedList(null)).to.equal('');
  });

  it('should return empty string when facilities is undefined', () => {
    expect(formatFacilityUnorderedList(undefined)).to.equal('');
  });

  it('should return empty string when facilities is an empty array', () => {
    expect(formatFacilityUnorderedList([])).to.equal('');
  });

  it('should render a single facility in an unordered list', () => {
    const facilities = ['VA Western New York health care'];
    const { container } = render(formatFacilityUnorderedList(facilities));

    const list = container.querySelector('ul');
    const items = container.querySelectorAll('li');

    expect(list).to.exist;
    expect(items).to.have.lengthOf(1);
    expect(items[0].textContent).to.equal('VA Western New York health care');
  });

  it('should render multiple facilities in an unordered list', () => {
    const facilities = [
      'VA Western New York health care',
      'VA Pacific Islands health care',
      'VA Central Ohio health care',
    ];
    const { container } = render(formatFacilityUnorderedList(facilities));

    const list = container.querySelector('ul');
    const items = container.querySelectorAll('li');

    expect(list).to.exist;
    expect(items).to.have.lengthOf(3);
    expect(items[0].textContent).to.equal('VA Western New York health care');
    expect(items[1].textContent).to.equal('VA Pacific Islands health care');
    expect(items[2].textContent).to.equal('VA Central Ohio health care');
  });

  it('should render two facilities in an unordered list', () => {
    const facilities = [
      'VA Western New York health care',
      'VA Pacific Islands health care',
    ];
    const { container } = render(formatFacilityUnorderedList(facilities));

    const list = container.querySelector('ul');
    const items = container.querySelectorAll('li');

    expect(list).to.exist;
    expect(items).to.have.lengthOf(2);
    expect(items[0].textContent).to.equal('VA Western New York health care');
    expect(items[1].textContent).to.equal('VA Pacific Islands health care');
  });
});
