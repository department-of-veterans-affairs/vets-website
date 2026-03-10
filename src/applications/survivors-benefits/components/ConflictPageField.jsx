import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { getFormData } from 'platform/forms-system/src/js/state/selectors';
import { buildConflicts, resolveField } from '../cave/utils/conflictDetection';
import manifest from '../manifest.json';

const ConflictCard = ({ conflict, resolution, onResolutionChange }) => {
  const radioRef = useRef(null);
  // Ref keeps the handler current without re-registering the listener.
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [conflict.label],
  );

  return (
    <div className="vads-u-margin-bottom--4">
      <va-radio ref={radioRef} label={conflict.label} required uswds>
        <va-radio-option
          name={`conflict-${conflict.label}`}
          label={`${conflict.formDisplayValue} (entered by you)`}
          value="form"
          checked={!resolution || resolution === 'form'}
          tile
        />
        {conflict.artifactOptions.map((option, idx) => (
          <va-radio-option
            key={option.sourceFiles.map(f => f.trackingKey).join('-')}
            name={`conflict-${conflict.label}`}
            label={`${option.displayValue} (found in ${
              option.sourceFiles.length > 1
                ? 'multiple documents'
                : `${option.sourceFiles[0].docTypeLabel}`
            })`}
            value={String(idx)}
            checked={resolution === String(idx)}
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
  return () => {
    const dispatch = useDispatch();
    const store = useStore();
    const formData = useSelector(getFormData) || {};

    const conflicts = buildConflicts(
      formData,
      formData.files ?? [],
      fieldGroup,
    );

    // Ref ensures the unmount cleanup always dispatches the latest conflicts,
    // not a stale closure captured at mount time.
    const conflictsRef = useRef(conflicts);
    conflictsRef.current = conflicts;

    const [resolutions, setResolutions] = useState({});
    const resolutionsRef = useRef({});

    // Seed defaults synchronously during render, not in useEffect — useEffect
    // runs after paint, creating a race if the user clicks Continue immediately.
    conflicts.forEach(c => {
      if (!(c.label in resolutionsRef.current)) {
        resolutionsRef.current[c.label] = 'form';
      }
    });

    // Sync resolutions state for rendering only (doesn't affect unmount dispatch).
    useEffect(
      () => {
        if (!conflicts.length) return;
        const initial = conflicts.reduce(
          (acc, c) => ({ ...acc, [c.label]: 'form' }),
          {},
        );
        setResolutions(prev => (Object.keys(prev).length ? prev : initial));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [conflicts.length],
    );

    // Apply resolutions to Redux on navigate-away. Reading store.getState() at
    // unmount avoids stale snapshots when two conflict pages both dispatch.
    useEffect(() => {
      return () => {
        if (!Object.keys(resolutionsRef.current).length) return;
        const currentFormData = store.getState().form.data ?? {};
        let resolvedFormData = currentFormData;
        let resolvedFiles = currentFormData.files ?? [];
        for (const conflict of conflictsRef.current) {
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
      resolutionsRef.current = {
        ...resolutionsRef.current,
        [fieldLabel]: choice,
      };
      setResolutions(prev => ({ ...prev, [fieldLabel]: choice }));
    };

    if (!conflicts.length) {
      return <p>{emptyMessage}</p>;
    }

    return (
      <div>
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
