import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';
import scrollTo from 'platform/utilities/ui/scrollTo';
import {
  isReactComponent,
  waitForRenderThenFocus,
} from 'platform/utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  VaAccordion,
  VaAccordionItem,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  createPageListByChapter,
  getActiveChapters,
  getActiveExpandedPages,
} from '~/platform/forms-system/exportsFile';
import { PropTypes } from 'prop-types';
import GetFormHelp from './GetFormHelp';

export const ConfirmationPageView = props => {
  const alertRef = useRef(null);
  const {
    childContent = null,
    confirmationNumber,
    content,
    formConfig,
    formName = 'VA Form',
    formType = 'application',
    submitDate,
  } = props;

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        // delay focus for Safari
        waitForRenderThenFocus('h2', alertRef.current);
      }
    },
    [alertRef],
  );

  const { headlineText, nextStepsText } = content;
  const dateSubmitted = isValid(submitDate)
    ? format(submitDate, 'MMMM d, yyyy')
    : null;
  const dynamicHeadline = `You've submitted your ${formName} ${formType}`;
  const headline = `${headlineText || dynamicHeadline} ${dateSubmitted &&
    ` on ${dateSubmitted}`}`;

  const form = useSelector(state => state.form);
  const formData = form.data;
  const chapterNames = getActiveChapters(formConfig, formData);
  const pagesByChapter = createPageListByChapter(formConfig);

  const chapters = useSelector(state =>
    chapterNames.map(chapterName => {
      const pages = pagesByChapter[chapterName];
      const expandedPages = getActiveExpandedPages(pages, formData);
      const chapterFormConfig = formConfig.chapters[chapterName];

      return {
        expandedPages: expandedPages.map(
          page =>
            page.appStateSelector
              ? { ...page, appStateData: page.appStateSelector(state) }
              : page,
        ),
        formConfig: chapterFormConfig,
        name: chapterName,
      };
    }),
  );

  const getChapterTitle = chapterFormConfig => {
    const onReviewPage = true;

    let chapterTitle = chapterFormConfig.title;

    if (typeof chapterFormConfig.title === 'function') {
      chapterTitle = chapterFormConfig.title({
        formData,
        formConfig,
        onReviewPage,
      });
    }
    if (chapterFormConfig.reviewTitle) {
      chapterTitle = chapterFormConfig.reviewTitle;
    }

    return chapterTitle || '';
  };

  const reviewEntry = (
    description,
    uiSchemaKey,
    uiSchemaValue,
    label,
    data,
  ) => {
    if (!data) return null;

    const textDescription =
      typeof description === 'string' ? description : null;
    const DescriptionField = isReactComponent(description)
      ? uiSchemaValue['ui:description']
      : null;

    return (
      <li key={`review_${uiSchemaKey}_${uiSchemaValue}`}>
        <div className="vads-u-color--gray">
          {label}
          {textDescription && <p>{textDescription}</p>}
          {!textDescription && !DescriptionField && description}
        </div>
        {data && <div>{data}</div>}
      </li>
    );
  };

  const fieldEntries = (key, value, data, schema) => {
    if (key.startsWith('view:')) return null;
    if (key.startsWith('ui:')) return null;

    const label = value['ui:title'];
    const description = value['ui:description'];

    let refinedData = typeof data === 'object' ? data[key] : data;
    const dataType = schema.properties[key].type;

    const ReviewField = value['ui:reviewField'];
    const ReviewWidget = value['ui:reviewWidget'];

    if (isReactComponent(ReviewField)) {
      const reviewProps = { children: { props: { formData: refinedData } } };
      return <ReviewField {...reviewProps} />;
    }

    if (isReactComponent(ReviewWidget)) {
      const reviewProps = { name: label, value: refinedData };
      refinedData = <ReviewWidget {...reviewProps} />;
    }

    if (dataType === 'object') {
      return Object.entries(value).flatMap(([objKey, objVal]) => {
        return fieldEntries(
          objKey,
          objVal,
          data[objKey],
          schema.properties[key],
        );
      });
    }

    if (dataType === 'array') {
      return data.map(dataPoint => {
        return Object.entries(value.items).flatMap(([arrKey, arrVal]) => {
          return fieldEntries(
            arrKey,
            arrVal,
            dataPoint[arrKey],
            schema.properties[key].items,
          );
        });
      });
    }

    return reviewEntry(description, key, value, label, refinedData);
  };

  const buildFields = chapter => {
    return chapter.expandedPages.flatMap(page =>
      Object.entries(page.uiSchema).map(([uiSchemaKey, uiSchemaValue]) => {
        const data = formData[uiSchemaKey];
        return fieldEntries(uiSchemaKey, uiSchemaValue, data, page.schema);
      }),
    );
  };

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <VaAlert uswds status="success" ref={alertRef}>
        <h2 slot="headline">{headline}</h2>
        {typeof nextStepsText === 'string' ? (
          <p>{nextStepsText}</p>
        ) : (
          nextStepsText
        )}
        <p>{`Your confirmation number is ${confirmationNumber}`}</p>
      </VaAlert>
      <div>
        <h3>Save a copy of your form</h3>
        <p>If you’d like a copy of your completed form, you can download it.</p>
        <VaAccordion bordered uswds>
          <VaAccordionItem
            header="Information you submitted on this form"
            id="info"
            bordered
            uswds
          >
            {chapters.map(chapter => {
              const chapterTitle = getChapterTitle(chapter.formConfig);
              const fields = buildFields(chapter);
              return (
                fields.length > 0 && (
                  <div key={`chapter_${chapter.name}`}>
                    <h3>{chapterTitle}</h3>
                    <ul style={{ listStyle: 'none' }}>{fields}</ul>
                  </div>
                )
              );
            })}
          </VaAccordionItem>
        </VaAccordion>
      </div>
      {childContent || null}
      <div className="vads-u-margin-bottom--6">
        <h2 className="vads-u-font-size--h2 vads-u-font-family--serif">
          How to contact us if you have questions
        </h2>
        <p>
          Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />
          (TTY: <va-telephone contact={CONTACTS[711]} />) We’re here Monday
          through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
        <p>
          Or you can ask us a question online through Ask VA. Select the
          category and topic for the VA benefit this form is related to.
        </p>
        <p className="vads-u-margin-bottom--4">
          <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
        </p>
        <p>
          <a
            className="vads-c-action-link--green vads-u-margin-bottom--4"
            href="/"
          >
            Go back to VA.gov homepage
          </a>
        </p>
      </div>
      <div className="help-footer-box">
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div>
    </div>
  );
};

ConfirmationPageView.propTypes = {
  childContent: PropTypes.any,
  confirmationNumber: PropTypes.any,
  content: PropTypes.any,
  formConfig: PropTypes.any,
  formContext: PropTypes.any,
  formName: PropTypes.any,
  formType: PropTypes.any,
  submitDate: PropTypes.any,
};
