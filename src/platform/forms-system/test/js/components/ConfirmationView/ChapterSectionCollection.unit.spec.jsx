/* eslint-disable no-unused-vars */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
  addressSchema,
  addressUI,
  checkboxGroupSchema,
  checkboxGroupUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  radioSchema,
  radioUI,
  selectSchema,
  selectUI,
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
  textSchema,
  textUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  buildFields,
  ChapterSectionCollection,
  getChapterTitle,
  reviewEntry,
} from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';

const mockChapterRadio = {
  title: 'Radio chapter',
  pages: {
    radioPage: {
      title: 'Radio page title',
      pageKey: 'radioPage',
      uiSchema: {
        widgetRadio: {
          'ui:title': 'Widget radio',
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              widgetRadioOption1: 'Widget radio option 1',
              widgetRadioOption2: 'Widget radio option 2',
            },
          },
        },
        webComponentRadio: radioUI({
          title: 'Web component radio',
          labels: {
            webComponentRadioOption1: 'Web component radio option 1',
            webComponentRadioOption2: 'Web component radio option 2',
          },
        }),
        webComponentYesNo: yesNoUI('Web component yes/no'),
      },
      schema: {
        type: 'object',
        properties: {
          widgetRadio: {
            type: 'string',
            enum: ['widgetRadioOption1', 'widgetRadioOption2'],
          },
          webComponentRadio: radioSchema([
            'webComponentRadioOption1',
            'webComponentRadioOption2',
          ]),
          webComponentYesNo: yesNoSchema,
        },
      },
    },
  },
};

const mockRedux = ({ formData = {} } = {}) => {
  return {
    props: {
      onChange: () => {},
      formContext: {
        onReviewPage: false,
        reviewMode: false,
        submitted: true,
      },
      formData,
      setFormData: () => {},
    },
    mockStore: {
      getState: () => ({
        form: { data: formData },
        formContext: {
          onReviewPage: false,
          reviewMode: false,
          submitted: true,
          touched: {},
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  };
};

const mockChapterRadioData = {
  widgetRadio: 'widgetRadioOption1',
  webComponentRadio: 'webComponentRadioOption1',
  webComponentYesNo: true,
};

const mockChapterText = {
  title: 'Text chapter',
  pages: {
    textPage: {
      title: 'Text page',
      pageKey: 'textPage',
      uiSchema: {
        text: {
          'ui:title': 'Text field',
        },
        webComponentText: textUI({
          title: 'Web component text',
        }),
      },
      schema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
          },
          webComponentText: textSchema,
        },
      },
    },
    identificationPage: {
      title: 'Identification page',
      pageKey: 'identificationPage',
      uiSchema: {
        webComponentSsnVaId: ssnOrVaFileNumberNoHintUI(),
      },
      schema: {
        type: 'object',
        properties: {
          webComponentSsnVaId: ssnOrVaFileNumberNoHintSchema,
        },
        required: ['webComponentSsnVaId'],
      },
    },
  },
};

const mockChapterTextData = {
  text: 'Text field value',
  webComponentText: 'Web component text value',
  webComponentSsnVaId: {
    ssn: '123456789',
    vaFileNumber: '987654321',
  },
};

const mockChapterCheckboxGroup = {
  title: 'Checkbox group chapter',
  pages: {
    checkboxGroupPage: {
      title: 'Checkbox group page',
      pageKey: 'checkboxGroupPage',
      uiSchema: {
        checkboxGroup: checkboxGroupUI({
          title: 'Checkbox group',
          required: false,
          labels: {
            hasA: 'Option A',
            hasB: 'Option B',
          },
        }),
      },
      schema: {
        type: 'object',
        properties: {
          checkboxGroup: checkboxGroupSchema(['hasA', 'hasB']),
        },
      },
    },
  },
};

const mockChapterCheckboxGroupData = {
  checkboxGroup: {
    hasA: true,
    hasB: true,
  },
};

const mockChapterSelect = {
  title: 'Select chapter',
  pages: {
    selectPage: {
      title: 'Select page',
      pageKey: 'selectPage',
      uiSchema: {
        widgetSelect: {
          'ui:title': 'Widget select',
          'ui:widget': 'select',
          'ui:options': {
            placeholder: 'Select',
          },
        },
        webComponentSelect: selectUI('Web component select'),
      },
      schema: {
        type: 'object',
        properties: {
          widgetSelect: {
            type: 'string',
            enum: ['Option 1', 'Option 2'],
          },
          webComponentSelect: selectSchema(['Option 1', 'Option 2']),
        },
      },
    },
  },
};

const mockChapterSelectData = {
  widgetSelect: 'Option 1',
  webComponentSelect: 'Option 2',
};

const mockChapterDate = {
  title: 'Date chapter',
  pages: {
    datePage: {
      title: 'Date page',
      pageKey: 'datePage',
      uiSchema: {
        widgetDate: {
          'ui:title': 'Widget date',
          'ui:widget': 'date',
        },
        webComponentDate: currentOrPastDateUI('Web component date'),
        webComponentDateRange: currentOrPastDateRangeUI(
          'Date range start',
          'Date range end',
        ),
      },
      schema: {
        type: 'object',
        properties: {
          widgetDate: {
            type: 'string',
            format: 'date',
          },
          webComponentDate: currentOrPastDateSchema,
          webComponentDateRange: currentOrPastDateRangeSchema,
        },
      },
    },
  },
};

const mockChapterDateData = {
  widgetDate: '2020-01-01',
  webComponentDate: '2022-02-02',
  webComponentDateRange: {
    from: '2023-01-01',
    to: '2024-01-01',
  },
};

const mockChapterAddress = {
  title: 'Address chapter',
  pages: {
    addressPage: {
      title: 'Address page',
      pageKey: 'addressPage',
      uiSchema: {
        address: addressUI(),
      },
      schema: {
        type: 'object',
        properties: {
          address: addressSchema(),
        },
      },
    },
  },
};

const mockChapterAddressData = {
  address: {
    country: 'USA',
    city: 'Chicago',
    state: 'IL',
    street: '123 Main St',
    street2: 'Apt 1',
    postalCode: '12345',
  },
};

const mockPagesFromStateAddress = {
  addressPage: {
    schema: {
      properties: {
        address: {
          properties: {
            city: {
              title: 'City',
            },
            state: {
              title: 'State',
            },
          },
        },
      },
    },
  },
};

const mockChapterArraySingle = {
  title: 'Array Single Page',
  pages: {
    arraySinglePage: {
      path: 'array-single-page',
      pageKey: 'arraySinglePage',
      title: 'Information for Single Page', // for review page (has to be more than one word)
      uiSchema: {
        arrayData: {
          'ui:options': {
            itemName: 'Facility',
          },
          items: {
            textField: textUI('Text Field'),
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          arrayData: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                textField: textSchema,
              },
            },
          },
        },
      },
    },
  },
};

const mockChapterArraySingleData = {
  arrayData: [
    {
      textField: 'Text Field Value 1',
    },
    {
      textField: 'Text Field Value 2',
    },
  ],
};

class MockChapter {
  constructor(chapterConfig, data, pagesFromState = {}) {
    this.chapterConfig = chapterConfig;
    this.title = chapterConfig.title;
    this.pages = chapterConfig.pages;
    this.data = data;
    this.pagesFromState = pagesFromState;
  }

  get chapter() {
    return {
      title: this.title,
      pages: this.pages,
    };
  }

  get chapterKey() {
    return this.title
      .split(' ')
      .map(
        (word, index) =>
          index === 0
            ? word.toLowerCase()
            : word[0].toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join('');
  }

  get chapterForBuildFields() {
    return {
      name: this.title,
      formConfig: this.chapterConfig,
      expandedPages: Object.values(this.pages),
    };
  }

  get formConfig() {
    return {
      formId: 'test-123',
      title: this.title,
      chapters: {
        [this.chapterKey]: this.chapter,
      },
    };
  }

  buildConfirmationFields() {
    return buildFields(
      this.chapterForBuildFields,
      this.data,
      this.pagesFromState,
    );
  }
}

describe('confirmation page view helpers', () => {
  it('should return the correct title for the chapter', () => {
    const chapterFormConfig = {
      ...mockChapterRadio,
    };
    const chapter = new MockChapter(chapterFormConfig, {});
    const { formConfig, data } = chapter;

    let title = getChapterTitle(chapterFormConfig, data, formConfig);
    expect(title).to.equal('Radio chapter');

    chapterFormConfig.title = () => 'Function title';
    title = getChapterTitle(chapterFormConfig, data, formConfig);
    expect(title).to.equal('Function title');

    chapterFormConfig.reviewTitle = 'Review title';
    title = getChapterTitle(chapterFormConfig, data, formConfig);
    expect(title).to.equal('Review title');

    chapterFormConfig.reviewTitle = () => 'Review function title';
    title = getChapterTitle(chapterFormConfig, data, formConfig);
    expect(title).to.equal('Review function title');
  });

  it('should not add "Review " prefix when onReviewPage is false', () => {
    const chapterFormConfig = {
      title: ({ onReviewPage }) =>
        `${onReviewPage ? 'Review ' : ''}Veteran Details`,
    };

    const title = getChapterTitle(chapterFormConfig, {}, {});
    expect(title).to.equal('Veteran Details');
    expect(title).to.not.include('Review ');
  });

  it('should return the correct title for the page', () => {
    const {
      getPageTitle,
    } = require('platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection');
    // Test with a string title
    const pageConfigString = {
      title: 'String Page Title',
      pageKey: 'page1',
      uiSchema: {},
      schema: { properties: {} },
    };
    let title = getPageTitle(pageConfigString, {}, {});
    expect(title).to.equal('String Page Title');

    // Test with a function title
    const pageConfigFunc = {
      title: () => 'Function Page Title',
      pageKey: 'page2',
      uiSchema: {},
      schema: { properties: {} },
    };
    title = getPageTitle(pageConfigFunc, {}, {});
    expect(title).to.equal('Function Page Title');

    // Test with a function reviewTitle
    const pageConfigReviewFunc = {
      title: 'Page Title',
      reviewTitle: () => 'Review Function Page Title',
      pageKey: 'page3',
      uiSchema: {},
      schema: { properties: {} },
    };
    title = getPageTitle(pageConfigReviewFunc, {}, {});
    expect(title).to.equal('Review Function Page Title');

    // Test with a string reviewTitle
    const pageConfigReviewString = {
      title: 'Page Title',
      reviewTitle: 'Review Page Title',
      pageKey: 'page4',
      uiSchema: {},
      schema: { properties: {} },
    };
    title = getPageTitle(pageConfigReviewString, {}, {});
    expect(title).to.equal('Review Page Title');

    // Test error handling: return empty string if error
    const pageConfigThrows = {
      title: () => {
        throw new Error('fail');
      },
      pageKey: 'page5',
      uiSchema: {},
      schema: { properties: {} },
    };
    title = getPageTitle(pageConfigThrows, {}, {});
    expect(title).to.equal('');
  });

  it('should not add "Review " prefix to page titles when onReviewPage is false', () => {
    const {
      getPageTitle,
    } = require('platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection');
    const pageConfig = {
      title: ({ onReviewPage }) =>
        `${onReviewPage ? 'Review ' : ''}Veteran Information`,
      pageKey: 'veteranInfo',
      uiSchema: {},
      schema: { properties: {} },
    };

    const title = getPageTitle(pageConfig, {}, {});
    expect(title).to.equal('Veteran Information');
    expect(title).to.not.include('Review ');
  });

  it('should show radio fields correctly', () => {
    const chapter = new MockChapter(mockChapterRadio, mockChapterRadioData);
    const fields = chapter.buildConfirmationFields();
    const { getByText } = render(fields);
    expect(getByText('Widget radio')).to.exist;
    expect(getByText('Widget radio option 1')).to.exist;
    expect(getByText('Web component radio')).to.exist;
    expect(getByText('Web component radio option 1')).to.exist;

    expect(getByText('Web component yes/no')).to.exist;
    expect(getByText('Yes')).to.exist;
  });

  it('should show text fields correctly', () => {
    const chapter = new MockChapter(mockChapterText, mockChapterTextData);
    const fields = chapter.buildConfirmationFields();
    const { getByText } = render(fields);
    expect(getByText('Text field')).to.exist;
    expect(getByText('Text field value')).to.exist;
    expect(getByText('Web component text')).to.exist;
    expect(getByText('Web component text value')).to.exist;
    expect(getByText('Social Security number')).to.exist;
    expect(getByText('VA file number')).to.exist;
    expect(getByText('●●●-●●-6789')).to.exist;
    expect(getByText('●●●-●●-4321')).to.exist;
  });

  it('should show checkbox group correctly', () => {
    const chapter = new MockChapter(
      mockChapterCheckboxGroup,
      mockChapterCheckboxGroupData,
    );
    const fields = chapter.buildConfirmationFields();
    const { getByText } = render(fields);
    expect(getByText('Checkbox group')).to.exist;
    expect(getByText('Option A')).to.exist;
  });

  it('should show select fields correctly', () => {
    const chapter = new MockChapter(mockChapterSelect, mockChapterSelectData);
    const fields = chapter.buildConfirmationFields();
    const { getByText } = render(fields);
    expect(getByText('Widget select')).to.exist;
    expect(getByText('Option 1')).to.exist;
    expect(getByText('Web component select')).to.exist;
    expect(getByText('Option 2')).to.exist;
  });

  it('should show date fields correctly', () => {
    const chapter = new MockChapter(mockChapterDate, mockChapterDateData);
    const fields = chapter.buildConfirmationFields();
    const { getByText } = render(fields);
    expect(getByText('Widget date')).to.exist;
    expect(getByText('January 1, 2020')).to.exist;
    expect(getByText('Web component date')).to.exist;
    expect(getByText('February 2, 2022')).to.exist;
    expect(getByText('Date range start')).to.exist;
    expect(getByText('Date range end')).to.exist;
    expect(getByText('January 1, 2023')).to.exist;
    expect(getByText('January 1, 2024')).to.exist;
  });

  it('should show address correctly', () => {
    const chapter = new MockChapter(
      mockChapterAddress,
      mockChapterAddressData,
      mockPagesFromStateAddress,
    );
    const fields = chapter.buildConfirmationFields();
    const { getByText } = render(fields);
    expect(getByText('Country')).to.exist;
    expect(getByText('USA')).to.exist;
    expect(getByText('Street address')).to.exist;
    expect(getByText('123 Main St')).to.exist;
    expect(getByText('Apt 1')).to.exist;
    expect(getByText('City')).to.exist;
    expect(getByText('Chicago')).to.exist;
    expect(getByText('State')).to.exist;
    expect(getByText('IL')).to.exist;
  });

  it('should show array single page correctly', () => {
    const chapter = new MockChapter(
      mockChapterArraySingle,
      mockChapterArraySingleData,
    );
    const fields = chapter.buildConfirmationFields();
    const { getByText } = render(fields);
    expect(getByText('Text Field Value 1')).to.exist;
    expect(getByText('Text Field Value 2')).to.exist;
  });
});

describe('Component ChapterSectionCollection', () => {
  it('should display', () => {
    const { mockStore } = mockRedux({
      formData: {
        ...mockChapterRadioData,
        ...mockChapterTextData,
        ...mockChapterCheckboxGroupData,
        ...mockChapterSelectData,
        ...mockChapterDateData,
        ...mockChapterAddressData,
        ...mockChapterArraySingleData,
      },
    });

    const { getByText } = render(
      <Provider store={mockStore}>
        <ChapterSectionCollection
          formConfig={{
            chapters: {
              radioChapter: mockChapterRadio,
              textChapter: mockChapterText,
              checkboxGroupChapter: mockChapterCheckboxGroup,
              selectChapter: mockChapterSelect,
              dateChapter: mockChapterDate,
              addressChapter: mockChapterAddress,
              arraySingleChapter: mockChapterArraySingle,
            },
          }}
          header="Information you submitted on this form"
        />
        ,
      </Provider>,
    );

    expect(getByText('Radio chapter')).to.exist;
    expect(getByText('Widget radio')).to.exist;
    expect(getByText('Widget radio option 1')).to.exist;
    expect(getByText('Web component radio')).to.exist;
    expect(getByText('Web component radio option 1')).to.exist;
    expect(getByText('Web component yes/no')).to.exist;
    expect(getByText('Yes')).to.exist;

    expect(getByText('Text chapter')).to.exist;
    expect(getByText('Text field')).to.exist;
    expect(getByText('Text field value')).to.exist;
    expect(getByText('Web component text')).to.exist;
    expect(getByText('Web component text value')).to.exist;
    expect(getByText('Social Security number')).to.exist;
    expect(getByText('VA file number')).to.exist;
    expect(getByText('●●●-●●-6789')).to.exist;
    expect(getByText('●●●-●●-4321')).to.exist;

    expect(getByText('Checkbox group chapter')).to.exist;
    expect(getByText('Checkbox group')).to.exist;
    expect(getByText('Option A')).to.exist;

    expect(getByText('Select chapter')).to.exist;
    expect(getByText('Widget select')).to.exist;
    expect(getByText('Option 1')).to.exist;
    expect(getByText('Web component select')).to.exist;
    expect(getByText('Option 2')).to.exist;

    expect(getByText('Date chapter')).to.exist;
    expect(getByText('Widget date')).to.exist;
    expect(getByText('January 1, 2020')).to.exist;
    expect(getByText('Web component date')).to.exist;
    expect(getByText('February 2, 2022')).to.exist;
    expect(getByText('Date range start')).to.exist;
    expect(getByText('Date range end')).to.exist;
    expect(getByText('January 1, 2023')).to.exist;
  });

  it('should display chapter level ui:confirmationField', () => {
    const { mockStore } = mockRedux({
      formData: {
        ...mockChapterRadioData,
      },
    });

    const { getByText } = render(
      <Provider store={mockStore}>
        <ChapterSectionCollection
          formConfig={{
            chapters: {
              radioChapter: {
                ...mockChapterRadio,
                pages: {
                  ...mockChapterRadio.pages,
                  radioPage: {
                    ...mockChapterRadio.pages.radioPage,
                    uiSchema: {
                      ...mockChapterRadio.pages.radioPage.uiSchema,
                      'ui:confirmationField': ({ formData }) => (
                        <>
                          {formData.webComponentYesNo &&
                            reviewEntry(
                              null,
                              'mock-key',
                              {},
                              'Radio page confirmation field',
                              'Page level confirmation field rendered',
                            )}
                        </>
                      ),
                    },
                  },
                },
              },
            },
          }}
          header="Information you submitted on this form"
        />
        ,
      </Provider>,
    );

    expect(getByText('Radio page confirmation field')).to.exist;
    expect(getByText('Page level confirmation field rendered')).to.exist;
  });

  it('should render dividers (hr) between chapters', () => {
    const { mockStore } = mockRedux({
      formData: {
        ...mockChapterRadioData,
        ...mockChapterTextData,
      },
    });

    const { container } = render(
      <Provider store={mockStore}>
        <ChapterSectionCollection
          formConfig={{
            chapters: {
              radioChapter: mockChapterRadio,
              textChapter: mockChapterText,
            },
          }}
        />
      </Provider>,
    );

    // Should have exactly one <hr> since there are two chapters
    const hrElements = container.querySelectorAll('hr');
    expect(hrElements.length).to.equal(1);
  });

  describe('optional page titles', () => {
    it('renders page title H4s when showPageTitles is true', () => {
      const { mockStore } = mockRedux({
        formData: {
          ...mockChapterRadioData,
        },
      });

      const { container } = render(
        <Provider store={mockStore}>
          <ChapterSectionCollection
            formConfig={{
              chapters: {
                radioChapter: mockChapterRadio,
              },
            }}
            showPageTitles
          />
        </Provider>,
      );
      const h4 = container.querySelector('h4');
      expect(h4).to.exist;
      expect(h4.textContent).to.equal('Radio page title');
    });

    it('should display blank H4 element if no page title exists and showPageTitles is true', () => {
      const { mockStore } = mockRedux({
        formData: {
          ...mockChapterRadioData,
        },
      });

      // Remove the page title property from the radioPage
      const chapterNoTitle = {
        ...mockChapterRadio,
        pages: {
          radioPage: {
            ...mockChapterRadio.pages.radioPage,
          },
        },
      };
      delete chapterNoTitle.pages.radioPage.title;

      const { container, queryByText } = render(
        <Provider store={mockStore}>
          <ChapterSectionCollection
            formConfig={{
              chapters: {
                radioChapter: chapterNoTitle,
              },
            }}
            showPageTitles
          />
        </Provider>,
      );

      const h4 = container.querySelector('h4');
      expect(h4).to.exist;
      expect(h4.textContent).to.equal('');
      expect(queryByText('Radio page title')).to.be.null;
    });

    it('does not render showPageTitles by default', () => {
      const { mockStore } = mockRedux({
        formData: {
          ...mockChapterRadioData,
        },
      });

      const { container, queryByText } = render(
        <Provider store={mockStore}>
          <ChapterSectionCollection
            formConfig={{
              chapters: {
                radioChapter: mockChapterRadio,
              },
            }}
            showPageTitles={false}
          />
        </Provider>,
      );
      const h4 = container.querySelector('h4');
      expect(h4).to.not.exist;
      expect(queryByText('Radio page title')).to.be.null;
    });

    it('does not render showPageTitles by default (when prop is not passed)', () => {
      const { mockStore } = mockRedux({
        formData: {
          ...mockChapterRadioData,
        },
      });

      const { container, queryByText } = render(
        <Provider store={mockStore}>
          <ChapterSectionCollection
            formConfig={{
              chapters: {
                radioChapter: mockChapterRadio,
              },
            }}
          />
        </Provider>,
      );
      const h4 = container.querySelector('h4');
      expect(h4).to.not.exist;
      expect(queryByText('Radio page title')).to.be.null;
    });
  });
});
