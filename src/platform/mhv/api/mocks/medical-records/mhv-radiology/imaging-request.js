const all = [
  {
    status: 'NEW',
    statusText: '100',
    studyIdUrn: '184b3a0a-b5bc-44eb-9131-4ad806045313',
    percentComplete: 100,
    fileSize: '',
    fileSizeNumber: null,
    startDate: 1734108092351,
    endDate: 1734108146504,
  },
  {
    status: 'COMPLETE',
    statusText: '100',
    studyIdUrn: '2184acee-280a-493b-91a1-c7914f3eaf97',
    percentComplete: 100,
    fileSize: '7.67 MB',
    fileSizeNumber: 8041789,
    startDate: 1734360571761,
    endDate: 1734360582548,
  },
  {
    status: 'COMPLETE',
    statusText: '100',
    studyIdUrn: '2184acee-280a-493b-91a1-c7914f3eaf97',
    percentComplete: 100,
    fileSize: '4.1 MB',
    fileSizeNumber: 8041789,
    startDate: 1734360571761,
    endDate: 1734360582548,
  },
  {
    status: 'COMPLETE',
    statusText: '100',
    studyIdUrn: '2184acee-280a-493b-91a1-c7914f3eaf97',
    percentComplete: 100,
    fileSize: '3.5 MB',
    fileSizeNumber: 8041789,
    startDate: 1734360571761,
    endDate: 1734360582548,
  },
  {
    status: 'COMPLETE',
    statusText: '100',
    studyIdUrn: '2184acee-280a-493b-91a1-c7914f3eaf97',
    percentComplete: 100,
    fileSize: '2.9 MB',
    fileSizeNumber: 8041789,
    startDate: 1734360571761,
    endDate: 1734360582548,
  },
  {
    status: 'COMPLETE',
    statusText: '100',
    studyIdUrn: '5df3a7b7-7ead-45ff-b466-8b29a01ba94d',
    percentComplete: 100,
    fileSize: '253.91 KB',
    fileSizeNumber: 260003,
    startDate: 1734360572036,
    endDate: 1734360578627,
  },
  {
    status: 'COMPLETE',
    statusText: '100',
    studyIdUrn: '5df3a7b7-7ead-45ff-b466-8b29a01ba94d',
    percentComplete: 100,
    fileSize: '253.91 KB',
    fileSizeNumber: 450003,
    startDate: 1734360572036,
    endDate: 1734360578627,
  },
  {
    status: 'COMPLETE',
    statusText: '100',
    studyIdUrn: '2184acee-280a-493b-91a1-c7914f3eaf98',
    percentComplete: 100,
    fileSize: '2.9 MB',
    fileSizeNumber: 8041789,
    startDate: 1720346400000,
    endDate: 1720346400800,
  },
];

const imagingRequest = (req, res) => {
  const { studyId } = req.params;
  const response = all.find(r => r.studyIdUrn === studyId);
  if (!response) {
    return res.status(404).json({
      errors: [
        {
          title: 'Record not found',
          detail: `The record identified by ${studyId} could not be found`,
          code: '404',
          status: '404',
        },
      ],
    });
  }
  return res.json(response);
};

module.exports = imagingRequest;
