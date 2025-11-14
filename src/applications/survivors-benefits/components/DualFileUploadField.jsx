import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import debounce from 'platform/utilities/data/debounce';
import { isEmpty } from 'lodash';
import {
  MISSING_PASSWORD_ERROR,
  MISSING_ADDITIONAL_INFO,
} from 'platform/forms-system/src/js/validation';
import {
  useFileUpload,
  DEBOUNCE_WAIT,
  getFileError,
  simulateUploadMultiple,
} from 'platform/forms-system/src/js/web-component-fields/vaFileInputFieldHelpers';
import vaFileInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaFileInputFieldMapping';
import { errorManager } from 'platform/forms-system/src/js/utilities/file/passwordErrorState';

import uploadPdfToIdp from '../utils/idpUpload';
import processUploadedDocument from '../utils/idpWorkflow';

const createTrackingKey = file => {
  const stamp = Date.now();
  return `${file?.name || 'file'}-${file?.size || 0}-${file?.lastModified ||
    stamp}-${stamp}`;
};

const ensureTrackingKey = file => {
  if (!file) {
    return undefined;
  }
  if (!file.__sbTrackingKey) {
    Object.defineProperty(file, '__sbTrackingKey', {
      value: createTrackingKey(file),
      configurable: true,
      enumerable: false,
      writable: false,
    });
  }
  return file.__sbTrackingKey;
};

const extractPrimarySections = sections => {
  if (!sections) return null;
  const primary = {};
  Object.entries(sections).forEach(([docType, entries]) => {
    if (Array.isArray(entries) && entries.length) {
      const [primaryEntry] = entries;
      primary[docType] = primaryEntry;
    }
  });
  return Object.keys(primary).length ? primary : null;
};

const sectionsChanged = (currentSections, nextSections) => {
  const currentKeys = new Set(Object.keys(currentSections || {}));
  const nextKeys = new Set(Object.keys(nextSections || {}));
  if (currentKeys.size !== nextKeys.size) {
    return true;
  }
  for (const key of nextKeys) {
    const currentValue = currentSections?.[key];
    const nextValue = nextSections?.[key];
    if (JSON.stringify(currentValue) !== JSON.stringify(nextValue)) {
      return true;
    }
  }
  return false;
};

const mergeSecondaryInfo = (fileEntry, info, defaultStatus = 'pending') => {
  if (!info) {
    if (fileEntry.idpUploadStatus === defaultStatus) {
      return fileEntry;
    }
    return { ...fileEntry, idpUploadStatus: defaultStatus };
  }

  let changed = false;
  const next = { ...fileEntry };

  if (info.status && info.status !== fileEntry.idpUploadStatus) {
    next.idpUploadStatus = info.status;
    changed = true;
  } else if (!info.status && fileEntry.idpUploadStatus !== defaultStatus) {
    next.idpUploadStatus = defaultStatus;
    changed = true;
  }

  if (info.contract) {
    const { id, bucket, pdfKey } = info.contract;
    if (id && id !== fileEntry.idpDocumentId) {
      next.idpDocumentId = id;
      changed = true;
    }
    if (bucket && bucket !== fileEntry.idpBucket) {
      next.idpBucket = bucket;
      changed = true;
    }
    if (pdfKey && pdfKey !== fileEntry.idpPdfKey) {
      next.idpPdfKey = pdfKey;
      changed = true;
    }
  }

  if (info.sections) {
    const primarySections = extractPrimarySections(info.sections);
    if (primarySections) {
      if (
        !next.idpSections ||
        sectionsChanged(next.idpSections, primarySections)
      ) {
        next.idpSections = primarySections;
        changed = true;
      }
      next.idpArtifacts = info.sections;
    }
  }

  if (info.error) {
    if (info.error !== fileEntry.idpUploadError) {
      next.idpUploadError = info.error;
      changed = true;
    }
  } else if (fileEntry.idpUploadError) {
    delete next.idpUploadError;
    changed = true;
  }

  return changed ? next : fileEntry;
};

const ACTIVE_SECONDARY_STATUSES = new Set(['pending', 'processing', 'success']);
const RETRIABLE_SECONDARY_STATUSES = new Set(['error', 'skipped']);

const DualFileUploadField = props => {
  const { uiOptions = {}, childrenProps = {} } = props;
  const [encrypted, setEncrypted] = useState([]);
  const [errors, setErrors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [percentsUploaded, setPercentsUploaded] = useState([]);
  const [initPoll, setInitPoll] = useState(true);
  const [secondaryUploads, setSecondaryUploads] = useState({});
  const dispatch = useDispatch();
  const primaryUploadsRef = useRef({});
  const secondaryStatusRef = useRef({});
  const { percentUploaded, handleUpload } = useFileUpload(
    uiOptions.fileUploadUrl,
    uiOptions.accept,
    uiOptions.formNumber,
    dispatch,
  );
  const componentRef = useRef(null);
  const isMountedRef = useRef(true);
  const mappedProps = vaFileInputFieldMapping(props);
  const mappedUploadedFiles = mappedProps.uploadedFiles;
  const childFormDataRaw = childrenProps?.formData;
  const childFormData = useMemo(() => childFormDataRaw || [], [
    childFormDataRaw,
  ]);
  const childOnChange = childrenProps?.onChange;
  const childUiSchema = childrenProps?.uiSchema;
  const {
    additionalInputUpdate,
    maxFileSize,
    minFileSize,
    skipUpload = false,
  } = uiOptions;

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setSecondaryUpload = (trackingKey, payload) => {
    if (!trackingKey || !isMountedRef.current) {
      return;
    }
    setSecondaryUploads(prev => {
      const prevEntry = prev[trackingKey] || {};
      const nextEntry = { ...prevEntry, ...payload };

      const entriesEqual =
        prevEntry.status === nextEntry.status &&
        prevEntry.error === nextEntry.error &&
        prevEntry.name === nextEntry.name &&
        prevEntry.size === nextEntry.size &&
        prevEntry.lastModified === nextEntry.lastModified &&
        prevEntry.contract === nextEntry.contract &&
        prevEntry.idpDocumentId === nextEntry.idpDocumentId &&
        JSON.stringify(prevEntry.sections || {}) ===
          JSON.stringify(nextEntry.sections || {});

      if (entriesEqual) {
        return prev;
      }

      return {
        ...prev,
        [trackingKey]: nextEntry,
      };
    });
  };

  useEffect(
    () => {
      const formData = childFormData || [];
      const usedKeys = new Set();
      let changed = false;
      const next = formData.map(entry => {
        const existingKey = entry?.idpTrackingKey;
        let info = existingKey ? secondaryUploads[existingKey] : null;
        let resolvedKey = existingKey;

        if (!info) {
          const match = Object.entries(secondaryUploads).find(
            ([key, value]) =>
              !usedKeys.has(key) &&
              value?.name === entry?.name &&
              value?.size === entry?.size &&
              value?.lastModified === entry?.lastModified,
          );
          if (match) {
            const [matchedKey, matchedInfo] = match;
            resolvedKey = matchedKey;
            info = matchedInfo;
          }
        }

        if (!info) {
          return entry;
        }

        usedKeys.add(resolvedKey);

        const baseEntry =
          resolvedKey && resolvedKey !== existingKey
            ? { ...entry, idpTrackingKey: resolvedKey }
            : entry;
        const merged = mergeSecondaryInfo(baseEntry, info);
        if (merged !== baseEntry) {
          changed = true;
        }
        return merged;
      });
      if (changed) {
        childOnChange(next);
      }
    },
    [secondaryUploads, childFormData, childOnChange],
  );

  useEffect(
    () => {
      const doPrefill =
        Array.isArray(mappedUploadedFiles) && componentRef.current;
      if (doPrefill) {
        const nulls = new Array(childFormData.length).fill(null);
        setErrors([...nulls]);
        setEncrypted([...nulls]);
        childFormData.forEach((_, i) => errorManager.addPasswordInstance(i));
        setCurrentIndex(childFormData.length - 1);
        componentRef.current.value = mappedUploadedFiles;
      }
    },
    [childFormData, mappedUploadedFiles],
  );

  useEffect(
    () => {
      if (currentIndex < 0) {
        return;
      }
      setPercentsUploaded(prev => {
        const next = [...prev];
        if (next[currentIndex] === percentUploaded) {
          return next;
        }
        next[currentIndex] = percentUploaded;
        return next;
      });
    },
    [currentIndex, percentUploaded],
  );

  function getSlotContent() {
    const slot = componentRef.current?.shadowRoot
      ?.querySelector('va-file-input')
      ?.shadowRoot?.querySelector('slot');
    if (slot) {
      const [slotContent] =
        slot?.assignedElements?.({ flatten: true }) ||
        slot?.assignedNodes().filter(n => n.nodeType === 1);
      return !!slotContent;
    }
    return false;
  }

  useEffect(
    () => {
      function updateAdditionalInputs() {
        childFormData.forEach((_, index) => {
          const instance = componentRef.current?.shadowRoot?.getElementById(
            `instance-${index}`,
          );
          if (instance) {
            const slot = instance.shadowRoot.querySelector('slot');
            if (!slot) return;
            const [slotContent] =
              slot?.assignedElements?.({ flatten: true }) ||
              slot?.assignedNodes().filter(n => n.nodeType === 1);
            if (slotContent) {
              setInitPoll(false);
              const file = childFormData[index];
              const _isEmpty = !file || (file && isEmpty(file.additionalData));
              const additionalInputError =
                _isEmpty &&
                index < errorManager.getLastTouched() &&
                !instance.getAttribute('error')
                  ? childUiSchema?.['ui:errorMessages']?.additionalInput ||
                    MISSING_ADDITIONAL_INFO
                  : '';
              const additionalData = file?.additionalData || null;
              if (typeof additionalInputUpdate === 'function') {
                additionalInputUpdate(
                  slotContent.firstElementChild,
                  additionalInputError,
                  additionalData,
                );
              }
            }
          }
        });
      }

      const WAIT = 50;
      const MAXLOOP = 2000 / WAIT;
      let timeoutId = null;

      const poll = attempt => {
        const ready = getSlotContent();
        if (ready) {
          updateAdditionalInputs();
          return;
        }
        if (attempt >= MAXLOOP) {
          setInitPoll(false);
          return;
        }
        timeoutId = setTimeout(() => poll(attempt + 1), WAIT);
      };

      if (initPoll) {
        poll(0);
      }

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    },
    [childFormData, childUiSchema, initPoll, additionalInputUpdate],
  );

  const assignFileUploadToStore = useCallback(
    (uploadedFile, index) => {
      if (!uploadedFile) return;

      const { file, ...rest } = uploadedFile;

      const { name, size, type, lastModified } = file;
      const trackingKey = file?.__sbTrackingKey;
      const secondaryInfo = trackingKey ? secondaryUploads[trackingKey] : null;

      const newFile = mergeSecondaryInfo(
        {
          ...rest,
          name,
          size,
          type,
          lastModified,
          idpTrackingKey: trackingKey,
          idpUploadStatus: secondaryInfo?.status || 'pending',
        },
        secondaryInfo,
      );

      const existingFile = childFormData[index];
      let files;
      if (existingFile) {
        if (encrypted[index] && existingFile.additionalData) {
          newFile.additionalData = existingFile.additionalData;
        }
        files = [...childFormData];
        files[index] = newFile;
      } else {
        files = [...childFormData, newFile];
      }
      childOnChange(files);
    },
    [childFormData, childOnChange, encrypted, secondaryUploads],
  );

  const handleFileProcessing = useCallback(
    (uploadedFile, index) => {
      if (!uploadedFile || !uploadedFile.file) return;

      const _error = uploadedFile.errorMessage || null;
      setErrors(prev => {
        const next = [...prev];
        next[index] = _error;
        return next;
      });
      assignFileUploadToStore(uploadedFile, index);

      const trackingKey = uploadedFile.file?.__sbTrackingKey;
      if (trackingKey) {
        primaryUploadsRef.current[trackingKey] = _error ? 'error' : 'done';
      }
    },
    [assignFileUploadToStore],
  );

  const startSecondaryUpload = useCallback(
    (file, trackingKey) => {
      if (!file || !trackingKey) {
        return;
      }

      const metadata = {
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
      };

      const isPdf =
        file.type === 'application/pdf' ||
        file.name?.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        secondaryStatusRef.current[trackingKey] = 'skipped';
        setSecondaryUpload(trackingKey, {
          status: 'skipped',
          error: 'Only PDF files are sent for automated processing.',
          ...metadata,
        });
        return;
      }

      const existingState = secondaryStatusRef.current[trackingKey];
      const existing = secondaryUploads[trackingKey];
      if (
        (existingState && ACTIVE_SECONDARY_STATUSES.has(existingState)) ||
        (existing && ACTIVE_SECONDARY_STATUSES.has(existing.status))
      ) {
        return;
      }

      secondaryStatusRef.current[trackingKey] = 'pending';
      setSecondaryUpload(trackingKey, {
        status: 'pending',
        ...metadata,
      });

      uploadPdfToIdp(file)
        .then(contract => {
          secondaryStatusRef.current[trackingKey] = 'processing';
          setSecondaryUpload(trackingKey, {
            status: 'processing',
            contract,
            ...metadata,
          });
          return processUploadedDocument(contract);
        })
        .then(sections => {
          secondaryStatusRef.current[trackingKey] = 'success';
          setSecondaryUpload(trackingKey, {
            status: 'success',
            sections,
            ...metadata,
          });
        })
        .catch(error => {
          secondaryStatusRef.current[trackingKey] = 'error';
          setSecondaryUpload(trackingKey, {
            status: 'error',
            error: error?.message || 'Automated processing upload failed.',
            ...metadata,
          });
        });
    },
    [secondaryUploads],
  );

  const handleFileAdded = async (file, index, mockFormData) => {
    const { fileError, encryptedCheck } = await getFileError(file, uiOptions);
    const _errors = [...errors];

    if (fileError) {
      _errors[index] = fileError;
      setErrors(_errors);
      errorManager.setFileCheckError(index, true);
      return;
    }

    errorManager.setFileCheckError(index, false);
    _errors[index] = null;
    setErrors(_errors);

    const trackingKey = ensureTrackingKey(file);

    const _encrypted = [...encrypted];
    _encrypted[index] = encryptedCheck;
    setEncrypted(_encrypted);

    errorManager.addPasswordInstance(index, encryptedCheck);

    if (environment.isTest() && !environment.isUnitTest()) {
      childOnChange([mockFormData]);
      return;
    }

    const metadata = {
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
    };
    const existingSecondary = trackingKey
      ? secondaryUploads[trackingKey]
      : null;

    if (!encryptedCheck) {
      if (
        !existingSecondary ||
        RETRIABLE_SECONDARY_STATUSES.has(existingSecondary.status)
      ) {
        startSecondaryUpload(file, trackingKey);
      } else {
        secondaryStatusRef.current[trackingKey] = existingSecondary.status;
        setSecondaryUpload(trackingKey, {
          status: existingSecondary.status,
          ...metadata,
        });
      }
    } else {
      secondaryStatusRef.current[trackingKey] = 'skipped';
      setSecondaryUpload(trackingKey, {
        status: 'skipped',
        error: 'Encrypted files require manual processing.',
        ...metadata,
      });
    }

    if (skipUpload && !encryptedCheck) {
      simulateUploadMultiple(
        setPercentsUploaded,
        percentsUploaded,
        index,
        childrenProps,
        file,
      );
      return;
    }

    const primaryStatus = trackingKey
      ? primaryUploadsRef.current[trackingKey]
      : null;
    const shouldStartPrimary =
      !encryptedCheck && (!primaryStatus || primaryStatus === 'error');

    if (shouldStartPrimary) {
      if (trackingKey) {
        primaryUploadsRef.current[trackingKey] = 'pending';
      }
      handleUpload(file, handleFileProcessing, null, index);
    }
  };

  function removeOneFromArray(array, index) {
    return [...array].toSpliced(index, 1);
  }

  const handleFileRemoved = _file => {
    const index = (childFormData || []).findIndex(
      file => file.name === _file.name && file.size === _file.size,
    );

    const trackingKey = childFormData?.[index]?.idpTrackingKey;
    if (trackingKey) {
      setSecondaryUploads(prev => {
        const next = { ...prev };
        delete next[trackingKey];
        return next;
      });
      delete primaryUploadsRef.current[trackingKey];
      delete secondaryStatusRef.current[trackingKey];
    }

    setErrors(removeOneFromArray(errors, index));
    errorManager.removeInstance(index);

    setEncrypted(removeOneFromArray(encrypted, index));
    setPercentsUploaded(removeOneFromArray(percentsUploaded, index));

    const formData = removeOneFromArray(childFormData, index);
    childOnChange(formData);
  };

  const debouncePassword = useMemo(
    () =>
      debounce(DEBOUNCE_WAIT, ({ file, password }, index) => {
        if (password && password.length > 0) {
          errorManager.resetInstance(index);
          const _encrypted = [...encrypted];
          _encrypted[index] = null;
          setEncrypted(_encrypted);
          const trackingKey = ensureTrackingKey(file.file);
          startSecondaryUpload(file.file, trackingKey);
          if (skipUpload) {
            simulateUploadMultiple(
              setPercentsUploaded,
              percentsUploaded,
              index,
              childrenProps,
              file.file,
            );
          } else {
            handleUpload(file.file, handleFileProcessing, password, index);
          }
        }
      }),
    [
      childrenProps,
      encrypted,
      handleUpload,
      handleFileProcessing,
      percentsUploaded,
      startSecondaryUpload,
      skipUpload,
    ],
  );

  const handleChange = e => {
    const { detail } = e;
    const { action, state, file, mockFormData } = detail;
    const findFileIndex = (_state, _file) => {
      return _state.findIndex(
        f => f.file.name === _file.name && f.file.size === _file.size,
      );
    };
    switch (action) {
      case 'FILE_ADDED': {
        const _currentIndex = state.length - 1;
        errorManager.setInternalFileInputErrors(_currentIndex, false);
        handleFileAdded(file, _currentIndex, mockFormData);
        setCurrentIndex(_currentIndex);
        break;
      }
      case 'FILE_UPDATED': {
        const index = findFileIndex(state, file);
        handleFileAdded(file, index);
        setCurrentIndex(index);
        break;
      }
      case 'PASSWORD_UPDATE': {
        const index = findFileIndex(state, file);
        setCurrentIndex(index);
        const passwordFile = state[index];
        debouncePassword(passwordFile, index);
        break;
      }
      case 'FILE_REMOVED':
        handleFileRemoved(file);
        break;
      default:
        break;
    }
  };

  function getFileInputInstanceIndex(e) {
    const [vaFileInput] = e
      .composedPath()
      .filter(el => el.tagName === 'VA-FILE-INPUT');

    let els = [];
    if (componentRef.current?.shadowRoot) {
      els = Array.from(
        componentRef.current.shadowRoot.querySelectorAll('va-file-input'),
      );
    }
    return els.findIndex(el => el.id === vaFileInput.id);
  }

  const handleAdditionalInput = e => {
    const index = getFileInputInstanceIndex(e);
    if (mappedProps.handleAdditionalInput) {
      const payload = mappedProps.handleAdditionalInput(e);
      const updatedFormData = [...(childFormData || [])];
      updatedFormData[index] = {
        ...updatedFormData[index],
        additionalData: payload,
      };

      childOnChange(updatedFormData);
    }
  };

  const handleInternalFileInputError = e => {
    const index = getFileInputInstanceIndex(e);
    errorManager.setInternalFileInputErrors(index, true);
    const _errors = [...errors];
    _errors[index] = e.detail.error;
    setErrors(_errors);
  };

  const passwordErrors = errorManager.getPasswordInstances().map(instance => {
    return instance && instance.hasPasswordError()
      ? MISSING_PASSWORD_ERROR
      : null;
  });

  const resetVisualState = errors.map(error => (error ? true : null));
  return (
    <VaFileInputMultiple
      {...mappedProps}
      error={mappedProps.error}
      ref={componentRef}
      encrypted={encrypted}
      onVaMultipleChange={handleChange}
      onVaFileInputError={handleInternalFileInputError}
      errors={errors}
      resetVisualState={resetVisualState}
      percentUploaded={percentsUploaded}
      passwordErrors={passwordErrors}
      onVaSelect={handleAdditionalInput}
      maxFileSize={maxFileSize}
      minFileSize={minFileSize}
    >
      {mappedProps.additionalInput && (
        <div className="additional-input-container">
          {mappedProps.additionalInput()}
        </div>
      )}
    </VaFileInputMultiple>
  );
};

DualFileUploadField.propTypes = {
  childrenProps: PropTypes.shape({
    formData: PropTypes.arrayOf(
      PropTypes.shape({
        file: PropTypes.shape({
          name: PropTypes.string,
          size: PropTypes.number,
          type: PropTypes.string,
          lastModified: PropTypes.number,
        }),
        additionalData: PropTypes.object,
        idpTrackingKey: PropTypes.string,
        idpUploadStatus: PropTypes.string,
        idpBucket: PropTypes.string,
        idpDocumentId: PropTypes.string,
        idpPdfKey: PropTypes.string,
        idpSections: PropTypes.object,
      }),
    ),
    onChange: PropTypes.func.isRequired,
    uiSchema: PropTypes.shape({
      'ui:errorMessages': PropTypes.shape({
        additionalInput: PropTypes.string,
      }),
    }),
  }).isRequired,
  uiOptions: PropTypes.shape({
    fileUploadUrl: PropTypes.string,
    accept: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    formNumber: PropTypes.string,
    skipUpload: PropTypes.bool,
    maxFileSize: PropTypes.number,
    minFileSize: PropTypes.number,
    additionalInputUpdate: PropTypes.func,
  }),
};

export default DualFileUploadField;
