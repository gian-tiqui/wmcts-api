import { Ticket, User } from '@prisma/client';

const convertDatesToString = (data: Ticket[] | User[]) => {
  data.map((d) => {
    d.createdAt = new Date(d.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    d.updatedAt = new Date(d.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });
};

export default convertDatesToString;
