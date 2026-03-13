import React from 'react';
import ProcessList from '../shared/ProcessList';
import { refillProcessStepGuideV2 } from '../../util/processListData';

const InProgressMedicationsEmptyView = () => (
  <>
    <div className="vads-u-padding-y--3 vads-u-border-bottom--1px vads-u-border-color--gray-light">
      <va-card background data-testid="in-progress-empty-view-card">
        <div>
          <h2 className="vads-u-margin--0 vads-u-font-size--h3">
            You don’t have any in-progress medications right now
          </h2>
          <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
            If you have questions about a prescription, contact your care team.
          </p>
        </div>
      </va-card>
    </div>
    <ProcessList stepGuideProps={refillProcessStepGuideV2} />
  </>
);

export default InProgressMedicationsEmptyView;
