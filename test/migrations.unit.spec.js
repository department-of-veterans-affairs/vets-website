import { expect } from 'chai';

import fullSchema1010ez from '../src/js/hca/config/form';
import fullSchema1990 from '../src/js/edu-benefits/1990/config/form';
import fullSchema1990e from '../src/js/edu-benefits/1990e/config/form';
import fullSchema1990n from '../src/js/edu-benefits/1990n/config/form';
import fullSchema1995 from '../src/js/edu-benefits/1995/config/form';
import fullSchema5490 from '../src/js/edu-benefits/5490/config/form';
import fullSchema5495 from '../src/js/edu-benefits/5495/config/form';
import fullSchema527EZ from '../src/js/pensions/config/form';
import fullSchema530 from '../src/js/burials/config/form';
import fullSchema10007 from '../src/js/pre-need/config/form';

describe('form migrations:', () => {
  it('should have a length equal to the version number', () => {
    const configs = [
      fullSchema1010ez,
      fullSchema1990,
      fullSchema1990e,
      fullSchema1990n,
      fullSchema1995,
      fullSchema5490,
      fullSchema5495,
      fullSchema527EZ,
      fullSchema530,
      fullSchema10007
    ];
    configs.forEach(form => {
      if (form.migrations || form.version > 0) {
        expect(form.migrations.length).to.equal(form.version);
      }
    });
  });
});
