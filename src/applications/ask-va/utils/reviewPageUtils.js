import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { formatDate } from '../config/helpers';
import submitTransformer from '../config/submit-transformer';
import { URL, envUrl, mockTestingFlagforAPI } from '../constants';
import { mockSubmitResponse } from './mockData';
import { askVAAttachmentStorage } from './StorageAdapter';

export const getYesOrNoFromBool = answer => (answer ? 'Yes' : 'No');

export const convertDate = dob => {
  if (dob) {
    const bDay = dob.split('-');
    const date = `${bDay[1]}/${bDay[2]}/${bDay[0]}`;
    return formatDate(date, 'long');
  }
  return null;
};

export const getSchoolString = (code, name) => {
  if (code && name) return `${code} - ${name}`;
  return null;
};

export const getAttachmentDisplayData = (attachments = []) => {
  if (attachments.length === 0) {
    return {
      hasAttachments: false,
      displayData: null,
    };
  }

  return {
    hasAttachments: true,
    displayData: attachments.map(file => ({
      id: file.fileID,
      name: file.fileName,
      size: file.fileSize,
      base64: file.base64,
    })),
  };
};

export const getStoredAttachments = async () => {
  try {
    const storedFiles = await askVAAttachmentStorage.get('attachments');
    return storedFiles || [];
  } catch (error) {
    return [];
  }
};

export const deleteStoredFile = async fileID => {
  try {
    const uploadedFiles = await askVAAttachmentStorage.get('attachments');
    if (!uploadedFiles) return [];

    const remainingFiles = uploadedFiles.filter(file => file.fileID !== fileID);
    if (remainingFiles.length < uploadedFiles.length) {
      await askVAAttachmentStorage.set('attachments', remainingFiles);
    }
    return remainingFiles;
  } catch (error) {
    return [];
  }
};

export const scrollToElement = (elementKey, options = {}) => {
  const defaultOptions = {
    duration: 500,
    delay: 2,
    smooth: true,
  };

  if (typeof window !== 'undefined' && window.Forms?.scroll) {
    return window.Forms.scroll;
  }

  return { ...defaultOptions, ...options };
};

export const handleChapterToggle = (isOpen, chapterName, pageKeys) => {
  return {
    shouldClose: isOpen,
    chapterName,
    affectedPages: pageKeys,
  };
};

export const handleEditMode = (
  pageKey,
  editing,
  index = null,
  options = {},
) => {
  const { setViewedPages, setEditMode, setUpdatedInReview } = options;
  const fullPageKey = `${pageKey}${index === null ? '' : index}`;

  if (editing) {
    setViewedPages?.([fullPageKey]);
    setUpdatedInReview?.('');
  }

  setEditMode?.(pageKey, editing, index);

  if (!editing) {
    setUpdatedInReview?.(pageKey);
  }

  return fullPageKey;
};

export const handleSectionEdit = (
  action,
  { pageKeys, title, editSection = [], onEdit },
) => {
  if (action === 'edit') {
    if (title === 'Your Contact Information' || title === 'Your Information') {
      onEdit?.(pageKeys[0], true, null);
    } else {
      pageKeys.forEach(key => onEdit?.(key, true, null));
    }
    return [...editSection, title];
  }
  if (action === 'close') {
    pageKeys.forEach(key => onEdit?.(key, false));
    return editSection.filter(section => section !== title);
  }
  return editSection;
};

export const submitFormData = async ({
  url,
  data,
  onSuccess,
  onError,
  mockEnabled = false,
}) => {
  if (mockEnabled) {
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => {
        onSuccess?.(mockSubmitResponse);
        resolve(mockSubmitResponse);
      }, 500);
    });
  }

  try {
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await apiRequest(url, options);

    if (!response || !response.inquiryNumber) {
      onError?.(`Backend API call failed. Inquiry number not found.`);
      return `Backend API call failed. Inquiry number not found.`;
    }
    onSuccess?.(response);
    return response;
  } catch (error) {
    onError?.(error);
    throw error;
  }
};

export const handleFormSubmission = async ({
  formData,
  isLoggedIn,
  isUserLOA3,
  onSuccess,
  onError,
}) => {
  try {
    const files = await askVAAttachmentStorage
      .get('attachments')
      .catch(error => {
        onError?.(error);
        return [];
      });
    const transformedData = submitTransformer(formData, files);

    const url = `${envUrl}${
      (isLoggedIn && isUserLOA3) || transformedData.requireSignIn
        ? URL.AUTH_INQUIRIES
        : URL.INQUIRIES
    }`;

    return await submitFormData({
      url,
      data: transformedData,
      onSuccess: response => {
        const { inquiryNumber } = response;
        const contactPreference = formData.contactPreference || 'Email';
        askVAAttachmentStorage.clear();
        onSuccess?.({ inquiryNumber, contactPreference });
      },
      onError,
      mockEnabled: mockTestingFlagforAPI,
    });
  } catch (error) {
    onError?.(error);
    return null;
  }
};

export const handleDataUpdate = (setData, args, onSetData) => {
  setData(...args);
  onSetData?.();
};
