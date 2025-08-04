import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router-dom';
import Pagination from '../../../components/Pagination';

describe('Pagination component', () => {
  let sandbox;
  let navigateStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    navigateStub = sandbox.stub();
    sandbox.stub(router, 'useNavigate').returns(navigateStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders va-pagination with expected defaults', () => {
    const { container } = render(
      <MemoryRouter>
        <Pagination meta={{ number: 1, totalPages: 10 }} />
      </MemoryRouter>,
    );

    const pagination = container.querySelector('va-pagination');
    expect(pagination).to.exist;
    expect(pagination.getAttribute('page')).to.equal('1');
    expect(pagination.getAttribute('pages')).to.equal('10');

    const maxLength = pagination.getAttribute('max-page-list-length');
    expect(['0', null]).to.include(maxLength);
  });
});
