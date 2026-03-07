import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { getFormData } from 'platform/forms-system/src/js/state/selectors';
import { buildConflicts, resolveField } from '../cave/utils/conflictDetection';
import manifest from '../manifest.json';

const ConflictCard = ({ conflict, resolution, onResolutionChange }) => {
  const radioRef = useRef(null);
  const onResolutionChangeRef = useRef(onResolutionChange);
  onResolutionChangeRef.current = onResolutionChange;

  useEffect(
    () => {
      const el = radioRef.current;
      if (!el) return undefined;
      const handler = e => {
        onResolutionChangeRef.current(conflict.label, e.detail.value);
      };
      el.addEventListener('vaValueChange', handler);
      return () => el.removeEventListener('vaValueChange', handler);
      // onResolutionChangeRef keeps the handler current without re-registration
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [conflict.label],
  );

  return (
    <div className="vads-u-margin-bottom--4">
      <va-radio
        ref={radioRef}
        label={conflict.label}
        value={resolution || 'form'}
        required
        uswds
      >
        <va-radio-option
          name={`conflict-${conflict.label}`}
          label={`${conflict.formDisplayValue} (entered by you)`}
          value="form"
          tile
        />
        {conflict.artifactOptions.map((option, idx) => (
          <va-radio-option
            key={option.sourceFiles.map(f => f.trackingKey).join('-')}
            name={`conflict-${conflict.label}`}
            label={`${option.displayValue} (found in ${
              option.sourceFiles.length > 1
                ? 'multiple documents'
                : `${option.sourceFiles[0].docTypeLabel} — ${
                    option.sourceFiles[0].fileName
                  }`
            })`}
            value={String(idx)}
            tile
          />
        ))}
      </va-radio>
      <p className="vads-u-margin-top--1">
        <a href={`${manifest.rootUrl}/${conflict.editPath}`}>
          Edit {conflict.label.toLowerCase()}
        </a>
      </p>
    </div>
  );
};

ConflictCard.propTypes = {
  conflict: PropTypes.shape({
    label: PropTypes.string.isRequired,
    editPath: PropTypes.string.isRequired,
    formDisplayValue: PropTypes.string,
    artifactOptions: PropTypes.arrayOf(
      PropTypes.shape({
        displayValue: PropTypes.string,
        sourceFiles: PropTypes.arrayOf(
          PropTypes.shape({
            docTypeLabel: PropTypes.string,
            fileName: PropTypes.string,
            trackingKey: PropTypes.string,
          }),
        ),
        rawValue: PropTypes.any,
      }),
    ),
  }).isRequired,
  onResolutionChange: PropTypes.func.isRequired,
  resolution: PropTypes.string,
};

/**
 * Factory that returns a `ui:field` component bound to a specific fieldGroup.
 * @param {Array} fieldGroup - VETERAN_INFO_FIELDS or MILITARY_HISTORY_FIELDS
 * @param {string} emptyMessage - message when no conflicts are found
 */
const createConflictPageField = (fieldGroup, emptyMessage) => {
  return ({ onChange, formContext }) => {
    const dispatch = useDispatch();
    const store = useStore();
    const formData = useSelector(getFormData) || {};

    // Snapshot conflicts on mount. Data is already auto-resolved at download
    // time so we build conflicts directly from current Redux state.
    const [conflicts] = useState(() =>
      buildConflicts(formData, formData.files ?? [], fieldGroup),
    );

    const [resolutions, setResolutions] = useState({});
    // Mirror resolutions into a ref so the unmount cleanup can read the
    // latest value without needing it as a useEffect dependency.
    const resolutionsRef = useRef({});

    // Initialize the unresolved count in formData so ui:validations can gate Continue.
    useEffect(
      () => {
        onChange({ conflictCount: conflicts.length });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    // Commit the final resolution when the user navigates away.
    // Reading store.getState() at unmount time guarantees we apply on top of
    // whatever prior conflict pages already dispatched — avoiding the
    // stale-snapshot bug where an old page's cleanup overwrote a newer page's
    // resolutions.
    useEffect(() => {
      return () => {
        if (!Object.keys(resolutionsRef.current).length) return;
        const currentFormData = store.getState().form.data ?? {};
        let resolvedFormData = currentFormData;
        let resolvedFiles = currentFormData.files ?? [];
        for (const conflict of conflicts) {
          const c = resolutionsRef.current[conflict.label];
          if (c) {
            const option =
              c === 'form' ? 'form' : conflict.artifactOptions[parseInt(c, 10)];
            if (option !== undefined) {
              const result = resolveField(
                resolvedFormData,
                resolvedFiles,
                conflict,
                option,
              );
              resolvedFormData = result.formData;
              resolvedFiles = result.files;
            }
          }
        }
        dispatch(setData({ ...resolvedFormData, files: resolvedFiles }));
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleResolutionChange = (fieldLabel, choice) => {
      const nextResolutions = { ...resolutions, [fieldLabel]: choice };
      resolutionsRef.current = nextResolutions;
      setResolutions(nextResolutions);
      onChange({
        conflictCount: conflicts.length - Object.keys(nextResolutions).length,
      });
    };

    const unresolvedCount = conflicts.length - Object.keys(resolutions).length;
    const showError = formContext?.submitted && unresolvedCount > 0;

    if (!conflicts.length) {
      return <p>{emptyMessage}</p>;
    }

    return (
      <div className={showError ? 'usa-input-error' : undefined}>
        {showError && (
          <span className="usa-input-error-message" role="alert">
            You must resolve all conflicts before continuing.
          </span>
        )}
        <p>
          The information below was automatically extracted from your uploaded
          documents. Review any differences and select the correct value.
        </p>
        {conflicts.map(conflict => (
          <ConflictCard
            key={conflict.label}
            conflict={conflict}
            resolution={resolutions[conflict.label]}
            onResolutionChange={handleResolutionChange}
          />
        ))}
      </div>
    );
  };
};

export default createConflictPageField;
