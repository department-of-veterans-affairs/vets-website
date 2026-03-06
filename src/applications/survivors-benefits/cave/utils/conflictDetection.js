const isBlankValue = value =>
  !value || (typeof value === 'object' && !Object.values(value).some(Boolean));

const addToGrouped = (grouped, norm, rawValue, docTypeLabel, formatValue) => {
  if (!grouped.has(norm)) {
    grouped.set(norm, {
      rawValue,
      displayValue: formatValue(rawValue),
      docTypeLabels: [docTypeLabel],
    });
  } else {
    const existing = grouped.get(norm);
    if (!existing.docTypeLabels.includes(docTypeLabel)) {
      existing.docTypeLabels.push(docTypeLabel);
    }
  }
};

const scanArtifact = (artifact, files, formNorm, fieldDef, grouped) => {
  for (const file of files ?? []) {
    for (const entry of file.idpArtifacts?.[artifact.artifactKey] ?? []) {
      const rawValue = artifact.getArtifactValue(entry);
      if (rawValue) {
        const norm = fieldDef.normalize(rawValue);
        if (norm !== formNorm) {
          addToGrouped(
            grouped,
            norm,
            rawValue,
            artifact.docTypeLabel,
            fieldDef.formatValue,
          );
        }
      }
    }
  }
};

export const buildConflicts = (formData, files, fieldGroup) => {
  const conflicts = [];
  for (const fieldDef of fieldGroup) {
    const formValue = fieldDef.getFormValue(formData);
    if (!isBlankValue(formValue)) {
      const formNorm = fieldDef.normalize(formValue);
      const grouped = new Map();

      for (const artifact of fieldDef.artifacts) {
        scanArtifact(artifact, files, formNorm, fieldDef, grouped);
      }

      if (grouped.size > 0) {
        conflicts.push({
          ...fieldDef,
          formValue,
          formDisplayValue: fieldDef.formatValue(formValue),
          artifactOptions: Array.from(grouped.values()),
        });
      }
    }
  }
  return conflicts;
};

export const autoResolveArtifacts = (formData, files, fieldGroup) => {
  if (!files?.length) return files;
  const next = files.map(file => {
    if (!file.idpArtifacts) return file;
    const updatedArtifacts = { ...file.idpArtifacts };
    let changed = false;

    for (const fieldDef of fieldGroup) {
      const formValue = fieldDef.getFormValue(formData);
      if (formValue) {
        for (const artifact of fieldDef.artifacts) {
          const entries = updatedArtifacts[artifact.artifactKey];
          if (entries?.length) {
            const anyValidExists = files.some(f =>
              (f.idpArtifacts?.[artifact.artifactKey] ?? []).some(
                e => !!artifact.getArtifactValue(e),
              ),
            );
            if (!anyValidExists) {
              updatedArtifacts[artifact.artifactKey] = entries.map(entry =>
                artifact.setArtifactValue(entry, formValue),
              );
              changed = true;
            }
          }
        }
      }
    }
    return changed ? { ...file, idpArtifacts: updatedArtifacts } : file;
  });
  // Return same reference if nothing was modified — callers use reference
  // equality to detect whether a Redux dispatch is needed.
  return next.every((f, i) => f === files[i]) ? files : next;
};

export const applyToAllArtifacts = (files, fieldDef, canonicalValue) =>
  (files ?? []).map(file => {
    if (!file.idpArtifacts) return file;
    const updated = { ...file.idpArtifacts };
    for (const artifact of fieldDef.artifacts) {
      const entries = updated[artifact.artifactKey];
      if (entries?.length) {
        updated[artifact.artifactKey] = entries.map(entry =>
          artifact.setArtifactValue(entry, canonicalValue),
        );
      }
    }
    return { ...file, idpArtifacts: updated };
  });

export const resolveField = (formData, files, fieldDef, choice) => {
  const canonicalValue =
    choice === 'form' ? fieldDef.getFormValue(formData) : choice.rawValue;

  const nextFormData =
    choice === 'form'
      ? formData
      : fieldDef.applyToForm(formData, canonicalValue);

  const nextFiles = applyToAllArtifacts(files, fieldDef, canonicalValue);

  return { formData: nextFormData, files: nextFiles };
};

// Pure function used by `depends` in form.js.
// Data is pre-resolved at download time so we check for conflicts directly.
export const hasConflicts = (formData, fieldGroup) =>
  buildConflicts(formData, formData.files ?? [], fieldGroup).length > 0;
