import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
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
import { ChapterSectionCollection } from './confirmationPageViewHelpers';

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
        <h2 slot="headline">{headline}.</h2>
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
            <ChapterSectionCollection
              chapters={chapters}
              formData={formData}
              formConfig={formConfig}
            />
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
  childContent: PropTypes.shape(),
  confirmationNumber: PropTypes.string,
  content: PropTypes.shape(),
  formConfig: PropTypes.object,
  formContext: PropTypes.object,
  formName: PropTypes.string,
  formType: PropTypes.string,
  submitDate: PropTypes.object,
};
