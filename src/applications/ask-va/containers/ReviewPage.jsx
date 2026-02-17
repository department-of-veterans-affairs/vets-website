import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
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
import {
  isLOA3,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { scrollTo, getScrollOptions } from 'platform/utilities/scroll';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import {
  closeReviewChapter,
  openReviewChapter,
  removeAskVaForm,
  setUpdatedInReview,
} from '../actions';
import FileUpload from '../components/FileUpload';
import ReviewCollapsibleChapter from '../components/ReviewCollapsibleChapter';
import ReviewSectionContent from '../components/reviewPage/ReviewSectionContent';
import SaveCancelButtons from '../components/reviewPage/SaveCancelButtons';
// eslint-disable-next-line import/no-cycle
import formConfig from '../config/form';
import { DownloadLink } from '../config/helpers';
import { relationshipOptionsSomeoneElse } from '../constants';
import {
  chapterTitles,
  createPageListByChapterAskVa,
  getChapterFormConfigAskVa,
  getPageKeysForReview,
  pagesToMoveConfig,
  hasValidValues,
} from '../utils/reviewPageHelper';
import {
  convertDate,
  deleteStoredFile,
  getAttachmentDisplayData,
  getSchoolString,
  getStoredAttachments,
  getYesOrNoFromBool,
  handleChapterToggle,
  handleDataUpdate,
  handleFormSubmission,
  maskSocial,
} from '../utils/reviewPageUtils';

const ReviewPage = props => {
  const [showAlert, setShowAlert] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [editSection, setEditSection] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [editAttachments, setEditAttachments] = useState(false);
  const [show503Alert, setShow503Alert] = useState(false);

  const dispatch = useDispatch();

  const scrollToChapter = chapterKey => {
    scrollTo(`chapter${chapterKey}ScrollElement`, getScrollOptions(chapterKey));
  };

  const handleToggleChapter = ({ name, open, pageKeys }) => {
    const { shouldClose, chapterName, affectedPages } = handleChapterToggle(
      open,
      name,
      pageKeys,
    );
    if (shouldClose) {
      dispatch(closeReviewChapter(chapterName, affectedPages));
    } else {
      dispatch(openReviewChapter(chapterName));
      scrollToChapter(chapterName);
    }
  };

  // const getPronouns = (list = {}) => {
  //   const pronounList = [];
  //   Object.keys(list).forEach(item => {
  //     if (list[item]) {
  //       pronounList.push(` ${pronounLabels[item]}`);
  //     }
  //   });
  //   return pronounList.toString();
  // };

  const getUploadedFiles = async () => {
    const storedFiles = await getStoredAttachments();
    if (storedFiles.length > 0) {
      setAttachments(storedFiles);
    }
  };

  const deleteFile = async fileID => {
    const remainingFiles = await deleteStoredFile(fileID);
    setAttachments(remainingFiles);
  };

  const handleEdit = (pageKey, editing, index = null) => {
    if (pageKey === 'question' && props.formData.question.length > 10000) {
      focusElement('va-textarea');
    } else {
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
      if (!editing) {
        dispatch(setUpdatedInReview(pageKey));
      }
    }
  };

  const editAll = (pageKeys, title) => {
    if (
      title === chapterTitles.yourContactInformation ||
      title === chapterTitles.yourInformation ||
      title === chapterTitles.yourQuestion
    ) {
      handleEdit(pageKeys[0], true, null);
    } else {
      pageKeys.forEach(key => handleEdit(key, true, null));
    }
    setEditSection([...editSection, title]);
  };

  const closeAll = (pageKeys, title) => {
    pageKeys.forEach(key => handleEdit(key, false));
    const updateViewedList = editSection.filter(section => section !== title);
    setEditSection(updateViewedList);
  };

  const handleSetData = (...args) => {
    handleDataUpdate(props.setData, args, props.onSetData);
  };

  const handleSubmit = async () => {
    setIsDisabled(true);
    setShow503Alert(false);
    try {
      await handleFormSubmission({
        formData: props.formData,
        isLoggedIn: props.loggedIn,
        isUserLOA3: props.isUserLOA3,
        onSuccess: ({ inquiryNumber, contactPreference }) => {
          dispatch(removeAskVaForm(formConfig.formId));
          props.router.push({
            pathname: '/confirmation',
            state: { contactPreference, inquiryNumber },
          });
        },
        onError: () => {
          // setIsDisabled(false);
          // TODO - need error modal instead of forwarding to confirmation per final design
          // Temporary alert dialog for testing
          scrollTo('topScrollElement', {
            duration: 500,
            delay: 0,
            smooth: true,
          });
          setShow503Alert(true);
        },
      });
    } catch (_error) {
      setIsDisabled(false);
      scrollTo('topScrollElement', {
        duration: 500,
        delay: 0,
        smooth: true,
      });
      setShow503Alert(true);
      // TODO - need error modal instead of forwarding to confirmation per final design
      // Temporary alert dialog for testing
    }
  };

  const nonEditAttachmentsMode = () => {
    const { hasAttachments: hasFiles, displayData } = getAttachmentDisplayData(
      attachments,
    );

    if (!hasFiles) {
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
      <dl className="vads-u-display--flex vads-u-justify-content--space-between">
        <dt className="vads-u-margin-right--2">Attachments</dt>
        <dd>
          <ul className="vads-u-margin-top--0 attachments-list">
            {displayData.map(file => (
              <li
                className="vads-u-margin-bottom--2 vads-u-color--link-default"
                key={`${file.id}-${file.name}`}
              >
                <va-icon icon="attach_file" size={3} />
                <DownloadLink
                  fileUrl={file.base64}
                  fileName={file.name}
                  fileSize={file.size}
                />
              </li>
            ))}
          </ul>
        </dd>
      </dl>
    );
  };

  useEffect(() => {
    getUploadedFiles().then(() => {
      focusElement('h2');
    });
  }, []);

  return (
    <article
      className="vads-u-padding-x--2p5 vads-u-padding-bottom--7"
      data-testid="review-page"
    >
      <h3 className="vads-u-margin-bottom--2">Review and submit</h3>

      <div name="topScrollElement" />
      <div name="topNavScrollElement" />
      <div className="vads-u-margin-y--3">
        {show503Alert ? (
          <VaAlert
            closeBtnAriaLabel="Close notification"
            onCloseEvent={() => setShowAlert(false)}
            status="error"
            visible
            data-testid="review-alert"
          >
            <h3 id="track-your-status-on-mobile" slot="headline">
              Ask VA isn’t working right now
            </h3>
            <div>
              <p className="vads-u-margin-y--0">
                We’re sorry. There’s a problem with our system. We can’t submit
                your question. To ask your question, call us at &nbsp;{' '}
                <va-telephone contact="8008271000" /> &nbsp;({' '}
                <va-telephone contact="711" tty="true" /> ). We’re here Monday
                through Friday, 8:00 a.m to 9:00 p.m ET.
              </p>
            </div>
          </VaAlert>
        ) : null}
      </div>
      <div className="vads-u-margin-y--3">
        {showAlert ? (
          <VaAlert
            closeBtnAriaLabel="Close notification"
            closeable
            onCloseEvent={() => setShowAlert(false)}
            status="info"
            visible
            data-testid="review-alert"
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
      <VaAccordion data-testid="review-accordion">
        {props.chapters
          .filter(chapter => chapter.name === 'categoryTopics')
          .map(chapter => {
            return (
              <VaAccordionItem
                bordered
                key={chapter.name}
                header="Category, topic, who your question is about"
                level={4}
                id={chapter.name}
                open
                className="vads-u-margin-bottom--2"
                data-testid={`review-chapter-${chapter.name}`}
              >
                <ReviewCollapsibleChapter
                  expandedPages={chapter.expandedPages}
                  chapterFormConfig={chapter.formConfig}
                  chapterKey={chapter.name}
                  // eslint-disable-next-line react/prop-types
                  form={props.form}
                  // eslint-disable-next-line react/prop-types
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
                className="vads-u-margin-bottom--2"
              >
                <ReviewCollapsibleChapter
                  expandedPages={chapter.expandedPages}
                  chapterFormConfig={chapter.formConfig}
                  chapterKey={chapter.name}
                  // eslint-disable-next-line react/prop-types
                  form={props.form}
                  // eslint-disable-next-line react/prop-types
                  formContext={props.formContext}
                  onEdit={handleEdit}
                  showButtons
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

        {hasValidValues(props.formData.aboutTheVeteran) && (
          <VaAccordionItem
            bordered
            header="Veteran's information"
            level={4}
            id="reviewVeteranInformation"
            open
            className="vads-u-margin-bottom--2"
          >
            {props.chapters
              .filter(chapter => chapter.name === 'veteransPersonalInformation')
              .map(chapter => {
                return (
                  <React.Fragment key={chapter.name}>
                    <div
                      name={`chapter${
                        chapterTitles.veteransPersonalInformation
                      }ScrollElement`}
                    />
                    {!editSection.includes(
                      chapterTitles.veteransPersonalInformation,
                    ) ? (
                      <ReviewSectionContent
                        title={chapterTitles.veteransPersonalInformation}
                        editSection={editAll}
                        keys={chapter.pageKeys}
                        items={[
                          {
                            name: 'First name',
                            data: props.formData.aboutTheVeteran.first,
                            key: 'aboutTheVeteran',
                          },
                          {
                            name: 'Middle name',
                            data: props.formData.aboutTheVeteran.middle,
                            key: 'aboutTheVeteran',
                          },
                          {
                            name: 'Last name',
                            data: props.formData.aboutTheVeteran.last,
                            key: 'aboutTheVeteran',
                          },
                          {
                            name: 'Suffix',
                            data: props.formData.aboutTheVeteran.suffix,
                            key: 'aboutTheVeteran',
                          },
                          {
                            name: 'Is the Veteran deceased?',
                            data: getYesOrNoFromBool(
                              props.formData.aboutTheVeteran.isVeteranDeceased,
                            ),
                            key: 'aboutTheVeteran',
                          },
                          {
                            name: 'Social Security number',
                            data: maskSocial(
                              props.formData.aboutTheVeteran.socialOrServiceNum
                                ?.ssn,
                            ),
                            key: 'aboutTheVeteran',
                          },
                          {
                            name: 'Service Number',
                            data:
                              props.formData.aboutTheVeteran.socialOrServiceNum
                                ?.serviceNumber,
                            key: 'aboutTheVeteran',
                          },
                          {
                            name: 'Date of birth',
                            data: convertDate(
                              props.formData.aboutTheVeteran.dateOfBirth,
                            ),
                            key: 'aboutTheVeteran',
                          },
                          {
                            name: 'Branch of service',
                            data:
                              props.formData.aboutTheVeteran.branchOfService,
                            key: 'aboutTheVeteran',
                          },
                        ]}
                      />
                    ) : (
                      <>
                        <ReviewCollapsibleChapter
                          key={chapter.name}
                          expandedPages={chapter.expandedPages}
                          chapterFormConfig={chapter.formConfig}
                          chapterKey={chapter.name}
                          // eslint-disable-next-line react/prop-types
                          form={props.form}
                          // eslint-disable-next-line react/prop-types
                          formContext={props.formContext}
                          onEdit={handleEdit}
                          showButtons={false}
                          open={chapter.open}
                          pageKeys={chapter.pageKeys}
                          pageList={getPageKeysForReview(formConfig)}
                          setData={(...args) => handleSetData(...args)}
                          setValid={props.setValid}
                          toggleButtonClicked={() =>
                            handleToggleChapter(chapter)
                          }
                          uploadFile={props.uploadFile}
                          viewedPages={
                            new Set(getPageKeysForReview(formConfig))
                          }
                          hasUnviewedPages={chapter.hasUnviewedPages}
                        />
                        <SaveCancelButtons
                          closeSection={closeAll}
                          keys={chapter.pageKeys}
                          title={chapterTitles.veteransPersonalInformation}
                          scroll={scrollToChapter}
                        />
                      </>
                    )}
                  </React.Fragment>
                );
              })}

            {props.chapters
              .filter(chapter => chapter.name === 'veteransInformation')
              .map(chapter => {
                return (
                  <ReviewCollapsibleChapter
                    key={chapter.name}
                    expandedPages={chapter.expandedPages}
                    chapterFormConfig={chapter.formConfig}
                    chapterKey={chapter.name}
                    // eslint-disable-next-line react/prop-types
                    form={props.form}
                    // eslint-disable-next-line react/prop-types
                    formContext={props.formContext}
                    onEdit={handleEdit}
                    showButtons
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
                );
              })}
          </VaAccordionItem>
        )}

        {hasValidValues(props.formData.aboutTheFamilyMember) && (
          <VaAccordionItem
            bordered
            header="Family member's information"
            level={4}
            id="reviewFamilyMemberInformation"
            open
            className="vads-u-margin-bottom--2"
          >
            {props.chapters
              .filter(
                chapter => chapter.name === 'familyMembersPersonalInformation',
              )
              .map(chapter => {
                return (
                  <React.Fragment key={chapter.name}>
                    <div
                      name={`chapter${
                        chapterTitles.familyMembersPersonalInformation
                      }ScrollElement`}
                    />
                    {!editSection.includes(
                      chapterTitles.familyMembersPersonalInformation,
                    ) ? (
                      <ReviewSectionContent
                        title={chapterTitles.familyMembersPersonalInformation}
                        editSection={editAll}
                        keys={chapter.pageKeys}
                        items={[
                          {
                            name: 'First name',
                            data: props.formData.aboutTheFamilyMember.first,
                            key: 'aboutYourFamilyMember',
                          },
                          {
                            name: 'Middle name',
                            data: props.formData.aboutTheFamilyMember.middle,
                            key: 'aboutYourFamilyMember',
                          },
                          {
                            name: 'Last name',
                            data: props.formData.aboutTheFamilyMember.last,
                            key: 'aboutYourFamilyMember',
                          },
                          {
                            name: 'Suffix',
                            data: props.formData.aboutTheFamilyMember.suffix,
                            key: 'aboutYourFamilyMember',
                          },
                          {
                            name: 'Social Security number',
                            data: maskSocial(
                              props.formData.aboutTheFamilyMember
                                .socialOrServiceNum?.ssn,
                            ),
                            key: 'aboutYourFamilyMember',
                          },
                          {
                            name: 'Date of birth',
                            data: convertDate(
                              props.formData.aboutTheFamilyMember.dateOfBirth,
                            ),
                            key: 'aboutYourFamilyMember',
                          },
                        ]}
                      />
                    ) : (
                      <>
                        <ReviewCollapsibleChapter
                          key={chapter.name}
                          expandedPages={chapter.expandedPages}
                          chapterFormConfig={chapter.formConfig}
                          chapterKey={chapter.name}
                          // eslint-disable-next-line react/prop-types
                          form={props.form}
                          // eslint-disable-next-line react/prop-types
                          formContext={props.formContext}
                          onEdit={handleEdit}
                          showButtons={false}
                          open={chapter.open}
                          pageKeys={chapter.pageKeys}
                          pageList={getPageKeysForReview(formConfig)}
                          setData={(...args) => handleSetData(...args)}
                          setValid={props.setValid}
                          toggleButtonClicked={() =>
                            handleToggleChapter(chapter)
                          }
                          uploadFile={props.uploadFile}
                          viewedPages={
                            new Set(getPageKeysForReview(formConfig))
                          }
                          hasUnviewedPages={chapter.hasUnviewedPages}
                        />
                        <SaveCancelButtons
                          closeSection={closeAll}
                          keys={chapter.pageKeys}
                          title={chapterTitles.familyMembersPersonalInformation}
                          scroll={scrollToChapter}
                        />
                      </>
                    )}
                  </React.Fragment>
                );
              })}

            {props.chapters
              .filter(chapter => chapter.name === 'familyMembersInformation')
              .map(chapter => {
                return (
                  <ReviewCollapsibleChapter
                    key={chapter.name}
                    expandedPages={chapter.expandedPages}
                    chapterFormConfig={chapter.formConfig}
                    chapterKey={chapter.name}
                    // eslint-disable-next-line react/prop-types
                    form={props.form}
                    // eslint-disable-next-line react/prop-types
                    formContext={props.formContext}
                    onEdit={handleEdit}
                    showButtons
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
                );
              })}
          </VaAccordionItem>
        )}

        <VaAccordionItem
          bordered
          header="Your information"
          level={4}
          id="reviewYourInformation"
          open
          className="vads-u-margin-bottom--2"
        >
          {props.chapters
            .filter(chapter => chapter.name === 'yourInformation')
            .map(chapter => {
              return (
                <React.Fragment key={chapter.name}>
                  <div
                    name={`chapter${
                      chapterTitles.yourInformation
                    }ScrollElement`}
                  />
                  {!editSection.includes(chapterTitles.yourInformation) ? (
                    <ReviewSectionContent
                      title={chapterTitles.yourInformation}
                      editSection={editAll}
                      keys={chapter.pageKeys}
                      items={[
                        {
                          name: 'First name',
                          data: props.formData.aboutYourself.first,
                          key: 'aboutYourself',
                        },
                        {
                          name: 'Middle name',
                          data: props.formData.aboutYourself.middle,
                          key: 'aboutYourselfRelationshipFamilyMember',
                        },
                        {
                          name: 'Last name',
                          data: props.formData.aboutYourself.last,
                          key: 'aboutYourselfGeneral',
                        },
                        {
                          name: 'Suffix',
                          data: props.formData.aboutYourself.suffix,
                          key: 'aboutYourselfGeneral',
                        },
                        {
                          name: 'Social Security number',
                          data: maskSocial(
                            props.formData.aboutYourself.socialOrServiceNum
                              ?.ssn,
                          ),
                          key: 'aboutYourselfRelationshipFamilyMember',
                        },
                        {
                          name: 'Service Number',
                          data:
                            props.formData.aboutYourself.socialOrServiceNum
                              ?.serviceNumber,
                          key: 'aboutYourselfGeneral',
                        },
                        {
                          name: 'Date of birth',
                          data: convertDate(
                            props.formData.aboutYourself.dateOfBirth,
                          ),
                          key: 'aboutYourselfRelationshipFamilyMember',
                        },
                        {
                          name: 'Branch of service',
                          data: props.formData.aboutYourself.branchOfService,
                          key: 'aboutYourselfGeneral',
                        },
                      ]}
                    />
                  ) : (
                    <>
                      <ReviewCollapsibleChapter
                        key={chapter.name}
                        expandedPages={chapter.expandedPages}
                        chapterFormConfig={chapter.formConfig}
                        chapterKey={chapter.name}
                        // eslint-disable-next-line react/prop-types
                        form={props.form}
                        // eslint-disable-next-line react/prop-types
                        formContext={props.formContext}
                        onEdit={handleEdit}
                        showButtons={false}
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
                      <SaveCancelButtons
                        closeSection={closeAll}
                        keys={chapter.pageKeys}
                        title={chapterTitles.yourInformation}
                        scroll={scrollToChapter}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}

          {props.chapters
            .filter(chapter => chapter.name === 'yourPostalCode')
            .map(chapter => {
              return (
                <React.Fragment key={chapter.name}>
                  <div
                    name={`chapter${chapterTitles.yourPostalCode}ScrollElement`}
                    key={chapter.name}
                  />
                  {!editSection.includes(chapterTitles.yourPostalCode) ? (
                    <ReviewSectionContent
                      title={chapterTitles.yourPostalCode}
                      editSection={editAll}
                      keys={chapter.pageKeys}
                      items={[
                        {
                          name: 'Postal code',
                          data: props.formData.yourPostalCode,
                          key: 'yourPostalCode',
                        },
                      ]}
                    />
                  ) : (
                    <>
                      <ReviewCollapsibleChapter
                        expandedPages={chapter.expandedPages}
                        chapterFormConfig={chapter.formConfig}
                        chapterKey={chapter.name}
                        // eslint-disable-next-line react/prop-types
                        form={props.form}
                        // eslint-disable-next-line react/prop-types
                        formContext={props.formContext}
                        onEdit={handleEdit}
                        showButtons={false}
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
                      <SaveCancelButtons
                        closeSection={closeAll}
                        keys={chapter.pageKeys}
                        title={chapterTitles.yourPostalCode}
                        scroll={scrollToChapter}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}

          {props.chapters
            .filter(chapter => chapter.name === 'yourVAHealthFacility')
            .map(chapter => {
              return (
                <React.Fragment key={chapter.name}>
                  <div
                    name={`chapter${
                      chapterTitles.yourVAHealthFacility
                    }ScrollElement`}
                  />
                  {!editSection.includes(chapterTitles.yourVAHealthFacility) ? (
                    <ReviewSectionContent
                      title={chapterTitles.yourVAHealthFacility}
                      editSection={editAll}
                      keys={chapter.pageKeys}
                      items={[
                        {
                          name: 'Your VA health facility',
                          data: props.askVA.vaHealthFacility,
                          key: 'yourVAHealthFacility',
                        },
                      ]}
                    />
                  ) : (
                    <>
                      <ReviewCollapsibleChapter
                        expandedPages={chapter.expandedPages}
                        chapterFormConfig={chapter.formConfig}
                        chapterKey={chapter.name}
                        // eslint-disable-next-line react/prop-types
                        form={props.form}
                        // eslint-disable-next-line react/prop-types
                        formContext={props.formContext}
                        onEdit={handleEdit}
                        showButtons={false}
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
                      <SaveCancelButtons
                        closeSection={closeAll}
                        keys={chapter.pageKeys}
                        title={chapterTitles.yourVAHealthFacility}
                        scroll={scrollToChapter}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}

          {props.chapters
            .filter(chapter => chapter.name === 'stateOfProperty')
            .map(chapter => {
              return (
                <React.Fragment key={chapter.name}>
                  <div
                    name={`chapter${
                      chapterTitles.stateOfProperty
                    }ScrollElement`}
                  />
                  {!editSection.includes(chapterTitles.stateOfProperty) ? (
                    <ReviewSectionContent
                      title={chapterTitles.stateOfProperty}
                      editSection={editAll}
                      keys={chapter.pageKeys}
                      items={[
                        {
                          name: 'State',
                          data: props.formData.stateOfProperty,
                          key: 'stateOfProperty',
                        },
                      ]}
                    />
                  ) : (
                    <>
                      <ReviewCollapsibleChapter
                        expandedPages={chapter.expandedPages}
                        chapterFormConfig={chapter.formConfig}
                        chapterKey={chapter.name}
                        // eslint-disable-next-line react/prop-types
                        form={props.form}
                        // eslint-disable-next-line react/prop-types
                        formContext={props.formContext}
                        onEdit={handleEdit}
                        showButtons={false}
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
                      <SaveCancelButtons
                        closeSection={closeAll}
                        keys={chapter.pageKeys}
                        title={chapterTitles.stateOfProperty}
                        scroll={scrollToChapter}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}

          {props.chapters
            .filter(chapter => chapter.name === 'yourVREInformation')
            .map(chapter => {
              return (
                <React.Fragment key={chapter.name}>
                  <div
                    name={`chapter${
                      chapterTitles.yourVREInformation
                    }ScrollElement`}
                  />
                  {!editSection.includes(chapterTitles.yourVREInformation) ? (
                    <ReviewSectionContent
                      title={chapterTitles.yourVREInformation}
                      editSection={editAll}
                      keys={chapter.pageKeys}
                      items={[
                        {
                          name:
                            'Have you every applied for Veteran Readiness & Employment benefits and services?',
                          data: getYesOrNoFromBool(
                            props.formData.yourVREInformation,
                          ),
                          key: 'yourVREInformation',
                        },
                        {
                          name: 'Veteran Readiness and Employment counselor',
                          data: props.formData.yourVRECounselor,
                          key: 'yourVRECounselor',
                        },
                      ]}
                    />
                  ) : (
                    <>
                      <ReviewCollapsibleChapter
                        expandedPages={chapter.expandedPages}
                        chapterFormConfig={chapter.formConfig}
                        chapterKey={chapter.name}
                        // eslint-disable-next-line react/prop-types
                        form={props.form}
                        // eslint-disable-next-line react/prop-types
                        formContext={props.formContext}
                        onEdit={handleEdit}
                        showButtons={false}
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
                      <SaveCancelButtons
                        closeSection={closeAll}
                        keys={chapter.pageKeys}
                        title={chapterTitles.yourVREInformation}
                        scroll={scrollToChapter}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}

          {props.chapters
            .filter(chapter => chapter.name === 'schoolInformation')
            .map(chapter => {
              return (
                <React.Fragment key={chapter.name}>
                  <div
                    name={`chapter${
                      chapterTitles.schoolInformation
                    }ScrollElement`}
                  />
                  {!editSection.includes(chapterTitles.schoolInformation) ? (
                    <ReviewSectionContent
                      title={chapterTitles.schoolInformation}
                      editSection={editAll} // use pagesToMoveConfig if combining pages
                      keys={pagesToMoveConfig.schoolInformation}
                      items={[
                        {
                          name: 'School facility',
                          data: props.formData.school
                            ? props.formData.school
                            : getSchoolString(
                                props.formData.schoolInfo?.schoolFacilityCode,
                                props.formData.schoolInfo?.schoolName,
                              ),
                          key: 'searchSchools',
                        },
                        {
                          name: 'State of school',
                          data: props.formData.stateOfTheSchool,
                          key: 'stateOfSchool',
                        },
                        {
                          name: 'State of facility',
                          data: props.formData.stateOfTheFacility,
                          key: 'stateOfFacility',
                        },
                        {
                          name: 'School state',
                          data: props.formData.stateOrResidency.schoolState,
                          key: 'schoolStOrResidency',
                        },
                        {
                          name: 'Residency state',
                          data: props.formData.stateOrResidency.residencyState,
                          key: 'schoolStOrResidency',
                        },
                      ]}
                    />
                  ) : (
                    <>
                      <ReviewCollapsibleChapter
                        expandedPages={chapter.expandedPages}
                        chapterFormConfig={chapter.formConfig}
                        chapterKey={chapter.name}
                        // eslint-disable-next-line react/prop-types
                        form={props.form}
                        // eslint-disable-next-line react/prop-types
                        formContext={props.formContext}
                        onEdit={handleEdit}
                        showButtons={false}
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
                      <SaveCancelButtons
                        closeSection={closeAll}
                        keys={chapter.pageKeys}
                        title={chapterTitles.schoolInformation}
                        scroll={scrollToChapter}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}

          {props.chapters
            .filter(chapter => chapter.name === 'yourContactInformation')
            .map(chapter => {
              return (
                <React.Fragment key={chapter.name}>
                  <div
                    name={`chapter${
                      chapterTitles.yourContactInformation
                    }ScrollElement`}
                    key={chapter.name}
                  />
                  {!editSection.includes(
                    chapterTitles.yourContactInformation,
                  ) ? (
                    <ReviewSectionContent
                      title={chapterTitles.yourContactInformation}
                      editSection={editAll}
                      // use chapter.pageKeys if data is collected on one page
                      keys={chapter.pageKeys}
                      items={[
                        {
                          name: 'Phone number',
                          data:
                            props.formData.relationshipToVeteran ===
                            relationshipOptionsSomeoneElse.WORK
                              ? props.formData.businessPhone
                              : props.formData.phoneNumber,
                          key: 'yourContactInformation',
                        },
                        {
                          name: 'Email address',
                          data:
                            props.formData.relationshipToVeteran ===
                            relationshipOptionsSomeoneElse.WORK
                              ? props.formData.businessEmail
                              : props.formData.emailAddress,
                          key: 'yourContactInformation',
                        },
                        {
                          name: 'How should we contact you?',
                          data: props.formData.contactPreference,
                          key: 'yourContactInformation',
                        },
                        {
                          name: 'Preferred name',
                          data: props.formData.preferredName,
                          key: 'yourContactInformation',
                        },
                        // {
                        //   name: 'Pronouns',
                        //   data: getPronouns(props.formData.pronouns),
                        //   key: 'yourContactInformation',
                        // },
                        // {
                        //   name:
                        //     "My pronouns aren't listed, and are written here",
                        //   data: props.formData.pronounsNotListedText,
                        //   key: 'yourContactInformation',
                        // },
                      ]}
                    />
                  ) : (
                    <>
                      <ReviewCollapsibleChapter
                        expandedPages={chapter.expandedPages}
                        chapterFormConfig={chapter.formConfig}
                        chapterKey={chapter.name}
                        // eslint-disable-next-line react/prop-types
                        form={props.form}
                        // eslint-disable-next-line react/prop-types
                        formContext={props.formContext}
                        onEdit={handleEdit}
                        showButtons={false}
                        open={chapter.open}
                        pageKeys={chapter.pageKeys.filter(key => key)}
                        pageList={getPageKeysForReview(formConfig)}
                        setData={(...args) => handleSetData(...args)}
                        setValid={props.setValid}
                        toggleButtonClicked={() => handleToggleChapter(chapter)}
                        uploadFile={props.uploadFile}
                        viewedPages={new Set(getPageKeysForReview(formConfig))}
                        hasUnviewedPages={chapter.hasUnviewedPages}
                      />
                      <SaveCancelButtons
                        closeSection={closeAll}
                        keys={chapter.pageKeys}
                        title={chapterTitles.yourContactInformation}
                        scroll={scrollToChapter}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}

          {props.chapters
            .filter(chapter => chapter.name === 'yourMailingAddress')
            .map(chapter => {
              return (
                <React.Fragment key={chapter.name}>
                  <div
                    name={`chapter${
                      chapterTitles.yourMailingAddress
                    }ScrollElement`}
                    key={chapter.name}
                  />
                  {!editSection.includes(chapterTitles.yourMailingAddress) ? (
                    <ReviewSectionContent
                      title={chapterTitles.yourMailingAddress}
                      editSection={editAll}
                      keys={chapter.pageKeys}
                      items={[
                        {
                          name: 'Country',
                          data: props.formData.country,
                          key: 'yourMailingAddress',
                        },
                        {
                          name: 'Street address',
                          data: props.formData.address.street,
                          key: 'yourMailingAddress',
                        },
                        {
                          name: 'Apartment or unit number',
                          data: props.formData.address.unitNumber,
                          key: 'yourMailingAddress',
                        },
                        {
                          name: 'Street address 2',
                          data: props.formData.address.street2,
                          key: 'yourMailingAddress',
                        },
                        {
                          name: 'Street address 3',
                          data: props.formData.address.street3,
                          key: 'yourMailingAddress',
                        },
                        {
                          name: props.formData.onBaseOutsideUS
                            ? 'Post office'
                            : 'City',
                          data: props.formData.onBaseOutsideUS
                            ? props.formData.address.militaryAddress
                                .militaryPostOffice
                            : props.formData.address.city,
                          key: 'yourMailingAddress',
                        },
                        {
                          name: props.formData.onBaseOutsideUS
                            ? 'Region'
                            : 'State',
                          ata: props.formData.onBaseOutsideUS
                            ? props.formData.address.militaryAddress
                                .militaryState
                            : props.formData.address.state,
                          key: 'yourMailingAddress',
                        },
                        {
                          name: 'Postal code',
                          data: props.formData.address.postalCode,
                          key: 'yourMailingAddress',
                        },
                      ]}
                    />
                  ) : (
                    <>
                      <ReviewCollapsibleChapter
                        expandedPages={chapter.expandedPages}
                        chapterFormConfig={chapter.formConfig}
                        chapterKey={chapter.name}
                        // eslint-disable-next-line react/prop-types
                        form={props.form}
                        // eslint-disable-next-line react/prop-types
                        formContext={props.formContext}
                        onEdit={handleEdit}
                        showButtons={false}
                        open={chapter.open}
                        pageKeys={chapter.pageKeys.filter(key => key)}
                        pageList={getPageKeysForReview(formConfig)}
                        setData={(...args) => handleSetData(...args)}
                        setValid={props.setValid}
                        toggleButtonClicked={() => handleToggleChapter(chapter)}
                        uploadFile={props.uploadFile}
                        viewedPages={new Set(getPageKeysForReview(formConfig))}
                        hasUnviewedPages={chapter.hasUnviewedPages}
                      />
                      <SaveCancelButtons
                        closeSection={closeAll}
                        keys={chapter.pageKeys}
                        title={chapterTitles.yourMailingAddress}
                        scroll={scrollToChapter}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}
        </VaAccordionItem>

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
                <>
                  <div
                    name={`chapter${chapterTitles.yourQuestion}ScrollElement`}
                  />
                </>
                {!editSection.includes(chapterTitles.yourQuestion) ? (
                  <ReviewSectionContent
                    editSection={editAll}
                    keys={chapter.pageKeys}
                    items={[
                      {
                        name: 'Subject',
                        data: props.formData.subject,
                        key: 'question',
                      },
                      {
                        name: "What's your question?",
                        data: props.formData.question,
                        key: 'question',
                      },
                    ]}
                  />
                ) : (
                  <ReviewCollapsibleChapter
                    expandedPages={chapter.expandedPages}
                    chapterFormConfig={chapter.formConfig}
                    chapterKey={chapter.name}
                    // eslint-disable-next-line react/prop-types
                    form={props.form}
                    // eslint-disable-next-line react/prop-types
                    formContext={props.formContext}
                    onEdit={handleEdit}
                    showButtons
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
                )}
                {props.formData.allowAttachments &&
                  props.isUserLOA3 && (
                    <div
                      className="schemaform-chapter-accordion-content vads-u-padding-top--0"
                      aria-hidden="false"
                    >
                      <div className="form-review-panel-page vads-u-margin-bottom--0">
                        <div name="questionScrollElement" />
                        <form className="rjsf">
                          <div className="vads-u-width--full vads-u-justify-content--space-between vads-u-align-items--center">
                            <div className="review vads-u-margin-top--0 vads-u-margin-bottom--0">
                              <div className="review-row vads-u-border-top--0 vads-u-margin-top--0 vads-u-margin-bottom--0">
                                {!editAttachments ? (
                                  nonEditAttachmentsMode()
                                ) : (
                                  <>
                                    {attachments.map(file => (
                                      <dl
                                        key={`${file.fileID}-${
                                          file.fileName
                                        }-edit`}
                                        className="review-page-attachments"
                                      >
                                        <dt className="form-review-panel-page-header">
                                          {`${file.fileName} (${
                                            file.fileSize
                                          })`}
                                        </dt>
                                        <dd className="vads-u-margin-right--0">
                                          <va-button-icon
                                            button-type="delete"
                                            onClick={() =>
                                              deleteFile(file.fileID)
                                            }
                                          />
                                        </dd>
                                      </dl>
                                    ))}
                                    <div className="vads-u-margin-y--2">
                                      <FileUpload />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
              </VaAccordionItem>
            );
          })}
      </VaAccordion>

      <div className="vads-u-margin-top--4 vads-u-display--flex">
        <va-button back onClick={() => props.goBack()} />
        {isDisabled ? (
          <va-button text="Submit question" disabled loading />
        ) : (
          <va-button text="Submit question" onClick={handleSubmit} />
        )}
      </div>
    </article>
  );
};

function mapStateToProps(state, ownProps) {
  const { formContext } = ownProps;
  const loggedIn = isLoggedIn(state);
  const isUserLOA3 = isLOA3(state);
  const { form, askVA } = state;
  const formData = form.data;
  const { openChapters } = askVA.reviewPageView;
  const viewedPages = getViewedPages(state);

  const { pagesByChapter, modifiedFormConfig } = createPageListByChapterAskVa(
    formConfig,
    pagesToMoveConfig,
  );

  const chapterNames = [
    'categoryTopics',
    'yourQuestion',
    'relationshipToTheVeteran',
    'yourInformation',
    'veteransPersonalInformation',
    'veteransInformation',
    'familyMembersPersonalInformation',
    'familyMembersInformation',
    'yourContactInformation',
    'schoolInformation',
    'yourVAHealthFacility',
    'yourVREInformation',
    'yourMailingAddress',
    'stateOfProperty',
    'yourPostalCode',
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
    isUserLOA3,
  };
}

ReviewPage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  askVA: PropTypes.object,
  chapters: PropTypes.array, // Of what?
  formData: PropTypes.object, // Shape?
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  isUserLOA3: PropTypes.bool,
  loggedIn: PropTypes.bool,
  setData: PropTypes.func,
  setEditMode: PropTypes.func,
  setValid: PropTypes.func,
  setViewedPages: PropTypes.func,
  uploadFile: PropTypes.func,
  onSetData: PropTypes.func,
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
