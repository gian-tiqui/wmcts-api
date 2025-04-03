const convertResolutionTime = (obj: { resolutionTime: any }) => {
  obj.resolutionTime = new Date(obj.resolutionTime).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Manila',
  });
};

export default convertResolutionTime;
