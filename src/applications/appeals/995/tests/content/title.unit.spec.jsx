import { expect } from 'chai';
import {
  EVIDENCE_PRIVATE_AUTHORIZATION_URL,
  EVIDENCE_PRIVATE_DETAILS_URL,
  EVIDENCE_PRIVATE_PROMPT_URL,
  EVIDENCE_VA_DETAILS_URL,
  EVIDENCE_VA_PROMPT_URL,
  FORM_ID,
  LIMITED_CONSENT_DETAILS_URL,
  LIMITED_CONSENT_PROMPT_URL,
} from '../../constants';
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
    testSubTitle(EVIDENCE_VA_PROMPT_URL, FORM_ID);
    testSubTitle(EVIDENCE_VA_DETAILS_URL, FORM_ID);
  });

  it('should return 4142 title for 4142 paths', () => {
    testSubTitle(EVIDENCE_PRIVATE_PROMPT_URL, subTitle4142);
    testSubTitle(EVIDENCE_PRIVATE_AUTHORIZATION_URL, subTitle4142);
    testSubTitle(EVIDENCE_PRIVATE_DETAILS_URL, subTitle4142);
    testSubTitle(LIMITED_CONSENT_DETAILS_URL, subTitle4142);
    testSubTitle(LIMITED_CONSENT_PROMPT_URL, subTitle4142);
  });
});
