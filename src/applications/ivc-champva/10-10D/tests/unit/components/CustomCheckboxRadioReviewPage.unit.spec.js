import React from 'react';
import { CustomCheckboxRadioReviewPage } from '../../../../shared/components/CustomCheckboxRadioReviewPage';
import { testComponentRender } from '../../../../shared/tests/pages/pageTests.spec';
import mockData from '../../e2e/fixtures/data/test-data.json';
import { generateOptions } from '../../../pages/ApplicantMedicareStatusPage';

testComponentRender(
  'CustomCheckboxRadioReviewPage',
  <CustomCheckboxRadioReviewPage
    data={mockData.data}
    pagePerItemIndex={0}
    title={() => {}}
    generateOptions={generateOptions}
  />,
);
