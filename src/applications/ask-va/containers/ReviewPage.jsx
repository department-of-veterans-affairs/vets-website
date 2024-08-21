import {
  VaAccordion,
  VaAccordionItem,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getViewedPages } from '@department-of-veterans-affairs/platform-forms-system/selectors';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import Scroll from 'react-scroll';

import {
  getActiveExpandedPages,
  getPageKeys,
} from '@department-of-veterans-affairs/platform-forms-system/helpers';

import {
  setData,
  setEditMode,
  setViewedPages,
  uploadFile,
} from '@department-of-veterans-affairs/platform-forms-system/actions';
import {
  closeReviewChapter,
  openReviewChapter,
  setUpdatedInReview,
} from '../actions';
import ReviewCollapsibleChapter from '../components/ReviewCollapsibleChapter';
import formConfig from '../config/form';
import {
  createPageListByChapterAskVa,
  getChapterFormConfigAskVa,
  getPageKeysForReview,
} from '../utils/reviewPageHelper';

const { scroller } = Scroll;

const ReviewPage = props => {
  const [showAlert, setShowAlert] = useState(true);
  const dispatch = useDispatch();

  const scrollToChapter = chapterKey => {
    scroller.scrollTo(
      `chapter${chapterKey}ScrollElement`,
      window.Forms?.scroll || {
        duration: 500,
        delay: 2,
        smooth: true,
      },
    );
  };

  const handleToggleChapter = ({ name, open, pageKeys }) => {
    if (open) {
      dispatch(closeReviewChapter(name, pageKeys));
    } else {
      dispatch(openReviewChapter(name));
      scrollToChapter(name);
    }
  };

  const handleEdit = (pageKey, editing, index = null) => {
    const fullPageKey = `${pageKey}${index === null ? '' : index}`;
    if (editing) {
      props.setViewedPages([fullPageKey]);
      dispatch(setUpdatedInReview(''));
    }
    props.setEditMode(pageKey, editing, index);
    if (!editing) dispatch(setUpdatedInReview(pageKey));
  };

  const handleSetData = (...args) => {
    props.setData(...args);
    if (props.onSetData) {
      props.onSetData();
    }
  };

  const handleSubmit = () => {
    props.goForward('/confirmation');
  };

  return (
    <article>
      <div name="topScrollElement" />
      <div name="topNavScrollElement" />
      <div className="vads-u-margin-y--7">
        {showAlert ? (
          <VaAlert
            closeBtnAriaLabel="Close notification"
            closeable
            onCloseEvent={() => setShowAlert(false)}
            status="info"
            uswds
            visible
          >
            <h3 id="track-your-status-on-mobile" slot="headline">
              Editing answers
            </h3>
            <div>
              <p className="vads-u-margin-y--0">
                You are only able to edit some answers on this page. You may
                need to return to an earlier page in the form to edit some
                answers.
              </p>
            </div>
          </VaAlert>
        ) : null}
      </div>
      <VaAccordion uswds>
        {props.chapters
          .filter(chapter => chapter.name === 'yourQuestion')
          .map(chapter => {
            return (
              <VaAccordionItem
                bordered
                key={chapter.name}
                header="Your question"
                level={4}
                id={chapter.name}
                open
              >
                <ReviewCollapsibleChapter
                  expandedPages={chapter.expandedPages}
                  chapterFormConfig={chapter.formConfig}
                  chapterKey={chapter.name}
                  form={props.form}
                  formContext={props.formContext}
                  onEdit={handleEdit}
                  open={chapter.open}
                  pageKeys={chapter.pageKeys}
                  pageList={getPageKeysForReview(formConfig)}
                  setData={(...args) => handleSetData(...args)}
                  setValid={props.setValid}
                  toggleButtonClicked={() => handleToggleChapter(chapter)}
                  uploadFile={props.uploadFile}
                  viewedPages={new Set(getPageKeysForReview(formConfig))}
                  hasUnviewedPages={chapter.hasUnviewedPages}
                />
              </VaAccordionItem>
            );
          })}

        {props.chapters
          .filter(chapter => chapter.name === 'relationshipToTheVeteran')
          .map(chapter => {
            return (
              <VaAccordionItem
                bordered
                key={chapter.name}
                header="Relationship to the Veteran"
                level={4}
                id={chapter.name}
                open
              >
                <ReviewCollapsibleChapter
                  expandedPages={chapter.expandedPages}
                  chapterFormConfig={chapter.formConfig}
                  chapterKey={chapter.name}
                  form={props.form}
                  formContext={props.formContext}
                  onEdit={handleEdit}
                  open={chapter.open}
                  pageKeys={chapter.pageKeys}
                  pageList={getPageKeysForReview(formConfig)}
                  setData={(...args) => handleSetData(...args)}
                  setValid={props.setValid}
                  toggleButtonClicked={() => handleToggleChapter(chapter)}
                  uploadFile={props.uploadFile}
                  viewedPages={new Set(getPageKeysForReview(formConfig))}
                  hasUnviewedPages={chapter.hasUnviewedPages}
                />
              </VaAccordionItem>
            );
          })}

        {props.chapters
          .filter(chapter => chapter.name === 'veteransInformation')
          .map(chapter => {
            return (
              <VaAccordionItem
                bordered
                key={chapter.name}
                header="Veteran's information"
                level={4}
                id={chapter.name}
                open
              >
                <ReviewCollapsibleChapter
                  expandedPages={chapter.expandedPages}
                  chapterFormConfig={chapter.formConfig}
                  chapterKey={chapter.name}
                  form={props.form}
                  formContext={props.formContext}
                  onEdit={handleEdit}
                  open={chapter.open}
                  pageKeys={chapter.pageKeys}
                  pageList={getPageKeysForReview(formConfig)}
                  setData={(...args) => handleSetData(...args)}
                  setValid={props.setValid}
                  toggleButtonClicked={() => handleToggleChapter(chapter)}
                  uploadFile={props.uploadFile}
                  viewedPages={new Set(getPageKeysForReview(formConfig))}
                  hasUnviewedPages={chapter.hasUnviewedPages}
                />
              </VaAccordionItem>
            );
          })}

        {props.chapters
          .filter(chapter => chapter.name === 'familyMembersInformation')
          .map(chapter => {
            return (
              <VaAccordionItem
                bordered
                key={chapter.name}
                header="Family member's information"
                level={4}
                id={chapter.name}
                open
              >
                <ReviewCollapsibleChapter
                  expandedPages={chapter.expandedPages}
                  chapterFormConfig={chapter.formConfig}
                  chapterKey={chapter.name}
                  form={props.form}
                  formContext={props.formContext}
                  onEdit={handleEdit}
                  open={chapter.open}
                  pageKeys={chapter.pageKeys}
                  pageList={getPageKeysForReview(formConfig)}
                  setData={(...args) => handleSetData(...args)}
                  setValid={props.setValid}
                  toggleButtonClicked={() => handleToggleChapter(chapter)}
                  uploadFile={props.uploadFile}
                  viewedPages={new Set(getPageKeysForReview(formConfig))}
                  hasUnviewedPages={chapter.hasUnviewedPages}
                />
              </VaAccordionItem>
            );
          })}

        {props.chapters
          .filter(chapter => chapter.name === 'yourInformation')
          .map(chapter => {
            return (
              <VaAccordionItem
                bordered
                key={chapter.name}
                header="Your information"
                level={4}
                id={chapter.name}
                open
              >
                <ReviewCollapsibleChapter
                  expandedPages={chapter.expandedPages}
                  chapterFormConfig={chapter.formConfig}
                  chapterKey={chapter.name}
                  form={props.form}
                  formContext={props.formContext}
                  onEdit={handleEdit}
                  open={chapter.open}
                  pageKeys={chapter.pageKeys}
                  pageList={getPageKeysForReview(formConfig)}
                  setData={(...args) => handleSetData(...args)}
                  setValid={props.setValid}
                  toggleButtonClicked={() => handleToggleChapter(chapter)}
                  uploadFile={props.uploadFile}
                  viewedPages={new Set(getPageKeysForReview(formConfig))}
                  hasUnviewedPages={chapter.hasUnviewedPages}
                />
              </VaAccordionItem>
            );
          })}
      </VaAccordion>

      <div className="vads-u-margin-top--4 vads-u-display--flex">
        <va-button back onClick={() => props.goBack()} />
        <va-button text="Submit question" onClick={handleSubmit} />
      </div>
    </article>
  );
};

function mapStateToProps(state, ownProps) {
  // from ownprops
  const { formContext } = ownProps;

  // from redux state
  const { form } = state;
  const formData = state.form.data;
  const { openChapters } = state.askVA.reviewPageView;
  const viewedPages = getViewedPages(state);

  const pagesToMoveConfig = {
    yourQuestion: [
      'selectCategory',
      'selectTopic',
      'selectSubtopic',
      'whoIsYourQuestionAbout',
      'question',
    ],
    relationshipToTheVeteran: [
      'relationshipToVeteran',
      'moreAboutYourRelationshipToVeteran_aboutmyselfrelationshipfamilymember',
      'aboutYourself_aboutmyselfrelationshipveteran',
      'aboutYourRelationshipToFamilyMember_aboutsomeoneelserelationshipveteran',
      'isQuestionAboutVeteranOrSomeoneElse_aboutsomeoneelserelationshipfamilymember',
      'theirRelationshipToVeteran_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'yourRole_aboutsomeoneelserelationshipconnectedthroughwork',
      'yourRole_aboutsomeoneelserelationshipconnectedthroughworkeducation',
    ],
    veteransInformation: [
      'aboutTheVeteran_aboutmyselfrelationshipfamilymember',
      'dateOfDeath_aboutmyselfrelationshipfamilymember',
      'aboutTheVeteran_aboutsomeoneelserelationshipconnectedthroughwork',
      'dateOfDeath_aboutsomeoneelserelationshipconnectedthroughwork',
      'veteransLocationOfResidence_aboutsomeoneelserelationshipconnectedthroughwork',
      'veteransPostalCode_aboutsomeoneelserelationshipconnectedthroughwork',
      'aboutTheVeteran_aboutsomeoneelserelationshipfamilymember',
      'aboutTheVeteran_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'dateOfDeath_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'aboutTheVeteran_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'dateOfDeath_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'veteransLocationOfResidence_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'veteransPostalCode_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'aboutYourRelationshipToFamilyMember_aboutsomeoneelserelationshipveteran',
    ],
    familyMembersInformation: [
      'aboutYourselfRelationshipFamilyMember_aboutmyselfrelationshipfamilymember',
      'aboutYourFamilyMember_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'familyMembersLocationOfResidence_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'familyMembersPostalCode_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'aboutYourFamilyMember_aboutsomeoneelserelationshipveteran',
      'familyMembersLocationOfResidence_aboutsomeoneelserelationshipveteran',
      'familyMembersPostalCode_aboutsomeoneelserelationshipveteran',
    ],
    yourInformation: [
      'aboutYourself_aboutmyselfrelationshipveteran',
      'searchVAMedicalCenter_aboutmyselfrelationshipfamilymember',
      'yourContactInformation_aboutmyselfrelationshipfamilymember',
      'yourLocationOfResidence_aboutmyselfrelationshipfamilymember',
      'yourMailingAddress_aboutmyselfrelationshipfamilymember',
      'yourPostalCode_aboutmyselfrelationshipfamilymember',
      'yourContactInformation_aboutmyselfrelationshipveteran',
      'yourLocationOfResidence_aboutmyselfrelationshipveteran',
      'yourMailingAddress_aboutmyselfrelationshipveteran',
      'yourPostalCode_aboutmyselfrelationshipveteran',
      'yourVAHealthFacility_aboutmyselfrelationshipveteran',
      'aboutYourself_aboutsomeoneelserelationshipconnectedthroughwork',
      'searchVAMedicalCenter_aboutsomeoneelserelationshipconnectedthroughwork',
      'yourContactInformation_aboutsomeoneelserelationshipconnectedthroughwork',
      'yourMailingAddress_aboutsomeoneelserelationshipconnectedthroughwork',
      'aboutYourself_aboutsomeoneelserelationshipconnectedthroughworkeducation',
      'yourContactInformation_aboutsomeoneelserelationshipconnectedthroughworkeducation',
      'searchVAMedicalCenter_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'yourContactInformation_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'yourMailingAddress_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'aboutYourselfRelationshipFamilyMember_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'searchVAMedicalCenter_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'yourContactInformation_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'yourMailingAddress_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'aboutYourself_aboutsomeoneelserelationshipveteran',
      'searchVAMedicalCenter_aboutsomeoneelserelationshipveteran',
      'yourContactInformation_aboutsomeoneelserelationshipveteran',
      'yourMailingAddress_aboutsomeoneelserelationshipveteran',
      'aboutYourself_aboutsomeoneelserelationshipveteranorfamilymembereducation',
      'schoolStOrResidency_aboutsomeoneelserelationshipveteranorfamilymembereducation',
      'yourContactInformation_aboutsomeoneelserelationshipveteranorfamilymembereducation',
    ],
  };

  const { pagesByChapter, modifiedFormConfig } = createPageListByChapterAskVa(
    formConfig,
    pagesToMoveConfig,
  );

  const chapterNames = [
    'yourQuestion',
    'relationshipToTheVeteran',
    'yourInformation',
    'veteransInformation',
    'familyMembersInformation',
  ];

  const chapters = chapterNames
    .map(chapterName => {
      const pages = pagesByChapter[chapterName];
      const expandedPages = getActiveExpandedPages(pages, formData);
      const chapterFormConfig = getChapterFormConfigAskVa(
        modifiedFormConfig,
        chapterName,
      );
      const open = openChapters.includes(chapterName);
      const pageKeys = getPageKeys(pages, formData);

      const hasErrors = state.form.formErrors?.errors?.some(err =>
        pageKeys.includes(err.pageKey),
      );

      const hasUnviewedPages =
        hasErrors || pageKeys.some(key => !viewedPages.has(key));

      return {
        expandedPages: expandedPages.map(
          page =>
            page.appStateSelector
              ? { ...page, appStateData: page.appStateSelector(state) }
              : page,
        ),
        formConfig: chapterFormConfig,
        name: chapterName,
        open,
        pageKeys,
        hasUnviewedPages,
      };
    })
    .filter(chapter => chapter.expandedPages.length > 0);
  return {
    chapters,
    form,
    formData,
    formContext,
    viewedPages,
    openChapterList: state.askVA.reviewPageView.openChapters,
  };
}

const mapDispatchToProps = {
  setData,
  setEditMode,
  setViewedPages,
  uploadFile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
