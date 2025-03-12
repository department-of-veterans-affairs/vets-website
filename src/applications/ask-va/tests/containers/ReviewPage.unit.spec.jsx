// import * as platformHelpers from '@department-of-veterans-affairs/platform-forms-system/helpers';
// import * as platformSelectors from '@department-of-veterans-affairs/platform-forms-system/selectors';
// import { render } from '@testing-library/react';
// import { expect } from 'chai';
// import React from 'react';
// import { Provider } from 'react-redux';
// import sinon from 'sinon';
// import ReviewPage from '../../containers/ReviewPage';
// import { getFileSize } from '../../utils/helpers';
// import {
//   getPageKeysForReview,
//   removeDuplicatesByChapterAndPageKey,
// } from '../../utils/reviewPageHelper';
// import {
//   getSchoolString,
//   getYesOrNoFromBool,
// } from '../../utils/reviewPageUtils';
// import { mockData } from '../fixtures/data/form-data-review';
// import { getData } from '../fixtures/data/mock-form-data';
// import {
//   expandedPages,
//   form,
//   pageKeys,
//   pageList,
//   viewedPages,
// } from '../fixtures/data/reviewPageQuestionCollapsible';

// // Create sandbox for sinon stubs
// const sandbox = sinon.createSandbox();

// // Mock platform helpers
// sandbox.stub(platformHelpers, 'getActiveExpandedPages').returns([]);
// sandbox.stub(platformSelectors, 'getViewedPages').returns(new Set());

// // Mock VA components
// const MockVaAccordion = props => (
//   <div data-testid="va-accordion">{props.children}</div>
// );
// const MockVaAccordionItem = props => (
//   <div data-testid="va-accordion-item">{props.children}</div>
// );
// const MockVaAlert = props => <div data-testid="va-alert">{props.children}</div>;
// const MockVaButton = props => (
//   <button data-testid="va-button" onClick={props.onClick}>
//     {props.text}
//   </button>
// );

// // Mock the component library
// sandbox.stub(
//   require('@department-of-veterans-affairs/component-library/dist/react-bindings'),
//   {
//     VaAccordion: MockVaAccordion,
//     VaAccordionItem: MockVaAccordionItem,
//     VaAlert: MockVaAlert,
//     VaButton: MockVaButton,
//   },
// );

// describe('Helper Functions', () => {
//   describe('getFileSize', () => {
//     it('should format bytes correctly', () => {
//       expect(getFileSize(100)).to.equal('100 B');
//     });

//     it('should format kilobytes correctly', () => {
//       expect(getFileSize(1500)).to.equal('1 KB');
//       expect(getFileSize(2048)).to.equal('2 KB');
//     });

//     it('should format megabytes correctly', () => {
//       expect(getFileSize(1500000)).to.equal('1.5 MB');
//       expect(getFileSize(2048000)).to.equal('2.0 MB');
//     });

//     it('should handle edge cases', () => {
//       expect(getFileSize(0)).to.equal('0 B');
//       expect(getFileSize(999)).to.equal('999 B');
//       expect(getFileSize(1000)).to.equal('1 KB');
//       expect(getFileSize(999999)).to.equal('999 KB');
//       expect(getFileSize(1000000)).to.equal('1.0 MB');
//     });
//   });

//   describe('removeDuplicatesByChapterAndPageKey', () => {
//     it('should remove duplicates based on chapter and page key', () => {
//       const input = [
//         { chapter: 'ch1', pageKey: 'page1' },
//         { chapter: 'ch1', pageKey: 'page1' },
//         { chapter: 'ch2', pageKey: 'page2' },
//       ];
//       const result = removeDuplicatesByChapterAndPageKey(input);
//       expect(result).to.have.lengthOf(2);
//       expect(result).to.deep.equal([
//         { chapter: 'ch1', pageKey: 'page1' },
//         { chapter: 'ch2', pageKey: 'page2' },
//       ]);
//     });

//     it('should handle empty input', () => {
//       const result = removeDuplicatesByChapterAndPageKey([]);
//       expect(result).to.have.lengthOf(0);
//     });

//     it('should handle input with no duplicates', () => {
//       const input = [
//         { chapter: 'ch1', pageKey: 'page1' },
//         { chapter: 'ch2', pageKey: 'page2' },
//       ];
//       const result = removeDuplicatesByChapterAndPageKey(input);
//       expect(result).to.have.lengthOf(2);
//       expect(result).to.deep.equal(input);
//     });
//   });

//   describe('getPageKeysForReview', () => {
//     it('should extract page keys from config', () => {
//       const config = {
//         chapters: {
//           chapter1: {
//             pages: {
//               page1: { title: 'Page 1' },
//               page2: { title: 'Page 2' },
//             },
//           },
//           chapter2: {
//             pages: {
//               page3: { title: 'Page 3' },
//             },
//           },
//         },
//       };

//       const result = getPageKeysForReview(config);
//       expect(result).to.deep.equal(['page1', 'page2', 'page3']);
//     });

//     it('should handle empty config', () => {
//       const config = {
//         chapters: {},
//       };
//       const result = getPageKeysForReview(config);
//       expect(result).to.deep.equal([]);
//     });

//     it('should handle config with empty chapters', () => {
//       const config = {
//         chapters: {
//           chapter1: {
//             pages: {},
//           },
//           chapter2: {
//             pages: {},
//           },
//         },
//       };
//       const result = getPageKeysForReview(config);
//       expect(result).to.deep.equal([]);
//     });
//   });

//   describe('getYesOrNoFromBool', () => {
//     it('should return "Yes" for true', () => {
//       expect(getYesOrNoFromBool(true)).to.equal('Yes');
//     });

//     it('should return "No" for false', () => {
//       expect(getYesOrNoFromBool(false)).to.equal('No');
//     });
//   });

//   describe('getSchoolString', () => {
//     it('should combine school code and name', () => {
//       const schoolCode = '12345';
//       const schoolName = 'Test University';
//       expect(getSchoolString(schoolCode, schoolName)).to.equal(
//         '12345 - Test University',
//       );
//     });

//     it('should return null if school name is missing', () => {
//       const schoolCode = '12345';
//       expect(getSchoolString(schoolCode)).to.be.null;
//     });

//     it('should return null if school code is missing', () => {
//       const schoolName = 'Test University';
//       expect(getSchoolString(undefined, schoolName)).to.be.null;
//     });

//     it('should return null if either value is null', () => {
//       expect(getSchoolString('12345', null)).to.be.null;
//       expect(getSchoolString(null, 'Test University')).to.be.null;
//     });
//   });

//   afterEach(() => {
//     sandbox.restore();
//   });
// });

// describe('ReviewPage', () => {
//   let store;

//   beforeEach(() => {
//     store = getData({
//       loggedIn: true,
//       isVerified: true,
//       loaLevel: 3,
//       data: mockData.data,
//       askVA: mockData.askVA,
//     }).mockStore;
//   });

//   afterEach(() => {
//     sandbox.restore();
//   });

//   it('should render the component', () => {
//     const props = {
//       router: {
//         push: sinon.spy(),
//       },
//       goBack: sinon.spy(),
//       goForward: sinon.spy(),
//       setData: sinon.spy(),
//       setEditMode: sinon.spy(),
//       setViewedPages: sinon.spy(),
//       onSetData: sinon.spy(),
//       loggedIn: true,
//       isUserLOA3: true,
//       chapters: mockData.chapters,
//       form,
//       formData: mockData.data,
//       expandedPages,
//       pageList,
//       pageKeys,
//       viewedPages,
//     };

//     const { getByTestId } = render(
//       <Provider store={store}>
//         <ReviewPage {...props} />
//       </Provider>,
//     );

//     expect(getByTestId('review-page')).to.exist;
//     expect(getByTestId('review-alert')).to.exist;
//   });
// });
