import { expect } from 'chai';

import { subTitle995, subTitle4142, getSubTitle } from '../../content/title';

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
    testSubTitle('/request-private-medical-records', subTitle995);
  });
  it('should return 4142 title for 4142 paths', () => {
    testSubTitle('/private-medical-records-authorization', subTitle4142);
    testSubTitle('/private-medical-records', subTitle4142);
    testSubTitle('/add-private-record-limitations', subTitle4142);

    testSubTitle('/private-medical-records/test', subTitle4142);
  });
});
