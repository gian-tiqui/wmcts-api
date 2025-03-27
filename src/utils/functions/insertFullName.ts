import { User } from '@prisma/client';

const insertfullName = (users: User[]) => {
  const modifiedUsers = [
    ...users.map((user) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    })),
  ];

  return modifiedUsers;
};

export default insertfullName;
