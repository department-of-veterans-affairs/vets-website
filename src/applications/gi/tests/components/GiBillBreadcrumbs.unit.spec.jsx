import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import * as WebComp from '@department-of-veterans-affairs/web-components/react-bindings';
import GiBillBreadcrumbs from '../../components/GiBillBreadcrumbs';
import { formatProgramType } from '../../utils/helpers';

//  overwrite VaBreadcrumbs with a simple React stub
WebComp.VaBreadcrumbs = ({ breadcrumbList }) => (
  <nav aria-label="breadcrumb">
    {breadcrumbList.map(({ href, label }, i) => (
      <a key={i} href={href}>
        {label}
      </a>
    ))}
  </nav>
);

const defaultStore = createCommonStore();

describe('CT Breadcrumbs', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('Renders', () => {
    const { findByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter>
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );
    expect(findByText('GI Bill® Comparison Tool')).to.exist;
  });
  it('renders institution breadcrumb when path matches /institution/:facilityCode', () => {
    const facilityCode = '12345';
    localStorage.setItem('institutionName', 'New York State University');

    const { getByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter initialEntries={[`/institution/${facilityCode}`]}>
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );

    const crumb = getByText('New York State University');
    expect(crumb).to.exist;
    expect(crumb.closest('a')).to.have.attribute(
      'href',
      `/education/gi-bill-comparison-tool/institution/${facilityCode}`,
    );
  });

  it('renders schools-and-employers breadcrumb when path matches /schools-and-employers/institution/:facilityCode', () => {
    const facilityCode = '67890';
    localStorage.setItem('institutionName', 'New York State University');

    const { getByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter
          initialEntries={[
            `/schools-and-employers/institution/${facilityCode}`,
          ]}
        >
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );

    const crumb = getByText('New York State University');
    expect(crumb).to.exist;
    expect(crumb.closest('a')).to.have.attribute(
      'href',
      `/education/gi-bill-comparison-tool/schools-and-employers/institution/${facilityCode}`,
    );
  });
  it('renders national exams breadcrumb when path matches /national-exams', () => {
    const { getByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter initialEntries={['/national-exams']}>
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );

    const crumb = getByText('National exams');
    expect(crumb).to.exist;
    expect(crumb.closest('a')).to.have.attribute(
      'href',
      '/education/gi-bill-comparison-tool/national-exams',
    );
  });
  it('renders national exam detail breadcrumb when path matches /national-exams/:examId without query', () => {
    const examId = 'exam123';
    const { getByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter initialEntries={[`/national-exams/${examId}`]}>
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );

    const crumb = getByText('National exam details');
    expect(crumb).to.exist;
    expect(crumb.closest('a')).to.have.attribute(
      'href',
      '/education/gi-bill-comparison-tool/national-exams',
    );
  });

  it('renders national exam detail breadcrumb when examName query is provided', () => {
    const examId = 'exam456';
    const examName = 'My Exam';
    const path = `/national-exams/${examId}?examName=${encodeURIComponent(
      examName,
    )}`;

    const { getByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter initialEntries={[path]}>
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );

    const crumb = getByText(examName);
    expect(crumb).to.exist;
    expect(crumb.closest('a')).to.have.attribute(
      'href',
      '/education/gi-bill-comparison-tool/national-exams',
    );
  });

  it('renders program type breadcrumb when path matches /institution/:facilityCode/:programType', () => {
    const code = 'ABC';
    const type = 'undergrad';
    const formatted = formatProgramType(type);

    const { getByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter initialEntries={[`/institution/${code}/${type}`]}>
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );

    const label = `${formatted} programs`;
    const crumb = getByText(label);
    expect(crumb).to.exist;
    expect(crumb.closest('a')).to.have.attribute(
      'href',
      `/institution/${code}/${type}`,
    );
  });

  it('renders schools-and-employers program type breadcrumb when path matches /schools-and-employers/institution/:facilityCode/:programType', () => {
    const code = 'XYZ';
    const type = 'cert';
    const formatted = formatProgramType(type);

    const { getByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter
          initialEntries={[
            `/schools-and-employers/institution/${code}/${type}`,
          ]}
        >
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );

    const label = `${formatted} programs`;
    const crumb = getByText(label);
    expect(crumb).to.exist;
    expect(crumb.closest('a')).to.have.attribute(
      'href',
      `/schools-and-employers/institution/${code}/${type}`,
    );
  });

  it('renders institution comparison breadcrumb when URL contains /compare', () => {
    const { getByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter initialEntries={['/some/path/compare']}>
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );

    const crumb = getByText('Institution comparison');
    expect(crumb).to.exist;
    expect(crumb.closest('a')).to.have.attribute('href', '/');
  });

  it('renders licenses, certifications, and prep courses breadcrumb when path matches /licenses-certifications-and-prep-courses', () => {
    const { getByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter
          initialEntries={['/licenses-certifications-and-prep-courses']}
        >
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );

    const crumb = getByText('Licenses, certifications, and prep courses');
    expect(crumb).to.exist;
    expect(crumb.closest('a')).to.have.attribute(
      'href',
      '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses',
    );
  });

  it('renders search results breadcrumb when path matches /licenses-certifications-and-prep-courses/results', () => {
    const { getByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter
          initialEntries={['/licenses-certifications-and-prep-courses/results']}
        >
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );

    const crumb = getByText('Search results');
    expect(crumb).to.exist;
    expect(crumb.closest('a')).to.have.attribute(
      'href',
      '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results',
    );
  });

  it('renders license result detail breadcrumb when path matches /licenses-certifications-and-prep-courses/results/:id/:name', () => {
    const id = '789';
    const name = 'License X';
    const path = `/licenses-certifications-and-prep-courses/results/${id}/${encodeURIComponent(
      name,
    )}`;

    const { getByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter initialEntries={[path]}>
          <GiBillBreadcrumbs />
        </MemoryRouter>
      </Provider>,
    );

    const crumb = getByText(name);
    expect(crumb).to.exist;
  });
});
