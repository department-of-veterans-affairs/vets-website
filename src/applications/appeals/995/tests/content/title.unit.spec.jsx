import { expect } from 'chai';
import { FORM_ID } from '../../constants';
import { getSubTitle } from '../../content/title';
import { subTitle4142 } from '../../content/evidence/form4142';

describe('getSubTitle', () => {
  const testSubTitle = (pathname, expectedTitle) => {
    const currentLocation = { pathname };
    const subTitle = getSubTitle({ currentLocation });
    expect(subTitle).to.eq(expectedTitle);
  };

  it('should return 995 title for all non-4142 paths', () => {
    testSubTitle('/', FORM_ID);
    testSubTitle('/introduction', FORM_ID);
    testSubTitle('/veteran-information', FORM_ID);
    testSubTitle('/contact-information', FORM_ID);
    testSubTitle('/review-and-submit', FORM_ID);
    testSubTitle('/confirmation', FORM_ID);
    testSubTitle('/private-medical', FORM_ID);
    testSubTitle('/request-private-medical-records', FORM_ID);
  });

  it('should return 4142 title for 4142 paths', () => {
    testSubTitle('/private-medical-records-authorization', subTitle4142);
    testSubTitle('/private-medical-records', subTitle4142);
    testSubTitle('/add-limitation', subTitle4142);
    testSubTitle('/limitation', subTitle4142);

    testSubTitle('/private-medical-records/test', subTitle4142);
  });
});
