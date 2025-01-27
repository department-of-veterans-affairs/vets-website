import {
  VaAccordion,
  VaAccordionItem,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  setData,
  setEditMode,
  setViewedPages,
  uploadFile,
} from '@department-of-veterans-affairs/platform-forms-system/actions';
import {
  getActiveExpandedPages,
  getPageKeys,
} from '@department-of-veterans-affairs/platform-forms-system/helpers';
import { getViewedPages } from '@department-of-veterans-affairs/platform-forms-system/selectors';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';
import {
  closeReviewChapter,
  openReviewChapter,
  setUpdatedInReview,
} from '../actions';
import ReviewCollapsibleChapter from '../components/ReviewCollapsibleChapter';
import formConfig from '../config/form';
import submitTransformer from '../config/submit-transformer';
import { URL, envUrl, mockTestingFlagforAPI } from '../constants';
import { mockSubmitResponse } from '../utils/mockData';
import {
  createPageListByChapterAskVa,
  getChapterFormConfigAskVa,
  getPageKeysForReview,
} from '../utils/reviewPageHelper';
import FileUpload from '../components/FileUpload';
import { DownloadLink } from '../config/helpers';

const { scroller } = Scroll;

const ReviewPage = props => {
  const [showAlert, setShowAlert] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [editAttachments, setEditAttachments] = useState(false);

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

  const getUploadedFiles = () => {
    const storedFile = localStorage.getItem('askVAFiles');
    if (storedFile?.length > 0) {
      const files = JSON.parse(storedFile);
      setAttachments(files);
    }
  };

  const deleteFile = fileID => {
    const uploadedFiles = localStorage.getItem('askVAFiles');
    const parseFiles = JSON.parse(uploadedFiles);
    const removedFile = parseFiles.filter(file => file.fileID !== fileID);
    localStorage.askVAFiles = JSON.stringify(removedFile);
    setAttachments(attachments.filter(file => file.fileID !== fileID));
  };

  const handleEdit = (pageKey, editing, index = null) => {
    if (pageKey === 'question') {
      setEditAttachments(editing);
      getUploadedFiles();
    }

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

  const postFormData = (url, data) => {
    setIsDisabled(true);
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (mockTestingFlagforAPI) {
      // Simulate API delay
      return new Promise(resolve => {
        setTimeout(() => {
          setIsDisabled(false);
          resolve(mockSubmitResponse);
          const inquiryNumber = 'A-20230622-306458';
          const contactPreference = props.formData.contactPreference || 'Email';
          localStorage.removeItem('askVAFiles');
          props.router.push({
            pathname: '/confirmation',
            state: { contactPreference, inquiryNumber },
          });
        }, 500);
      });
    }

    return apiRequest(url, options)
      .then(response => {
        setIsDisabled(false);
        const { inquiryNumber } = response;
        const contactPreference = props.formData.contactPreference || 'Email';
        localStorage.removeItem('askVAFiles');
        props.router.push({
          pathname: '/confirmation',
          state: { contactPreference, inquiryNumber },
        });
      })
      .catch(error => {
        setIsDisabled(false);
        localStorage.removeItem('askVAFiles');
        // TODO - need error modal instead of forwarding to confirmation per final design
        // Temporary alert dialog for testing
        alert(error.error);
      });
  };

  const handleSubmit = () => {
    const files = localStorage.getItem('askVAFiles');
    const transformedData = submitTransformer(
      props.formData,
      JSON.parse(files),
      props.askVA,
    );

    if (props.loggedIn) {
      // auth call
      postFormData(`${envUrl}${URL.AUTH_INQUIRIES}`, transformedData);
    } else {
      // no auth call
      postFormData(`${envUrl}${URL.INQUIRIES}`, transformedData);
    }
  };

  const nonEditAttachmentsMode = hasAttachments => {
    if (hasAttachments === 0) {
      return (
        <div>
          <h4 className="vads-u-margin-top--0">
            Select optional files to upload
          </h4>
          <va-button
            onClick={() => handleEdit('question', true)}
            text="Upload files"
          />
        </div>
      );
    }

    return (
      <div className="vads-u-display--flex vads-u-justify-content--space-between">
        <dt className="vads-u-margin-right--2">Attachments</dt>
        <div>
          {attachments.map(file => (
            <dd
              className="vads-u-margin-bottom--2 vads-u-color--link-default"
              key={`${file.fileID}-${file.fileName}`}
            >
              <va-icon icon="attach_file" size={3} />
              <DownloadLink
                fileUrl={file.base64}
                fileName={file.fileName}
                fileSize={file.fileSize}
              />
            </dd>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getUploadedFiles();
  }, []);

  return (
    <article className="vads-u-padding-x--2p5 vads-u-padding-bottom--7">
      <div name="topScrollElement" />
      <div name="topNavScrollElement" />
      <div className="vads-u-margin-y--3">
        {showAlert ? (
          <VaAlert
            closeBtnAriaLabel="Close notification"
            closeable
            onCloseEvent={() => setShowAlert(false)}
            status="info"
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
      <VaAccordion>
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
                className="vads-u-margin-bottom--2"
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
                {props.formData.allowAttachments && (
                  <div
                    className="usa-accordion-content schemaform-chapter-accordion-content vads-u-padding-top--0"
                    aria-hidden="false"
                  >
                    <div className="form-review-panel-page vads-u-margin-bottom--0">
                      <div name="questionScrollElement" />
                      <form className="rjsf">
                        <div className="vads-u-width--full vads-u-justify-content--space-between vads-u-align-items--center">
                          <dl className="review vads-u-margin-top--0 vads-u-margin-bottom--0">
                            <dl className="review-row vads-u-border-top--0 vads-u-margin-top--0 vads-u-margin-bottom--0">
                              {!editAttachments ? (
                                nonEditAttachmentsMode(attachments.length)
                              ) : (
                                <>
                                  {attachments.map(file => (
                                    <div
                                      key={`${file.fileID}-${
                                        file.fileName
                                      }-edit`}
                                      className="review-page-attachments"
                                    >
                                      <dt className="form-review-panel-page-header">
                                        {`${file.fileName} (${file.fileSize})`}
                                      </dt>
                                      <dd className="vads-u-margin-right--0">
                                        <va-button-icon
                                          button-type="delete"
                                          onClick={() =>
                                            deleteFile(file.fileID)
                                          }
                                        />
                                      </dd>
                                    </div>
                                  ))}
                                  <div className="vads-u-margin-y--2">
                                    <FileUpload />
                                  </div>
                                </>
                              )}
                            </dl>
                          </dl>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
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
                className="vads-u-margin-bottom--2"
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
                className="vads-u-margin-bottom--2"
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
                className="vads-u-margin-bottom--2"
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
                className="vads-u-margin-bottom--2"
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
        <va-button
          text="Submit question"
          disabled={isDisabled}
          onClick={handleSubmit}
        />
      </div>
    </article>
  );
};

function mapStateToProps(state, ownProps) {
  const { formContext } = ownProps;
  const loggedIn = isLoggedIn(state);
  const { form, askVA } = state;
  const formData = form.data;
  const { openChapters } = askVA.reviewPageView;
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
      'yourVAHealthFacility_aboutmyselfrelationshipfamilymember',
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
      'yourVAHealthFacility_aboutsomeoneelserelationshipconnectedthroughwork',
      'yourContactInformation_aboutsomeoneelserelationshipconnectedthroughwork',
      'yourMailingAddress_aboutsomeoneelserelationshipconnectedthroughwork',
      'aboutYourself_aboutsomeoneelserelationshipconnectedthroughworkeducation',
      'yourContactInformation_aboutsomeoneelserelationshipconnectedthroughworkeducation',
      'yourVAHealthFacility_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'yourContactInformation_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'yourMailingAddress_aboutsomeoneelserelationshipfamilymemberaboutfamilymember',
      'aboutYourselfRelationshipFamilyMember_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'yourVAHealthFacility_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'yourContactInformation_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'yourMailingAddress_aboutsomeoneelserelationshipfamilymemberaboutveteran',
      'aboutYourself_aboutsomeoneelserelationshipveteran',
      'yourVAHealthFacility_aboutsomeoneelserelationshipveteran',
      'yourContactInformation_aboutsomeoneelserelationshipveteran',
      'yourMailingAddress_aboutsomeoneelserelationshipveteran',
      'aboutYourself_aboutsomeoneelserelationshipveteranorfamilymembereducation',
      'schoolStOrResidency_aboutsomeoneelserelationshipveteranorfamilymembereducation',
      'yourContactInformation_aboutsomeoneelserelationshipveteranorfamilymembereducation',
      'aboutYourselfGeneral_generalquestion',
      'yourContactInformation_generalquestion',
      'yourLocationOfResidence_generalquestion',
      'yourMailingAddress_generalquestion',
      'yourPostalCode_generalquestion',
      'yourVAHealthFacility_generalquestion',
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
    loggedIn,
    openChapterList: state.askVA.reviewPageView.openChapters,
    askVA: state.askVA,
  };
}

ReviewPage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  formData: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  loggedIn: PropTypes.bool,
};

const mapDispatchToProps = {
  setData,
  setEditMode,
  setViewedPages,
  uploadFile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ReviewPage));
