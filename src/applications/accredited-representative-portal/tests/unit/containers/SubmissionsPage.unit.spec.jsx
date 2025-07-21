import { expect } from 'chai';
import SubmissionsPage from '../../../containers/SubmissionsPage';

describe('SubmissionsPage', () => {
  it('has the correct upload link href', () => {
    expect(SubmissionsPage).to.exist;
    expect(typeof SubmissionsPage).to.eq('function');
  });

  it('loader function exists', () => {
    expect(SubmissionsPage.loader).to.exist;
    expect(typeof SubmissionsPage.loader).to.eq('function');
  });

  it('contains upload link reference', () => {
    const componentString = SubmissionsPage.toString();
    expect(componentString).to.include(
      '/representative/representative-form-upload/21-686c',
    );
    expect(componentString).to.include('Upload and submit VA Form 21-686c');
  });
});
