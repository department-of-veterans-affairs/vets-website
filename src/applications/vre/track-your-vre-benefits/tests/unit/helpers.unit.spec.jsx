import { expect } from 'chai';
import sinon from 'sinon';
import {
  extractMessages,
  getStatus,
  getCurrentStepFromStateList,
  downloadPdfBlob,
} from '../../helpers';

describe('helpers', () => {
  it('extractMessages returns a prioritized message list', () => {
    expect(
      extractMessages({
        errors: [{ code: 'ERR_CODE', title: 'Title', detail: 'Detail' }],
      }),
    ).to.deep.equal(['ERR_CODE']);
    expect(extractMessages({ errors: [] })).to.deep.equal(['Unknown error']);
  });

  it('getStatus coerces numeric statuses and falls back to null', () => {
    expect(getStatus({ errors: [{ status: '503' }] })).to.equal(503);
    expect(getStatus({ errors: [{ status: 'abc' }] })).to.equal(null);
  });

  it('getCurrentStepFromStateList prefers ACTIVE, then PENDING, else total', () => {
    expect(
      getCurrentStepFromStateList(
        [{ status: 'COMPLETE' }, { status: 'ACTIVE' }],
        7,
      ),
    ).to.equal(2);
    expect(
      getCurrentStepFromStateList(
        [{ status: 'COMPLETE' }, { status: 'PENDING' }],
        7,
      ),
    ).to.equal(2);
    expect(getCurrentStepFromStateList([{ status: 'COMPLETE' }], 7)).to.equal(
      7,
    );
  });

  it('downloadPdfBlob creates a link and cleans up', () => {
    const mockLink = { href: '', download: '', click: sinon.stub() };
    const createObjectURLStub = sinon
      .stub(URL, 'createObjectURL')
      .returns('blob:mock-url');
    const revokeObjectURLStub = sinon.stub(URL, 'revokeObjectURL');
    const createElementStub = sinon
      .stub(document, 'createElement')
      .returns(mockLink);
    const appendChildStub = sinon.stub(document.body, 'appendChild');
    const removeChildStub = sinon.stub(document.body, 'removeChild');

    downloadPdfBlob(new Blob(['pdf content']), 'test.pdf');

    expect(createObjectURLStub.calledOnce).to.be.true;
    expect(createElementStub.calledWith('a')).to.be.true;
    expect(mockLink.click.calledOnce).to.be.true;
    expect(appendChildStub.calledWith(mockLink)).to.be.true;
    expect(removeChildStub.calledWith(mockLink)).to.be.true;
    expect(revokeObjectURLStub.calledWith('blob:mock-url')).to.be.true;

    createObjectURLStub.restore();
    revokeObjectURLStub.restore();
    createElementStub.restore();
    appendChildStub.restore();
    removeChildStub.restore();
  });
});
