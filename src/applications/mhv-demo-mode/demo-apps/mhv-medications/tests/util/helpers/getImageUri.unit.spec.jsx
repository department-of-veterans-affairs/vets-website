import { expect } from 'chai';
import { getImageUri } from '../../../util/helpers';
import { imageRootUri } from '../../../util/constants';

describe('Image URI function', () => {
  it('should return the URI', () => {
    expect(getImageUri('1test')).to.equal(`${imageRootUri}1/NDC1test.jpg`);
  });

  it('should support OTHER folder', () => {
    expect(getImageUri()).to.equal(`${imageRootUri}other/NDCundefined.jpg`);
  });
});
