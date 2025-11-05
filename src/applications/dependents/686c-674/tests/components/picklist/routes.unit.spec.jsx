import { expect } from 'chai';

import { getPicklistRoutes } from '../../../components/picklist/routes';
import { PICKLIST_DATA } from '../../../config/constants';

describe('getPicklistRoutes', () => {
  const routes = {
    Spouse: [
      { path: 's1', page: { handlers: { goForward: () => 's2' } } },
      { path: 's2', page: { handlers: { goForward: () => 'DONE' } } },
    ],
    Child: [
      { path: 'c1', page: { handlers: { goForward: () => 'c2' } } },
      {
        path: 'c2',
        page: {
          handlers: {
            goForward: ({ itemData }) => (itemData.c2 ? 'c3' : 'c4'),
          },
        },
      },
      {
        path: 'c3',
        page: {
          handlers: {
            goForward: ({ itemData }) => (itemData.c3 ? 'c4' : 'DONE'),
          },
        },
      },
      { path: 'c4', page: { handlers: { goForward: () => 'DONE' } } },
    ],
    Parent: [
      { path: 'p1', page: { handlers: { goForward: () => 'p2' } } },
      {
        path: 'p2',
        page: {
          handlers: {
            goForward: ({ itemData }) => (itemData.p2 ? 'p3' : 'p4'),
          },
        },
      },
      {
        path: 'p3',
        page: { handlers: { goForward: () => 'p4' } },
      },
      {
        path: 'p4',
        page: {
          handlers: {
            goForward: ({ itemData }) => (itemData.p4 ? 'p5' : 'DONE'),
          },
        },
      },
      {
        path: 'p5',
        page: {
          handlers: {
            goForward: ({ itemData }) => (itemData.p5 ? 'p6' : 'DONE'),
          },
        },
      },
      {
        path: 'p6',
        page: { handlers: { goForward: () => 'DONE' } },
      },
    ],
  };

  const getData = ({
    spouse = false,
    child = false,
    parent = false,
    data = {},
  } = {}) => ({
    [PICKLIST_DATA]: [
      { relationshipToVeteran: 'Spouse', selected: spouse, ...data },
      { relationshipToVeteran: 'Child', selected: child, ...data },
      { relationshipToVeteran: 'Parent', selected: parent, ...data },
    ],
  });

  it('should return empty array if no dependents selected', () => {
    const result = getPicklistRoutes(getData(), routes);
    expect(result).to.deep.equal([]);
  });

  it('should not include routes that aren’t navigated to', () => {
    const brokenRoutes = {
      Spouse: [
        { path: 's1', page: { handlers: { goForward: () => 's3' } } },
        { path: 's2', page: { handlers: { goForward: () => 'DONE' } } },
      ],
    };
    const result = getPicklistRoutes(getData({ spouse: true }), brokenRoutes);
    expect(result).to.deep.equal([
      { index: 0, path: 's1', type: 'Spouse' },
      { index: 0, path: 's3', type: 'Spouse' }, // s3 doesn't exist in routes
    ]);
  });

  it('should return linear spouse route', () => {
    const fullData = getData({ spouse: true });
    const result = getPicklistRoutes(fullData, routes);
    expect(result).to.deep.equal([
      { type: 'Spouse', path: 's1', index: 0 },
      { type: 'Spouse', path: 's2', index: 0 },
    ]);
  });

  it('should return conditional child route', () => {
    const fullData = getData({ child: true, data: { c2: true, c3: false } });
    const result = getPicklistRoutes(fullData, routes);
    expect(result).to.deep.equal([
      { type: 'Child', path: 'c1', index: 1 },
      { type: 'Child', path: 'c2', index: 1 },
      { type: 'Child', path: 'c3', index: 1 },
    ]);
  });

  it('should return 2 conditional child route', () => {
    const fullData = getData({ child: true, data: { c2: false, c3: true } });
    const result = getPicklistRoutes(fullData, routes);
    expect(result).to.deep.equal([
      { type: 'Child', path: 'c1', index: 1 },
      { type: 'Child', path: 'c2', index: 1 },
      { type: 'Child', path: 'c4', index: 1 },
    ]);
  });

  it('should return 4 conditional child route', () => {
    const fullData = getData({ child: true, data: { c2: true, c3: true } });
    const result = getPicklistRoutes(fullData, routes);
    expect(result).to.deep.equal([
      { type: 'Child', path: 'c1', index: 1 },
      { type: 'Child', path: 'c2', index: 1 },
      { type: 'Child', path: 'c3', index: 1 },
      { type: 'Child', path: 'c4', index: 1 },
    ]);
  });

  it('should return 3 complex conditional parent route', () => {
    const fullData = getData({ parent: true });
    const result = getPicklistRoutes(fullData, routes);
    expect(result).to.deep.equal([
      { type: 'Parent', path: 'p1', index: 2 },
      { type: 'Parent', path: 'p2', index: 2 },
      { type: 'Parent', path: 'p4', index: 2 },
    ]);
  });

  it('should return 4 complex conditional parent route', () => {
    const fullData = getData({
      parent: true,
      data: { p2: true, p4: false },
    });
    const result = getPicklistRoutes(fullData, routes);
    expect(result).to.deep.equal([
      { type: 'Parent', path: 'p1', index: 2 },
      { type: 'Parent', path: 'p2', index: 2 },
      { type: 'Parent', path: 'p3', index: 2 },
      { type: 'Parent', path: 'p4', index: 2 },
    ]);
  });

  it('should return 5 complex conditional parent route', () => {
    const fullData = getData({
      parent: true,
      data: { p2: true, p4: true, p5: true },
    });
    const result = getPicklistRoutes(fullData, routes);
    expect(result).to.deep.equal([
      { type: 'Parent', path: 'p1', index: 2 },
      { type: 'Parent', path: 'p2', index: 2 },
      { type: 'Parent', path: 'p3', index: 2 },
      { type: 'Parent', path: 'p4', index: 2 },
      { type: 'Parent', path: 'p5', index: 2 },
      { type: 'Parent', path: 'p6', index: 2 },
    ]);
  });

  it('should return truncated complex conditional parent route', () => {
    const fullData = getData({
      parent: true,
      data: { p2: false },
    });
    const result = getPicklistRoutes(fullData, routes);
    expect(result).to.deep.equal([
      { type: 'Parent', path: 'p1', index: 2 },
      { type: 'Parent', path: 'p2', index: 2 },
      { type: 'Parent', path: 'p4', index: 2 },
    ]);
  });

  it('should return full dependents route', () => {
    const fullData = getData({
      spouse: true,
      child: true,
      parent: true,
      data: { c2: true, c3: true, p2: true, p4: true, p5: true },
    });
    const result = getPicklistRoutes(fullData, routes);
    expect(result).to.deep.equal([
      { type: 'Spouse', path: 's1', index: 0 },
      { type: 'Spouse', path: 's2', index: 0 },
      { type: 'Child', path: 'c1', index: 1 },
      { type: 'Child', path: 'c2', index: 1 },
      { type: 'Child', path: 'c3', index: 1 },
      { type: 'Child', path: 'c4', index: 1 },
      { type: 'Parent', path: 'p1', index: 2 },
      { type: 'Parent', path: 'p2', index: 2 },
      { type: 'Parent', path: 'p3', index: 2 },
      { type: 'Parent', path: 'p4', index: 2 },
      { type: 'Parent', path: 'p5', index: 2 },
      { type: 'Parent', path: 'p6', index: 2 },
    ]);
  });
});
