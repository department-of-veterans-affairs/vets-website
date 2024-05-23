import { expect } from 'chai';
import { hasFormChanged } from '../../helpers';

describe('hasFormChanged', () => {
  it('should returns true if a non-fullName field is not undefined and has changed', () => {
    const obj = { fullName: 'John Doe', age: 31 };
    const applicantName = 'John Doe';
    expect(hasFormChanged(obj, applicantName)).to.be.true;
  });

  it('should returns true if fullName field does not match the applicantName', () => {
    const obj = { fullName: 'Jane Doe' };
    const applicantName = 'John Doe';
    expect(hasFormChanged(obj, applicantName)).to.be.true;
  });

  it('should returns false if all fields are undefined except fullName which matches the applicantName', () => {
    const obj = { fullName: 'John Doe', age: undefined };
    const applicantName = 'John Doe';
    expect(hasFormChanged(obj, applicantName)).to.be.false;
  });

  it('should returns true if both fullName and another field change', () => {
    const obj = { fullName: 'Jane Doe', age: 32 };
    const applicantName = 'John Doe';
    expect(hasFormChanged(obj, applicantName)).to.be.true;
  });

  it('should returns false if non-fullName fields are undefined and fullName matches applicantName', () => {
    const obj = { fullName: 'John Doe', age: undefined, location: undefined };
    const applicantName = 'John Doe';
    expect(hasFormChanged(obj, applicantName)).to.be.false;
  });
});
