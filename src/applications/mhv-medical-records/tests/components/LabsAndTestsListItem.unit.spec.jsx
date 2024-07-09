import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';
import labsAndTests from '../fixtures/labsAndTestsOneOfEachType.json';
import { recordType } from '../../util/constants';

describe('LabsAndTestsListItem component', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: labsAndTests,
        labsAndTestsDetails: convertLabsAndTestsRecord(labsAndTests.entry[0]),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordListItem
        record={convertLabsAndTestsRecord(labsAndTests.entry[0])}
        type={recordType.LABS_AND_TESTS}
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen.getAllByText('Potassium, Sodium', { exact: true })[0]).to
      .exist;
  });

  it('should contain the name of the record', () => {
    const recordName = screen.getAllByText('Potassium, Sodium', {
      exact: true,
    })[0];
    expect(recordName).to.exist;
  });

  it('should contain the date of the record', () => {
    const date = screen.getAllByText('January 20, 2021, 4:38 p.m.', {
      exact: false,
    });
    expect(date.length).to.eq(2);
  });

  it('should contain a link to view record details', () => {
    const recordDetailsLink = screen.getByText('Potassium, Sodium', {
      selector: 'a',
      exact: true,
    });
    expect(recordDetailsLink).to.exist;
  });
});

describe('LabsAndTestsListItem component with chem/hem record', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: labsAndTests,
        labsAndTestsDetails: convertLabsAndTestsRecord(labsAndTests.entry[0]),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordListItem
        record={convertLabsAndTestsRecord(labsAndTests.entry[0])}
        type={recordType.LABS_AND_TESTS}
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests',
      },
    );
  });

  it('should display the name of the record as a link to view record details', () => {
    const recordName = screen.getAllByText('Potassium, Sodium', {
      selector: 'a',
      exact: true,
    })[0];
    expect(recordName).to.exist;
  });

  it('should display the date of the record', () => {
    const date = screen.getByText('January 20, 2021, 4:38 p.m.', {
      selector: 'div',
      exact: true,
    });
    expect(date).to.exist;
  });

  it('should display who ordered the lab or test', () => {
    const date = screen.getByText('Ordered by DOE, JANE A', {
      selector: 'div',
      exact: true,
    });
    expect(date).to.exist;
  });
});

describe('LabsAndTestsListItem component with microbiology record', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: labsAndTests,
        labsAndTestsDetails: convertLabsAndTestsRecord(labsAndTests.entry[5]),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordListItem
        record={convertLabsAndTestsRecord(labsAndTests.entry[5])}
        type={recordType.LABS_AND_TESTS}
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests',
      },
    );
  });

  it('should display the name of the record as a link to view record details', () => {
    const recordName = screen.getAllByText('Microbiology', {
      selector: 'a',
      exact: true,
    })[0];
    expect(recordName).to.exist;
  });

  it('should display the date of the record', () => {
    const date = screen.getAllByText('January 20, 2021, 4:38 p.m.', {
      selector: 'div',
      exact: true,
    });
    expect(date).to.exist;
  });

  it('should display who ordered the lab or test', () => {
    const orderedBy = screen.getByText('Ordered by DOE, JANE A', {
      selector: 'div',
      exact: true,
    });
    expect(orderedBy).to.exist;
  });
});

describe('LabsAndTestsListItem component with pathology record', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: labsAndTests,
        labsAndTestsDetails: convertLabsAndTestsRecord(labsAndTests.entry[2]),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordListItem
        record={convertLabsAndTestsRecord(labsAndTests.entry[2])}
        type={recordType.LABS_AND_TESTS}
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests',
      },
    );
  });

  it('should display the name of the record as a link to view record details', () => {
    const recordName = screen.getAllByText('LR SURGICAL PATHOLOGY REPORT', {
      selector: 'a',
      exact: true,
    })[0];
    expect(recordName).to.exist;
  });

  it('should display the date of the record', () => {
    const date = screen.getByText('August 10, 2000, 3:56 p.m.', {
      selector: 'div',
      exact: true,
    });
    expect(date).to.exist;
  });

  it('should not display who ordered the lab or test', () => {
    const date = screen.findByText('Ordered by', {
      selector: 'div',
      exact: false,
    });
    expect(Object.keys(date).length).to.eq(0);
  });
});

describe('LabsAndTestsListItem component with radiology record', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: labsAndTests,
        labsAndTestsDetails: convertLabsAndTestsRecord(labsAndTests.entry[3]),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordListItem
        record={convertLabsAndTestsRecord(labsAndTests.entry[3])}
        type={recordType.LABS_AND_TESTS}
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests',
      },
    );
  });

  it('should display the name of the record as a link to view record details', () => {
    const recordName = screen.getAllByText(
      'RADIOLOGIC EXAMINATION, SPINE, LUMBOSACRAL; 2 OR 3 VIEWS',
      {
        selector: 'a',
        exact: true,
      },
    )[0];
    expect(recordName).to.exist;
  });

  it('should display the date of the record', () => {
    const date = screen.getByText('September 24, 2004, 11:25 a.m.', {
      selector: 'div',
      exact: true,
    });
    expect(date).to.exist;
  });

  it('should display who ordered the lab or test', () => {
    const date = screen.getByText('Ordered by DOE, JOHN A', {
      selector: 'div',
      exact: true,
    });
    expect(date).to.exist;
  });
});
