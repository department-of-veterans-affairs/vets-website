import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';
import {
  additionalExposuresPageTitle,
  goBackLinkExposures,
  noDatesEntered,
  notSureDatesSummary,
} from '../../../content/toxicExposure';
import { ADDITIONAL_EXPOSURES } from '../../../constants';

describe('Additional Exposures Summary', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.additionalExposuresSummary;

  it('renders when multiple hazards with various date range situations', () => {
    const formData = {
      toxicExposure: {
        otherExposuresDetails: {
          asbestos: {},
          radiation: {
            endDate: '2005-05-30',
          },
          mos: {
            startDate: '2001-01-08',
          },
          chemical: {},
          water: {},
          mustardgas: {},
        },
        'view:otherExposuresAdditionalInfo': {},
        specifyOtherExposures: {
          startDate: '2000-03-20',
          endDate: '2001-03-01',
          description: 'Test substance',
        },
        'view:additionalExposuresAdditionalInfo': {},
        otherExposures: {
          asbestos: true,
          mos: true,
          radiation: true,
          none: false,
        },
      },
    };

    const { getByText, getByLabelText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(additionalExposuresPageTitle);
    getByText('Summary');

    getByText(ADDITIONAL_EXPOSURES.asbestos);
    getByText(noDatesEntered);

    getByText(ADDITIONAL_EXPOSURES.mos);
    getByText('January 2001 - No end date entered');

    getByText(ADDITIONAL_EXPOSURES.radiation);
    getByText('No start date entered - May 2005');

    getByText('Test substance');
    getByText('March 2000 - March 2001');

    getByText(goBackLinkExposures);
    getByLabelText(
      'go back and edit hazards and dates for Other toxic exposures',
    );
  });

  it('does not render a hazard if not checked', () => {
    const formData = {
      toxicExposure: {
        otherExposuresDetails: {
          asbestos: {},
          radiation: {
            endDate: '2005-05-30',
          },
          mos: {
            startDate: '2001-01-08',
          },
          chemical: {},
          water: {},
          mustardgas: {},
        },
        'view:otherExposuresAdditionalInfo': {},
        specifyOtherExposures: {
          startDate: '2000-03-20',
          endDate: '2001-03-01',
          description: 'Test substance',
        },
        'view:additionalExposuresAdditionalInfo': {},
        otherExposures: {
          asbestos: false,
          mos: false,
          radiation: true,
        },
      },
    };

    const { getByText, queryByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    expect(queryByText(ADDITIONAL_EXPOSURES.asbestos)).to.not.exist;

    expect(queryByText(ADDITIONAL_EXPOSURES.mos)).to.not.exist;
    expect(queryByText('January 2001 - No end date entered')).to.not.exist;

    getByText(ADDITIONAL_EXPOSURES.radiation);
    getByText('No start date entered - May 2005');
  });

  it('renders `notSureDatesSummary` when `view:notSure` was selected', () => {
    const formData = {
      toxicExposure: {
        otherExposuresDetails: {
          mustardgas: {
            'view:notSure': true,
          },
          water: {
            'view:notSure': true,
          },
          asbestos: {},
          chemical: {},
          mos: {},
          radiation: {},
        },
        'view:otherExposuresAdditionalInfo': {},
        otherExposures: {
          water: true,
          mustardgas: true,
        },
      },
    };

    const { getAllByText, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(additionalExposuresPageTitle);
    getByText('Summary');
    getByText(ADDITIONAL_EXPOSURES.water);
    getByText(ADDITIONAL_EXPOSURES.mustardgas);
    expect(getAllByText(notSureDatesSummary).length).to.equal(2);
  });
});
