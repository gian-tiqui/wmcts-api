import { Ticket, User } from '@prisma/client';

const convertDatesToString = (data: Ticket[] | User[]) => {
  data.map((d) => {
    d.createdAt = new Date(d.createdAt).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Manila',
    });

    d.updatedAt = new Date(d.updatedAt).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Manila',
    });
  });
};

export default convertDatesToString;
