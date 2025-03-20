import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prismaClient = new PrismaClient();

const seedEditTypes = async () => {
  const logTypes: string[] = ['FLOOR', 'ROOM', 'USER', 'ROOM_IMAGES'];

  for (const logType of logTypes) {
    await prismaClient.logType.upsert({
      where: { type: logType },
      update: {},
      create: { type: logType },
    });
  }

  console.log('Log Types Seeded.');
};

const seedEditMethods = async () => {
  const logMethods: string[] = [
    'CREATE',
    'UPDATE',
    'SOFT_DELETE',
    'DELETE',
    'RETRIEVE',
  ];

  for (const logMethod of logMethods) {
    await prismaClient.logMethod.upsert({
      where: { method: logMethod },
      update: {},
      create: { method: logMethod },
    });
  }

  console.log('Log Method Seeded.');
};

const seedDepartments = async () => {
  const departments = [
    { name: 'Human Resource', code: 'HR' },
    { name: 'Quality Management', code: 'QM' },
    { name: 'Information Technology', code: 'IT' },
    { name: 'Marketing', code: 'MRKT' },
    { name: 'Accounting', code: 'ACNT' },
    { name: 'Ancillary', code: 'ANC' },
    { name: 'Nursing Services Department', code: 'NSD' },
    { name: 'Supply Chain', code: 'SC' },
    { name: 'Support Services', code: 'SSD' },
    { name: 'Customer Experience', code: 'CED' },
    { code: 'OR', name: 'Operating Room' },
    { code: 'ER', name: 'Emergency Room' },
    { code: 'NICU', name: 'Nicu' },
    { code: 'DIA', name: 'Dialysis' },
    { code: 'ICU', name: 'Icu' },
    { code: 'ACU', name: 'Acu' },
    { code: 'GNU4F', name: '4th Floor Ward' },
    { code: 'GNU5F', name: '5th Floor Ward' },
    { code: 'IMGN', name: 'Imaging' },
    { code: 'CRD', name: 'Cardiology' },
    { code: 'PULM', name: 'Pulmonary' },
    { code: 'PMR', name: 'Physical, Medicine, and Rehab' },
    { code: 'LAB', name: 'Laboratory' },
    { code: 'DIET', name: 'Dietary' },
  ];

  for (const department of departments) {
    await prismaClient.department.upsert({
      where: { code: department.code },
      update: {},
      create: department,
    });
  }

  console.log('Department seeded.');
};

const seedQuestions = async () => {
  const questions: string[] = [
    'What was the name of your first pet?',
    "What is your mother's maiden name?",
    'What was the name of your first school?',
    'In what city were you born?',
    'What is the name of your favorite childhood teacher?',
    'What is your favorite movie?',
    'What was your childhood nickname?',
    'What is your favorite book?',
    'What is your favorite food?',
    'What is the name of the street you grew up on?',
    'What was your first car?',
    'Who was your childhood best friend?',
    'What is your favorite vacation destination?',
    'What was the name of your first stuffed animal?',
    'What is the middle name of your oldest sibling?',
    'What was the name of your first boss?',
    'What is your favorite sports team?',
    'What is the name of the first concert you attended?',
    'What is the name of your first crush?',
    'What was your dream job as a child?',
  ];

  for (const question of questions) {
    await prismaClient.secretQuestion.create({ data: { question } });
  }

  console.log('Questions seeded.');
};

const seedCategories = async () => {
  const categories: { name: string; deptId: number }[] = [
    { name: 'ICT: HARDWARE: BAR CODE READER / SCANNER', deptId: 3 },
    { name: 'ICT: HARDWARE: CABLES (LAN/POWER/PRINTER/HDMI/VIDEO)', deptId: 3 },
    { name: 'ICT: HARDWARE: DESKTOP/LAPTOP', deptId: 3 },
    { name: 'ICT: HARDWARE: MONITOR/KEYBOARD/MOUSE/HARD DISK/UPS', deptId: 3 },
    {
      name: 'ICT: HARDWARE: PRINTER (LASER/BAR CODE/ID CARD) / SCANNER',
      deptId: 3,
    },
    { name: 'ICT: HARDWARE: ROUTER / SWITCHES', deptId: 3 },
    { name: 'ICT: HARDWARE: PHONE (WIRED / WIRELESS) / MOBILE', deptId: 3 },
    { name: 'ICT: INFRASTRUCTURE: PHONE CABLING', deptId: 3 },
    { name: 'ICT: NETWORK: FILES / FOLDERS (USER / SHARED)', deptId: 3 },
    { name: 'ICT: OTHERS', deptId: 3 },
    { name: 'ICT: SOFTWARE: DATABASE UPDATES / CHANGES', deptId: 3 },
    { name: 'ICT: SOFTWARE: POST/UNPOST SCREEN SAVER PICTURES', deptId: 3 },
    { name: 'ICT: SOFTWARE: REPORT / DATABASE EXTRACTIONS', deptId: 3 },
    {
      name: 'ICT: SOFTWARE: SYSTEM ACCESS ( BIZBOX / LIS / RISPACS)',
      deptId: 3,
    },
    { name: 'ICT: SOFTWARE: SYSTEM ACCESS (SMART TV / WIFI)', deptId: 3 },
    { name: 'ICT: SOFTWARE: SYSTEM ACCESS (WINDOWS / MICROSOFT)', deptId: 3 },
    { name: 'ICT: SOFTWARE: SYSTEM DISCREPANCY / ERROR', deptId: 3 },
    { name: 'ICT: SOFTWARE: SYSTEM INSTALLATION / UPDATES', deptId: 3 },
    {
      name: 'ICT: SOFTWARE: USER ACCOUNT (ACTIVE DIRECTORY / E-MAIL / BIOMETRIC / E-TICKET / QMEUP)',
      deptId: 3,
    },
    { name: 'SSD: EVENTS & SETUP', deptId: 9 },
    { name: 'SSD: HOSPITAL UPKEEP', deptId: 9 },
    { name: 'SSD: MAINTENANCE: AIR CONDITIONING/MECHANICAL', deptId: 9 },
    { name: 'SSD: MAINTENANCE: CARPENTRY WORKS', deptId: 9 },
    { name: 'SSD: MAINTENANCE: ELECTRICAL/LAN CABLING', deptId: 9 },
    { name: 'SSD: MAINTENANCE: MEDICAL EQUIPMENT', deptId: 9 },
    { name: 'SSD: MAINTENANCE: OTHERS', deptId: 9 },
    { name: 'SSD: MAINTENANCE: PLUMBING', deptId: 9 },
    { name: 'SSD: PATIENT ROOM', deptId: 9 },
  ];

  await prismaClient.category.createMany({ data: categories });

  console.log('Categories seeded');
};

const seedUsers = async () => {
  const users = [
    {
      firstName: 'Michael Gian',
      lastName: 'Tiqui',
      username: 'GTIQUI',
      email: 'gian.tiqui.dev@example.com',
      password: 'abcd_123',
      deptId: 3,
    },
  ];

  for (const user of users) {
    const hashedPassword = await argon.hash(user.password);

    await prismaClient.user.create({
      data: {
        ...user,
        password: hashedPassword,
        roles: {
          createMany: { data: [{ name: 'user' }, { name: 'admin' }] },
        },
      },
    });
  }

  console.log('User seeded.');
};

const main = async () => {
  await seedEditMethods();
  await seedEditTypes();
  await seedDepartments();
  await seedUsers();
  await seedCategories();
  await seedQuestions();
};

main().catch((err) => console.error(err));
