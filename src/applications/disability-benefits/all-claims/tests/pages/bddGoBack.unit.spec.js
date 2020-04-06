import moment from 'moment';

import formConfig from '../../config/form';

describe('526 bddGoBack page', () => {
  const { depends } = formConfig.chapters.veteranDetails.pages.bddGoBack;
  const futureDate = moment()
    .add(1, 'day')
    .format('YYYY-MM-DD');
  const formData = (verifyBddData, endDate = futureDate) => {
    const data = {
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
    };
    // If it's not passed in, don't add it
    if (verifyBddData !== undefined) data['view:verifyBdd'] = verifyBddData;
    return data;
  };

  it('should show up when the service period confirmation question is not answered', () => {
    expect(depends(formData())).toBe(true);
  });

  it('should show up when the service period confirmation question is answered "no"', () => {
    expect(depends(formData(false))).toBe(true);
  });

  it('should not show up when there are no active service periods', () => {
    expect(depends(formData(undefined, '2010-01-01'))).toBe(false);
  });

  it('should not show up when the service period confirmation question is answered "yes"', () => {
    expect(depends(formData(true))).toBe(false);
  });
});
