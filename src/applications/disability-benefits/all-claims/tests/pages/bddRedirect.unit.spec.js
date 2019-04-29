import moment from 'moment';
import { expect } from 'chai';
import formConfig from '../../config/form';

describe('526 bddRedirect page', () => {
  const { depends } = formConfig.chapters.veteranDetails.pages.bddRedirect;
  const formData = endDate => ({
    serviceInformation: {
      servicePeriods: [
        {
          serviceBranch: 'Air force',
          dateRange: {
            from: '2009-12-31',
            to: endDate,
          },
        },
      ],
    },
  });

  it('should show up when there are active service periods', () => {
    const futureDate = moment()
      .add(1, 'day')
      .format('YYYY-MM-DD');
    expect(depends(formData(futureDate))).to.be.true;
  });

  it('should not show up when there are no active service periods', () => {
    expect(depends(formData('2010-01-01'))).to.be.false;
  });
});
