import { expect } from 'chai';

import {
  title995,
  subTitle995,
  title4142,
  subTitle4142,
  getTitle,
  getSubTitle,
} from '../../content/title';

describe('getTitle', () => {
  const testTitle = (pathname, expectedTitle) => {
    const currentLocation = { pathname };
    const title = getTitle({ currentLocation });
    expect(title).to.eq(expectedTitle);
    expect(document.title).to.eq(expectedTitle);
  };
  it('should return 995 title for all non-4142 paths', () => {
    testTitle('/', title995);
    testTitle('/introduction', title995);
    testTitle('/veteran-information', title995);
    testTitle('/contact-information', title995);
    testTitle('/review-and-submit', title995);
    testTitle('/confirmation', title995);
    testTitle('/private-medical', title995);
  });
  it('should return 4142 title for 4142 paths', () => {
    testTitle('/request-private-medical-records', title4142);
    testTitle('/private-medical-records-authorization', title4142);
    testTitle('/private-medical-records', title4142);
    testTitle('/add-private-record-limitations', title4142);

    testTitle('/request-private-medical-records/test', title4142);
  });
});

describe('getSubTitle', () => {
  const testSubTitle = (pathname, expectedTitle) => {
    const currentLocation = { pathname };
    const subTitle = getSubTitle({ currentLocation });
    expect(subTitle).to.eq(expectedTitle);
  };
  it('should return 995 title for all non-4142 paths', () => {
    testSubTitle('/', subTitle995);
    testSubTitle('/introduction', subTitle995);
    testSubTitle('/veteran-information', subTitle995);
    testSubTitle('/contact-information', subTitle995);
    testSubTitle('/review-and-submit', subTitle995);
    testSubTitle('/confirmation', subTitle995);
    testSubTitle('/private-medical', subTitle995);
  });
  it('should return 4142 title for 4142 paths', () => {
    testSubTitle('/request-private-medical-records', subTitle4142);
    testSubTitle('/private-medical-records-authorization', subTitle4142);
    testSubTitle('/private-medical-records', subTitle4142);
    testSubTitle('/add-private-record-limitations', subTitle4142);

    testSubTitle('/request-private-medical-records/test', subTitle4142);
  });
});
