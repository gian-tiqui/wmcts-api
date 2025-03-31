const convertDatesToString = (
  data: { createdAt: any; updatedAt: any; acknowledgedAt?: any }[],
) => {
  data.forEach((d) => {
    d.createdAt = new Date(d.createdAt).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Asia/Manila',
    });

    d.updatedAt = new Date(d.updatedAt).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Asia/Manila',
    });
  });
};

export default convertDatesToString;
