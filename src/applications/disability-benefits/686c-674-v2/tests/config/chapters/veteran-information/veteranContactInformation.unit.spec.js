import { expect } from 'chai';
import { internationalPhoneUI } from '../../../../config/chapters/veteran-information/veteran-contact-information';

describe('internationalPhoneUI', () => {
  it('should return the default title when no title is provided', () => {
    const result = internationalPhoneUI({});
    expect(result['ui:title']).to.equal('International phone number');
  });

  it('should return the provided title when a title is provided', () => {
    const customTitle = 'Custom phone number title';
    const result = internationalPhoneUI({ title: customTitle });
    expect(result['ui:title']).to.equal(customTitle);
  });

  it('should return the default title when a non-object option is passed', () => {
    const customTitle = 'Custom phone number title';
    const result = internationalPhoneUI(customTitle);
    expect(result['ui:title']).to.equal(customTitle);
  });
});
