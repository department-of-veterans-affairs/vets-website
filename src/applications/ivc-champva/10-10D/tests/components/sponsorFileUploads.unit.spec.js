import { expect } from 'chai';
import { uploadWithInfoComponent } from '../../components/Sponsor/sponsorFileUploads';

describe('uploadWithInfoComponent', () => {
  it('should accept resource links', async () => {
    const upload = uploadWithInfoComponent(undefined, '', false, [
      { href: 'www.test.gov', text: 'Test' },
    ]);
    expect(upload.uiSchema).to.exist;
  });
});
