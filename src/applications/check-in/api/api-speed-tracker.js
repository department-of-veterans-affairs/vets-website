import recordEvent from 'platform/monitoring/record-event';

const apiSpeedLogger = async (request, token) => {
  const startTime = new Date();
  const response = await request;
  const endTime = new Date();
  const timeDiff = endTime.getTime() - startTime.getTime();
  recordEvent({
    event: 'api_call',
    'api-name': 'api_speed_test',
    'api-status': timeDiff,
    data: token,
  });
  return response;
};

export { apiSpeedLogger };
