const convertAcknowledgeAt = (obj: { acknowledgedAt: any }) => {
  obj.acknowledgedAt = new Date(obj.acknowledgedAt).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Manila',
  });
};

export default convertAcknowledgeAt;
