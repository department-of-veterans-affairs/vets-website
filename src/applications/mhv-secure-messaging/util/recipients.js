export const getUniqueTriageGroups = threadList => {
  const uniqueHash = threadList.reduce((acc, thread) => {
    if (!acc[thread.recipientId]) {
      acc[thread.recipientId] = {
        triageGroupName: thread.triageGroupName,
        sentDate: thread.sentDate,
        triageGroupId: thread.recipientId,
      };
    }
    return acc;
  }, {});

  const groups = Object.values(uniqueHash);
  // sort the unique triage groups by sentDate in descending order
  groups.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));

  return groups;
};
