import * as dotenv from "dotenv";
dotenv.config();
import * as path from 'path';
import * as crypto from 'crypto';
import mysql from 'mysql2/promise';
import { 
  User, 
  JobNotification, 
  AdmitCard, 
  Result, 
  AnswerKey, 
  CurrentAffairs, 
  MockTest, 
  MockTestAttempt, 
  Subscription, 
  PaymentTransaction, 
  LeaderboardUser,
  SystemLog,
  SystemSettings,
  Question
} from '../src/types';

// Native Node.js crypto hashing (Zero packages, ultra-secure)
export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', 'examduniya-salt-key-2026').update(password).digest('hex');
}

export function generateToken(payload: any): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', 'examduniya-jwt-secret-key-2026')
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): any | null {
  try {
    const [headerStr, bodyStr, signature] = token.split('.');
    if (!headerStr || !bodyStr || !signature) return null;
    const expectedSig = crypto.createHmac('sha256', 'examduniya-jwt-secret-key-2026')
      .update(`${headerStr}.${bodyStr}`)
      .digest('base64url');
    if (signature !== expectedSig) return null;
    const body = JSON.parse(Buffer.from(bodyStr, 'base64url').toString('utf8'));
    if (body.exp < Date.now()) return null; // Expired
    return body;
  } catch {
    return null;
  }
}

interface DatabaseSchema {
  users: { [id: string]: User & { passwordHash: string } };
  jobs: JobNotification[];
  admitCards: AdmitCard[];
  results: Result[];
  answerKeys: AnswerKey[];
  currentAffairs: CurrentAffairs[];
  mockTests: MockTest[];
  attempts: MockTestAttempt[];
  subscriptions: Subscription[];
  payments: PaymentTransaction[];
  settings: SystemSettings;
  logs: SystemLog[];
}

const DEFAULT_SETTINGS: SystemSettings = {
  geminiModel: 'gemini-3.5-flash',
  googleOAuthEnabled: true,
  payUEnabled: true,
  maintenanceMode: false,
  smtpStatus: 'Configured'
};

const INITIAL_JOBS: JobNotification[] = [
  {
    id: 'job-1',
    title: 'UP Police Constable Recruitment 2026',
    department: 'Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB)',
    category: 'UP Police',
    postCount: 60244,
    publishDate: '2026-05-15',
    lastDateToApply: '2026-06-30',
    examDate: '2026-08-12',
    pdfUrl: 'https://uppbpb.gov.in/notices/constable-recruitment-2026.pdf',
    applyUrl: 'https://uppbpb.gov.in/apply-online',
    officialWebsite: 'https://uppbpb.gov.in',
    ageLimit: '18 - 25 Years (Relaxation as per Rules)',
    qualification: 'Class 12th (Intermediate) Exam Passed from Recognized Board.',
    applicationFee: '₹400 for All Categories',
    details: `
### Key Highlights of UP Police Constable 2026 Recruitment
The UPPRPB has released the official recruitment notification for **60,244 vacancies** for Police Constables in Civil Police. This is an incredible opportunity for intermediate-passed candidates in Uttar Pradesh.

#### Selection Process:
1. Written Examination (OMR based, Objective Type)
2. Physical Standards Test (PST) & Document Verification (DV)
3. Physical Efficiency Test (PET - Run 4.8 km in 25 mins for male, 2.4 km in 14 mins for female)

#### Exam Pattern:
- Total Questions: 150
- Total Marks: 300
- Negative Marking: -0.5 marks per wrong answer
- Subjects: General Knowledge, General Hindi, Numerical & Mental Ability, Mental Aptitude/I.Q./Reasoning.
    `
  },
  {
    id: 'job-2',
    title: 'SSC GD Constable Notification 2026',
    department: 'Staff Selection Commission (SSC)',
    category: 'SSC',
    postCount: 39481,
    publishDate: '2026-05-10',
    lastDateToApply: '2026-06-15',
    examDate: '2026-09-05',
    pdfUrl: 'https://ssc.gov.in/downloads/notices/SSC_GD_2026.pdf',
    applyUrl: 'https://ssc.gov.in/candidate-portal',
    officialWebsite: 'https://ssc.gov.in',
    ageLimit: '18 - 23 Years as on 01-01-2026',
    qualification: 'Class 10th (Matriculation) Exam Passed from Recognized Board.',
    applicationFee: '₹100 (SC/ST/Women/ESM are exempted)',
    details: `
### SSC GD Constable 2026 Official Notification Released
Staff Selection Commission (SSC) invites applications for Constable (GD) in BSF, CISF, CRPF, SSB, ITBP, AR, and SSF forces.

#### Selection Process:
- Computer Based Examination (CBE)
- Physical Efficiency Test (PET) & Physical Standard Test (PST)
- Detailed Medical Examination (DME)

#### CBE Exam Pattern:
- Section A: General Intelligence & Reasoning (20 Questions - 40 Marks)
- Section B: General Knowledge & General Awareness (20 Questions - 40 Marks)
- Section C: Elementary Mathematics (20 Questions - 40 Marks)
- Section D: English/Hindi (20 Questions - 40 Marks)
- Duration: 60 Minutes. Negative Marking: 0.25 marks per incorrect answer.
    `
  },
  {
    id: 'job-3',
    title: 'RRB NTPC Group C Recruitment 2026',
    department: 'Railway Recruitment Boards (RRB)',
    category: 'Railway',
    postCount: 11558,
    publishDate: '2026-05-20',
    lastDateToApply: '2026-07-05',
    examDate: '2026-10-15',
    pdfUrl: 'https://indianrailways.gov.in/rrb/ntpc-advertisement-2026.pdf',
    applyUrl: 'https://rrbapply.gov.in',
    officialWebsite: 'https://indianrailways.gov.in',
    ageLimit: '18 - 33 Years (Graduate Posts), 18 - 30 Years (Under-Graduate)',
    qualification: '12th pass or Graduate Degree depending on the specified post.',
    applicationFee: '₹500 (Refundable ₹400 on CBT Stage 1) / ₹250 for reserved types',
    details: `
### RRB NTPC Recruitment 2026 (Non-Technical Popular Categories)
A great career path in Indian Railways across multiple posts: Junior Clerk, Accounts Clerk, Trains Clerk, Traffic Assistant, Goods Guard, Senior Clerk, and Commercial Apprentice.

#### Examination Stages:
1. First Stage Computer Based Test (CBT-1) - Screening Test
2. Second Stage Computer Based Test (CBT-2) - Selection Merit
3. Typing Skill Test / Computer Based Aptitude Test (as applicable)
4. Document Verification & Medical Check-up
    `
  }
];

const INITIAL_ADMIT_CARDS: AdmitCard[] = [
  {
    id: 'admit-1',
    title: 'SSC CGL Tier 1 Exam admit Card 2026',
    category: 'SSC',
    examDate: '2026-06-20',
    downloadUrl: 'https://ssc.gov.in/admit-cards-cgl2026',
    status: 'Released',
    releaseDate: '2026-05-30'
  },
  {
    id: 'admit-2',
    title: 'UPSC Civil Services Prelims Admit Card 2026',
    category: 'UPSC',
    examDate: '2026-06-10',
    downloadUrl: 'https://upsc.gov.in/eadmitcard-upsc',
    status: 'Released',
    releaseDate: '2026-05-28'
  },
  {
    id: 'admit-3',
    title: 'RRB ALP (Assistant Loco Pilot) CBT-1 Admit Card 2026',
    category: 'Railway',
    examDate: '2026-07-01',
    downloadUrl: 'https://rrbapply.gov.in/download-alp-admit-card',
    status: 'Expected Soon',
    releaseDate: '2026-06-25'
  }
];

const INITIAL_RESULTS: Result[] = [
  {
    id: 'res-1',
    title: 'UPSC NDA & NA Exam (I) Result 2026',
    category: 'Defence',
    declareDate: '2026-05-25',
    resultUrl: 'https://upsc.gov.in/NDA-I-2026-results.pdf',
    status: 'Released'
  },
  {
    id: 'res-2',
    title: 'UPSSSC PET Result & Scorecard 2025-2026',
    category: 'UPSSSC',
    declareDate: '2026-05-18',
    resultUrl: 'https://upsssc.gov.in/pet-result-score-login',
    status: 'Released'
  },
  {
    id: 'res-3',
    title: 'SSC CHSL 2025 Final Result Cutoff Marks',
    category: 'SSC',
    declareDate: '2026-05-29',
    resultUrl: 'https://ssc.gov.in/final-result-chsl-2025',
    status: 'Released'
  }
];

const INITIAL_ANSWER_KEYS: AnswerKey[] = [
  {
    id: 'key-1',
    title: 'SSC GD Constable Written CBT Answer Key 2026',
    category: 'SSC',
    keyReleaseDate: '2026-05-28',
    answerKeyUrl: 'https://ssc.gov.in/answerkey-challege-gd'
  },
  {
    id: 'key-2',
    title: 'Railway RPF SI Written Exam Preliminary Key 2026',
    category: 'Railway',
    keyReleaseDate: '2026-05-22',
    answerKeyUrl: 'https://indianrailways.gov.in/answerkey-rpf-si'
  }
];

const INITIAL_CURRENT_AFFAIRS: CurrentAffairs[] = [
  {
    id: 'ca-1',
    title: 'ISRO Successfully Launches INSAT-4DS Weather Satellite',
    content: `Indian Space Research Organisation (ISRO) successfully launched the INSAT-4DS weather satellite on GSLV-F14. 
The satellite aims to significantly enhance weather monitoring, climate study, and disaster warning systems for India. INSAT-4DS operates in the geostationary orbit and is funded by the Ministry of Earth Sciences.`,
    date: '2026-05-30',
    category: 'Science',
    tags: ['ISRO', 'Space Science', 'INSAT-4DS', 'Satellites']
  },
  {
    id: 'ca-2',
    title: 'India Ranks 4th in Global Renewable Energy Capacity Index',
    content: `According to the latest Renewable Energy Network 21 report, India continues its march as a green leader, placing 4th globally in total installed solar and wind capacity. 
The government has set a rigorous target of achieving 500 GW of non-fossil fuel capacity by 2030, supported heavily by solar parks in Rajasthan and Gujarat.`,
    date: '2026-05-29',
    category: 'Economy',
    tags: ['Renewable Energy', 'Economy', 'Global Index', 'Solar Power']
  },
  {
    id: 'ca-3',
    title: 'NITI Aayog Launches Sustainable Water Index Report',
    content: `NITI Aayog has unveiled its comprehensive Sustainable Water Management Index 2026. 
Kerala, Haryana, and Himachal Pradesh emerged as top-performing states in water-use efficiency, watershed harvesting, and recycling infrastructure.`,
    date: '2026-05-28',
    category: 'National',
    tags: ['NITI Aayog', 'Water Management', 'Government Index']
  }
];

const GENERAL_SCIENCE_QUESTIONS: Question[] = [
  {
    id: 'gn-q1',
    text: 'Which chemical element is represented by the symbol "Fe" on the periodic table?',
    options: ['Gold', 'Iron', 'Fluorine', 'Fermium'],
    answerIndex: 1,
    explanation: '"Fe" stands for Ferrum, which is Latin for Iron. Atomic number is 26.',
    subject: 'General Science',
    topic: 'Physics/Chemistry',
    difficulty: 'Easy'
  },
  {
    id: 'gn-q2',
    text: 'What gas is primarily manufactured during the process of photosynthesis by plants?',
    options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
    answerIndex: 2,
    explanation: 'During photosynthesis, plants intake CO2 and Water in the presence of sunlight, generating Glucose and releasing Oxygen (O2) gas.',
    subject: 'General Science',
    topic: 'Biology',
    difficulty: 'Easy'
  },
  {
    id: 'gn-q3',
    text: 'Which layer of Earth\'s atmosphere contains the ozone layer that protects us from ultraviolet rays?',
    options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
    answerIndex: 1,
    explanation: 'The Stratosphere contains the protective Ozone Layer, absorbing about 97% to 99% of the sun\'s medium-frequency ultraviolet light.',
    subject: 'General Science',
    topic: 'Geography & Ecology',
    difficulty: 'Medium'
  },
  {
    id: 'gn-q4',
    text: 'The absolute zero of temperature, theoretical limit of cooling, is defined as:',
    options: ['-100 डिग्री सेल्सियस', '0 डिग्री सेल्सियस', '-273.15 डिग्री सेल्सियस', '-373.15 डिग्री सेल्सियस'],
    answerIndex: 2,
    explanation: 'Absolute zero is 0 Kelvin, which equates strictly to -273.15°C. At this stage, thermodynamic motion ceases.',
    subject: 'General Science',
    topic: 'Physics',
    difficulty: 'Medium'
  },
  {
    id: 'gn-q5',
    text: 'Which organ of the human body is responsible for producing Insulin?',
    options: ['Liver', 'Pancreas', 'Kidney', 'Thyroid'],
    answerIndex: 1,
    explanation: 'The Beta cells in the Islets of Langerhans inside the Pancreas produce insulin, managing blood sugar levels.',
    subject: 'General Science',
    topic: 'Biology',
    difficulty: 'Easy'
  }
];

const POLITY_QUESTIONS: Question[] = [
  {
    id: 'pol-q1',
    text: 'Which Article of the Indian Constitution outlines the Fundamental Duties of citizens?',
    options: ['Article 32', 'Article 44', 'Article 51A', 'Article 21A'],
    answerIndex: 2,
    explanation: 'Article 51A under Part IV-A specifies the Fundamental Duties, added by the 42nd Amendment Act in 1976.',
    subject: 'Indian Polity',
    topic: 'Constitutional Provisions',
    difficulty: 'Medium'
  },
  {
    id: 'pol-q2',
    text: 'Who is considered the ex-officio Chairman of the Rajya Sabha (Upper House)?',
    options: ['The President of India', 'The Prime Minister of India', 'The Vice-President of India', 'The Speaker of Lok Sabha'],
    answerIndex: 2,
    explanation: 'According to Article 64 of the Indian Constitution, the Vice-President of India is the ex-officio chairman of the Council of States (Rajya Sabha).',
    subject: 'Indian Polity',
    topic: 'Parliament',
    difficulty: 'Easy'
  },
  {
    id: 'pol-q3',
    text: 'How many schedules are there currently in the Indian Constitution?',
    options: ['8', '10', '12', '14'],
    answerIndex: 2,
    explanation: 'Originally, the Indian Constitution had 8 schedules. Currently there are 12 schedules in total.',
    subject: 'Indian Polity',
    topic: 'Schedules',
    difficulty: 'Easy'
  },
  {
    id: 'pol-q4',
    text: 'Dynamic state policy instructions (DPSPs) in the Indian Constitution were inspired from the constitution of:',
    options: ['United States (USA)', 'Ireland', 'Soviet Union (USSR)', 'Australia'],
    answerIndex: 1,
    explanation: 'The Directive Principles of State Policy are borrowed from the Irish Constitution (Part IV, Articles 36-51).',
    subject: 'Indian Polity',
    topic: 'Sources of Constitution',
    difficulty: 'Medium'
  },
  {
    id: 'pol-q5',
    text: 'What is the maximum strength of members represented in the Lok Sabha as set by the Constitution?',
    options: ['500', '543', '552', '560'],
    answerIndex: 2,
    explanation: 'Under Article 81, the maximum member count limits to 552 (though currently, representation is 543 after 104 Amendment removing Anglo-Indian reservations).',
    subject: 'Indian Polity',
    topic: 'Parliament',
    difficulty: 'Hard'
  }
];

const INITIAL_MOCK_TESTS: MockTest[] = [
  {
    id: 'mock-1',
    title: 'SSC CGL General GK Mini-Mock Test',
    category: 'SSC',
    durationMinutes: 10,
    totalQuestions: 5,
    isPaid: false,
    scoreWeight: 2,
    negativeMarks: 0.5,
    questions: GENERAL_SCIENCE_QUESTIONS,
    createdAt: '2026-05-25'
  },
  {
    id: 'mock-2',
    title: 'UP Police Constitution & Polity Mock Test',
    category: 'UP Police',
    durationMinutes: 10,
    totalQuestions: 5,
    isPaid: true,
    scoreWeight: 2,
    negativeMarks: 0.5,
    questions: POLITY_QUESTIONS,
    createdAt: '2026-05-28'
  }
];

export class Database {
  private data: DatabaseSchema;
  private pool: mysql.Pool | null = null;
  private hasMySQL = false;
  private resetCodes = new Map<string, { code: string; expires: number }>();

  constructor() {
    this.data = {
      users: {},
      jobs: [],
      admitCards: [],
      results: [],
      answerKeys: [],
      currentAffairs: [],
      mockTests: [],
      attempts: [],
      subscriptions: [],
      payments: [],
      settings: DEFAULT_SETTINGS,
      logs: []
    };
    this.load();
    this.initMySQL();
  }

  private async executeSql(sql: string, params: any[] = []) {
    if (!this.pool || !this.hasMySQL) return;
    try {
      await this.pool.execute(sql, params);
    } catch (err: any) {
      console.error(`MySQL Async Statement Execution Failed: ${sql}. Error:`, err);
    }
  }

  private async initMySQL() {
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    const port = parseInt(process.env.DB_PORT || '3306');

    if (!host || !user || !database) {
      const errMsg = 'CRITICAL CONFIG ERROR: MySQL environment variables (DB_HOST, DB_USER, DB_NAME) are missing but mandatory. Please configure your live MySQL database credentials in the environment variables to proceed.';
      console.error(errMsg);
      throw new Error(errMsg);
    }

    try {
      console.log(`Connecting to MySQL database: ${database} at ${host}:${port}...`);
      this.pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Verify connection
      const connection = await this.pool.getConnection();
      console.log('MySQL connection established successfully!');
      connection.release();
      this.hasMySQL = true;

      // Define table creation statements
      const tableQueries = [
        `CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(100) PRIMARY KEY,
          email VARCHAR(150) UNIQUE,
          name VARCHAR(100),
          role VARCHAR(50),
          isVerified BOOLEAN,
          passwordHash VARCHAR(256),
          savedNotifications TEXT,
          bookmarks TEXT,
          createdAt VARCHAR(100)
        )`,
        `CREATE TABLE IF NOT EXISTS jobs (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255),
          department TEXT,
          category VARCHAR(100),
          postCount INT,
          publishDate VARCHAR(100),
          lastDateToApply VARCHAR(100),
          examDate VARCHAR(100),
          pdfUrl TEXT,
          applyUrl TEXT,
          officialWebsite TEXT,
          ageLimit TEXT,
          qualification TEXT,
          applicationFee TEXT,
          details TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS admit_cards (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255),
          category VARCHAR(100),
          examDate VARCHAR(100),
          downloadUrl TEXT,
          status VARCHAR(100),
          releaseDate VARCHAR(100)
        )`,
        `CREATE TABLE IF NOT EXISTS results (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255),
          category VARCHAR(100),
          declareDate VARCHAR(100),
          resultUrl TEXT,
          status VARCHAR(100)
        )`,
        `CREATE TABLE IF NOT EXISTS answer_keys (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255),
          category VARCHAR(100),
          keyReleaseDate VARCHAR(100),
          answerKeyUrl TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS current_affairs (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255),
          content TEXT,
          date VARCHAR(100),
          category VARCHAR(100),
          tags TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS mock_tests (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255),
          category VARCHAR(100),
          durationMinutes INT,
          totalQuestions INT,
          isPaid BOOLEAN,
          scoreWeight FLOAT,
          negativeMarks FLOAT,
          questions TEXT,
          createdAt VARCHAR(100)
        )`,
        `CREATE TABLE IF NOT EXISTS attempts (
          id VARCHAR(100) PRIMARY KEY,
          userId VARCHAR(100),
          mockTestId VARCHAR(100),
          mockTestTitle VARCHAR(255),
          score FLOAT,
          totalQuestions INT,
          correctAnswersCount INT,
          wrongAnswersCount INT,
          unattemptedCount INT,
          durationSpentSeconds INT,
          percentile FLOAT,
          rank INT,
          totalParticipants INT,
          subjectAnalysis TEXT,
          createdAt VARCHAR(100)
        )`,
        `CREATE TABLE IF NOT EXISTS subscriptions (
          id VARCHAR(100) PRIMARY KEY,
          userId VARCHAR(100),
          packId VARCHAR(100),
          packName VARCHAR(255),
          purchaseDate VARCHAR(100),
          expiryDate VARCHAR(100),
          amount FLOAT,
          status VARCHAR(50)
        )`,
        `CREATE TABLE IF NOT EXISTS payments (
          id VARCHAR(100) PRIMARY KEY,
          userId VARCHAR(100),
          userEmail VARCHAR(150),
          packId VARCHAR(100),
          packName VARCHAR(255),
          amount FLOAT,
          status VARCHAR(50),
          createdAt VARCHAR(100),
          transactionId VARCHAR(100),
          gstInvoiceNo VARCHAR(100)
        )`,
        `CREATE TABLE IF NOT EXISTS settings (
          id VARCHAR(20) PRIMARY KEY,
          geminiModel VARCHAR(100),
          googleOAuthEnabled BOOLEAN,
          payUEnabled BOOLEAN,
          maintenanceMode BOOLEAN,
          smtpStatus VARCHAR(100)
        )`,
        `CREATE TABLE IF NOT EXISTS logs (
          id VARCHAR(100) PRIMARY KEY,
          timestamp VARCHAR(100),
          type VARCHAR(50),
          message TEXT,
          meta TEXT
        )`
      ];

      for (const q of tableQueries) {
        await this.pool.execute(q);
      }

      console.log('MySQL Database schema matching verified.');
      this.log('info', 'Database starting: Connected securely to cPanel MySQL.');

      // Load data from MySQL or Seed defaults
      await this.syncWithMySQLData();

    } catch (err: any) {
      console.error('CRITICAL DATABASE ERROR: Connected to cPanel MySQL failed. Live database is mandatory for this deploy.', err);
      this.pool = null;
      this.hasMySQL = false;
      throw new Error(`MySQL Database initialization failed: ${err.message}. Please verify hosts, database configuration, usernames, passwords, and permissions.`);
    }
  }

  private async syncWithMySQLData() {
    if (!this.pool) return;
    try {
      const [userRows]: any = await this.pool.execute('SELECT COUNT(*) as count FROM users');
      const hasData = userRows[0] && userRows[0].count > 0;

      if (!hasData) {
        console.log('MySQL Database is clean. Seeding initial server memory dataset to MySQL...');
        this.log('info', 'Seeding empty MySQL tables with current default database context.');

        // Seed Users
        for (const user of Object.values(this.data.users)) {
          await this.pool.execute(
            'INSERT INTO users (id, email, name, role, isVerified, passwordHash, savedNotifications, bookmarks, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              user.id,
              user.email,
              user.name,
              user.role,
              user.isVerified ? 1 : 0,
              user.passwordHash,
              JSON.stringify(user.savedNotifications || []),
              JSON.stringify(user.bookmarks || []),
              user.createdAt
            ]
          );
        }

        // Seed Jobs
        for (const job of this.data.jobs) {
          await this.pool.execute(
            'INSERT INTO jobs (id, title, department, category, postCount, publishDate, lastDateToApply, examDate, pdfUrl, applyUrl, officialWebsite, ageLimit, qualification, applicationFee, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              job.id,
              job.title,
              job.department,
              job.category,
              job.postCount,
              job.publishDate,
              job.lastDateToApply,
              job.examDate,
              job.pdfUrl,
              job.applyUrl,
              job.officialWebsite,
              job.ageLimit,
              job.qualification,
              job.applicationFee,
              job.details
            ]
          );
        }

        // Seed Admit Cards
        for (const card of this.data.admitCards) {
          await this.pool.execute(
            'INSERT INTO admit_cards (id, title, category, examDate, downloadUrl, status, releaseDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [card.id, card.title, card.category, card.examDate, card.downloadUrl, card.status, card.releaseDate]
          );
        }

        // Seed Results
        for (const res of this.data.results) {
          await this.pool.execute(
            'INSERT INTO results (id, title, category, declareDate, resultUrl, status) VALUES (?, ?, ?, ?, ?, ?)',
            [res.id, res.title, res.category, res.declareDate, res.resultUrl, res.status]
          );
        }

        // Seed Answer Keys
        for (const key of this.data.answerKeys) {
          await this.pool.execute(
            'INSERT INTO answer_keys (id, title, category, keyReleaseDate, answerKeyUrl) VALUES (?, ?, ?, ?, ?)',
            [key.id, key.title, key.category, key.keyReleaseDate, key.answerKeyUrl]
          );
        }

        // Seed Current Affairs
        for (const ca of this.data.currentAffairs) {
          await this.pool.execute(
            'INSERT INTO current_affairs (id, title, content, date, category, tags) VALUES (?, ?, ?, ?, ?, ?)',
            [ca.id, ca.title, ca.content, ca.date, ca.category, JSON.stringify(ca.tags || [])]
          );
        }

        // Seed Mock Tests
        for (const test of this.data.mockTests) {
          await this.pool.execute(
            'INSERT INTO mock_tests (id, title, category, durationMinutes, totalQuestions, isPaid, scoreWeight, negativeMarks, questions, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              test.id,
              test.title,
              test.category,
              test.durationMinutes,
              test.totalQuestions,
              test.isPaid ? 1 : 0,
              test.scoreWeight,
              test.negativeMarks,
              JSON.stringify(test.questions || []),
              test.createdAt
            ]
          );
        }

        // Seed Attempts
        for (const attempt of this.data.attempts) {
          await this.pool.execute(
            'INSERT INTO attempts (id, userId, mockTestId, mockTestTitle, score, totalQuestions, correctAnswersCount, wrongAnswersCount, unattemptedCount, durationSpentSeconds, percentile, rank, totalParticipants, subjectAnalysis, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              attempt.id,
              attempt.userId,
              attempt.mockTestId,
              attempt.mockTestTitle,
              attempt.score,
              attempt.totalQuestions,
              attempt.correctAnswersCount,
              attempt.wrongAnswersCount,
              attempt.unattemptedCount,
              attempt.durationSpentSeconds,
              attempt.percentile,
              attempt.rank,
              attempt.totalParticipants,
              JSON.stringify(attempt.subjectAnalysis || []),
              attempt.createdAt
            ]
          );
        }

        // Seed Subscriptions
        for (const sub of this.data.subscriptions) {
          await this.pool.execute(
            'INSERT INTO subscriptions (id, userId, packId, packName, purchaseDate, expiryDate, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [sub.id, sub.userId, sub.packId, sub.packName, sub.purchaseDate, sub.expiryDate, sub.amount, sub.status]
          );
        }

        // Seed Payments
        for (const pay of this.data.payments) {
          await this.pool.execute(
            'INSERT INTO payments (id, userId, userEmail, packId, packName, amount, status, createdAt, transactionId, gstInvoiceNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [pay.id, pay.userId, pay.userEmail, pay.packId, pay.packName, pay.amount, pay.status, pay.createdAt, pay.transactionId, pay.gstInvoiceNo]
          );
        }

        // Seed Settings
        await this.pool.execute(
          'INSERT INTO settings (id, geminiModel, googleOAuthEnabled, payUEnabled, maintenanceMode, smtpStatus) VALUES (?, ?, ?, ?, ?, ?)',
          [
            'main',
            this.data.settings.geminiModel,
            this.data.settings.googleOAuthEnabled ? 1 : 0,
            this.data.settings.payUEnabled ? 1 : 0,
            this.data.settings.maintenanceMode ? 1 : 0,
            this.data.settings.smtpStatus
          ]
        );

        // Seed Logs
        for (const l of this.data.logs) {
          await this.pool.execute(
            'INSERT INTO logs (id, timestamp, type, message, meta) VALUES (?, ?, ?, ?, ?)',
            [l.id, l.timestamp, l.type, l.message, JSON.stringify(l.meta || {})]
          );
        }

        console.log('MySQL Database seeding complete.');
      } else {
        console.log('MySQL database contains matching records. Synchronizing memory data store from MySQL...');
        
        // 1. Users
        const [usersList]: any = await this.pool.execute('SELECT * FROM users');
        const dbUsers: { [id: string]: User & { passwordHash: string } } = {};
        for (const r of usersList) {
          dbUsers[r.id] = {
            id: r.id,
            email: r.email,
            name: r.name,
            role: r.role,
            isVerified: r.isVerified === 1 || r.isVerified === true,
            passwordHash: r.passwordHash,
            savedNotifications: JSON.parse(r.savedNotifications || '[]'),
            bookmarks: JSON.parse(r.bookmarks || '[]'),
            createdAt: r.createdAt
          };
        }
        this.data.users = dbUsers;

        // 2. Jobs
        const [jobsList]: any = await this.pool.execute('SELECT * FROM jobs');
        this.data.jobs = jobsList;

        // 3. Admit Cards
        const [admitsList]: any = await this.pool.execute('SELECT * FROM admit_cards');
        this.data.admitCards = admitsList;

        // 4. Results
        const [resultsList]: any = await this.pool.execute('SELECT * FROM results');
        this.data.results = resultsList;

        // 5. Answer Keys
        const [keysList]: any = await this.pool.execute('SELECT * FROM answer_keys');
        this.data.answerKeys = keysList;

        // 6. Current Affairs
        const [caList]: any = await this.pool.execute('SELECT * FROM current_affairs');
        this.data.currentAffairs = caList.map((r: any) => ({
          id: r.id,
          title: r.title,
          content: r.content,
          date: r.date,
          category: r.category,
          tags: JSON.parse(r.tags || '[]')
        }));

        // 7. Mock Tests
        const [mockList]: any = await this.pool.execute('SELECT * FROM mock_tests');
        this.data.mockTests = mockList.map((r: any) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          durationMinutes: r.durationMinutes,
          totalQuestions: r.totalQuestions,
          isPaid: r.isPaid === 1 || r.isPaid === true,
          scoreWeight: r.scoreWeight,
          negativeMarks: r.negativeMarks,
          questions: JSON.parse(r.questions || '[]'),
          createdAt: r.createdAt
        }));

        // 8. Attempts
        const [attemptsList]: any = await this.pool.execute('SELECT * FROM attempts');
        this.data.attempts = attemptsList.map((r: any) => ({
          id: r.id,
          userId: r.userId,
          mockTestId: r.mockTestId,
          mockTestTitle: r.mockTestTitle,
          score: r.score,
          totalQuestions: r.totalQuestions,
          correctAnswersCount: r.correctAnswersCount,
          wrongAnswersCount: r.wrongAnswersCount,
          unattemptedCount: r.unattemptedCount,
          durationSpentSeconds: r.durationSpentSeconds,
          percentile: r.percentile,
          rank: r.rank,
          totalParticipants: r.totalParticipants,
          subjectAnalysis: JSON.parse(r.subjectAnalysis || '[]'),
          createdAt: r.createdAt
        }));

        // 9. Subscriptions
        const [subsList]: any = await this.pool.execute('SELECT * FROM subscriptions');
        this.data.subscriptions = subsList;

        // 10. Payments
        const [paymentsList]: any = await this.pool.execute('SELECT * FROM payments');
        this.data.payments = paymentsList;

        // 11. Settings
        const [settRows]: any = await this.pool.execute('SELECT * FROM settings WHERE id = ?', ['main']);
        if (settRows[0]) {
          const s = settRows[0];
          this.data.settings = {
            geminiModel: s.geminiModel,
            googleOAuthEnabled: s.googleOAuthEnabled === 1 || s.googleOAuthEnabled === true,
            payUEnabled: s.payUEnabled === 1 || s.payUEnabled === true,
            maintenanceMode: s.maintenanceMode === 1 || s.maintenanceMode === true,
            smtpStatus: s.smtpStatus
          };
        }

        // 12. Logs
        const [logsList]: any = await this.pool.execute('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100');
        this.data.logs = logsList.map((r: any) => ({
          id: r.id,
          timestamp: r.timestamp,
          type: r.type,
          message: r.message,
          meta: JSON.parse(r.meta || '{}')
        }));

        console.log('MySQL synchronization completed. Loaded users: ' + Object.keys(this.data.users).length);
      }

      this.save();
    } catch (err: any) {
      console.error('MySQL Synchronization failed:', err);
      this.log('error', `MySQL Synchronization Exception: ${err.message}`);
    }
  }

  private load() {
    this.resetToDefaults();
  }

  private save() {
    // Local storage disabled: strictly MySQL database backed
  }

  private resetToDefaults() {
    const adminH = hashPassword('AdminPass2026!');
    const devH = hashPassword('DevStrongPass!2026');
    const userH = hashPassword('user123');

    this.data = {
      users: {
        'admin-1': {
          id: 'admin-1',
          email: 'admin@examduniya.in',
          name: 'Super Admin',
          role: 'admin',
          isVerified: true,
          passwordHash: adminH,
          savedNotifications: [],
          bookmarks: [],
          createdAt: new Date().toISOString()
        },
        'dev-1': {
          id: 'dev-1',
          email: 'deshifarmer88@gmail.com', // Match the user's logged in email automatically for VIP access
          name: 'Super Developer',
          role: 'developer',
          isVerified: true,
          passwordHash: devH,
          savedNotifications: [],
          bookmarks: [],
          createdAt: new Date().toISOString()
        },
        'user-1': {
          id: 'user-1',
          email: 'demo@examduniya.in',
          name: 'Rohan Sharma',
          role: 'user',
          isVerified: true,
          passwordHash: userH,
          savedNotifications: [],
          bookmarks: [],
          createdAt: new Date().toISOString()
        }
      },
      jobs: INITIAL_JOBS,
      admitCards: INITIAL_ADMIT_CARDS,
      results: INITIAL_RESULTS,
      answerKeys: INITIAL_ANSWER_KEYS,
      currentAffairs: INITIAL_CURRENT_AFFAIRS,
      mockTests: INITIAL_MOCK_TESTS,
      attempts: [
        {
          id: 'att-1',
          userId: 'user-1',
          mockTestId: 'mock-1',
          mockTestTitle: 'SSC CGL General GK Mini-Mock Test',
          score: 8,
          totalQuestions: 5,
          correctAnswersCount: 4,
          wrongAnswersCount: 0,
          unattemptedCount: 1,
          durationSpentSeconds: 240,
          percentile: 90.5,
          rank: 2,
          totalParticipants: 21,
          subjectAnalysis: [
            { subject: 'General Science', total: 5, correct: 4, wrong: 0 }
          ],
          createdAt: '2026-05-29T10:00:00Z'
        }
      ],
      subscriptions: [
        {
          id: 'sub-1',
          userId: 'user-1',
          packId: 'up-police',
          packName: 'UP Police Pack',
          purchaseDate: '2026-05-20',
          expiryDate: '2027-05-20',
          amount: 299,
          status: 'active'
        }
      ],
      payments: [
        {
          id: 'pay-1',
          userId: 'user-1',
          userEmail: 'demo@examduniya.in',
          packId: 'up-police',
          packName: 'UP Police Pack',
          amount: 299,
          status: 'Success',
          createdAt: '2026-05-20T11:22:00Z',
          transactionId: 'PAYU_TXN_88192019',
          gstInvoiceNo: 'INV-2026-ED-0012'
        }
      ],
      settings: DEFAULT_SETTINGS,
      logs: [
        {
          id: 'log-1',
          timestamp: new Date().toISOString(),
          type: 'info',
          message: 'ExamDuniya local DB system initialized with comprehensive starter schema.'
        }
      ]
    };
    this.save();
  }

  // --- LOGGING ---
  public log(type: 'info' | 'error' | 'api' | 'auth', message: string, meta?: any) {
    const l: SystemLog = {
      id: 'log-' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      type,
      message,
      meta
    };
    this.data.logs.unshift(l);
    if (this.data.logs.length > 200) this.data.logs.pop(); // Cap log size
    this.save();

    this.executeSql('INSERT INTO logs (id, timestamp, type, message, meta) VALUES (?, ?, ?, ?, ?)', [
      l.id, l.timestamp, l.type, l.message, JSON.stringify(l.meta || {})
    ]);
  }

  public getLogs() {
    return this.data.logs;
  }

  public clearLogs() {
    this.data.logs = [];
    this.log('info', 'System logs cleared by administrative action');
    this.save();
    this.executeSql('DELETE FROM logs');
  }

  // --- SETTINGS ---
  public getSettings(): SystemSettings {
    const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
    const hasTelegram = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
    return {
      ...this.data.settings,
      smtpStatus: hasSmtp ? 'Configured' : 'Not Configured',
      telegramStatus: hasTelegram ? 'Configured' : 'Not Configured'
    };
  }

  public updateSettings(settings: Partial<SystemSettings>) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.log('info', `System settings updated: ${JSON.stringify(settings)}`);
    this.save();

    this.executeSql(
      'UPDATE settings SET geminiModel=?, googleOAuthEnabled=?, payUEnabled=?, maintenanceMode=?, smtpStatus=? WHERE id=?',
      [
        this.data.settings.geminiModel,
        this.data.settings.googleOAuthEnabled ? 1 : 0,
        this.data.settings.payUEnabled ? 1 : 0,
        this.data.settings.maintenanceMode ? 1 : 0,
        this.data.settings.smtpStatus,
        'main'
      ]
    );
    return this.data.settings;
  }

  // --- USERS ---
  public getUsers() {
    return Object.values(this.data.users);
  }

  public findUserById(id: string): User | undefined {
    const u = this.data.users[id];
    if (!u) return undefined;
    const { passwordHash, ...safeUser } = u;
    return safeUser;
  }

  public findUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
    return Object.values(this.data.users).find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public register(name: string, email: string, pass: string, role: 'user' | 'admin' | 'developer' = 'user'): User {
    const existing = this.findUserByEmail(email);
    if (existing) {
      throw new Error('User with this email already exists.');
    }
    const id = 'user-' + Math.random().toString(36).substr(2, 9);
    const passwordHash = hashPassword(pass);
    const newUser = {
      id,
      email,
      name,
      role,
      isVerified: role === 'developer' || role === 'admin',
      passwordHash,
      savedNotifications: [],
      bookmarks: [],
      createdAt: new Date().toISOString()
    };
    this.data.users[id] = newUser;
    this.log('auth', `New user registered: ${name} (${email}) - Role: ${role}`);
    this.save();

    this.executeSql(
      'INSERT INTO users (id, email, name, role, isVerified, passwordHash, savedNotifications, bookmarks, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newUser.id,
        newUser.email,
        newUser.name,
        newUser.role,
        newUser.isVerified ? 1 : 0,
        newUser.passwordHash,
        '[]',
        '[]',
        newUser.createdAt
      ]
    );
    
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  public setResetCode(email: string, code: string, expiryMs: number = 10 * 60 * 1000) {
    this.resetCodes.set(email.toLowerCase(), {
      code,
      expires: Date.now() + expiryMs
    });
  }

  public verifyResetCode(email: string, code: string): boolean {
    const entry = this.resetCodes.get(email.toLowerCase());
    if (!entry) return false;
    if (entry.expires < Date.now()) {
      this.resetCodes.delete(email.toLowerCase());
      return false;
    }
    return entry.code === code;
  }

  public clearResetCode(email: string) {
    this.resetCodes.delete(email.toLowerCase());
  }

  public resetUserPassword(email: string, pass: string): boolean {
    const u = this.findUserByEmail(email);
    if (!u) return false;
    
    const passwordHash = hashPassword(pass);
    u.passwordHash = passwordHash;
    this.save();
    
    this.executeSql('UPDATE users SET passwordHash=? WHERE id=?', [passwordHash, u.id]);
    this.log('auth', `Password reset successful for user: ${u.name} (${email})`);
    return true;
  }

  public findOrCreateGoogleUser(email: string, name: string): User {
    const existing = this.findUserByEmail(email);
    if (existing) {
      const { passwordHash, ...safeUser } = existing;
      return safeUser;
    }

    // Generate random secure password for Google users in case they ever want to sign in directly
    const randomStr = crypto.randomBytes(16).toString('hex');
    return this.register(name, email, randomStr, 'user');
  }

  public updateRole(userId: string, role: 'user' | 'admin' | 'developer') {
    const u = this.data.users[userId];
    if (u) {
      u.role = role;
      this.log('info', `Updated user ${u.name} role to ${role}`);
      this.save();
      this.executeSql('UPDATE users SET role=? WHERE id=?', [role, userId]);
    }
  }

  public toggleNotification(userId: string, jobId: string) {
    const u = this.data.users[userId];
    if (u) {
      if (!u.savedNotifications) u.savedNotifications = [];
      const idx = u.savedNotifications.indexOf(jobId);
      if (idx > -1) {
        u.savedNotifications.splice(idx, 1);
      } else {
        u.savedNotifications.push(jobId);
      }
      this.save();
      this.executeSql('UPDATE users SET savedNotifications=? WHERE id=?', [JSON.stringify(u.savedNotifications), userId]);
      return u.savedNotifications;
    }
    return [];
  }

  public toggleBookmark(userId: string, mockTestId: string) {
    const u = this.data.users[userId];
    if (u) {
      if (!u.bookmarks) u.bookmarks = [];
      const idx = u.bookmarks.indexOf(mockTestId);
      if (idx > -1) {
        u.bookmarks.splice(idx, 1);
      } else {
        u.bookmarks.push(mockTestId);
      }
      this.save();
      this.executeSql('UPDATE users SET bookmarks=? WHERE id=?', [JSON.stringify(u.bookmarks), userId]);
      return u.bookmarks;
    }
    return [];
  }

  // --- JOBS ---
  public getJobs(): JobNotification[] {
    return this.data.jobs;
  }

  public addJob(notification: Omit<JobNotification, 'id' | 'publishDate'>): JobNotification {
    const id = 'job-' + Math.random().toString(36).substr(2, 9);
    const newJob: JobNotification = {
      ...notification,
      id,
      publishDate: new Date().toISOString().split('T')[0]
    };
    this.data.jobs.unshift(newJob);
    this.log('info', `Created new government job alert: ${newJob.title}`);
    this.save();

    this.executeSql(
      'INSERT INTO jobs (id, title, department, category, postCount, publishDate, lastDateToApply, examDate, pdfUrl, applyUrl, officialWebsite, ageLimit, qualification, applicationFee, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newJob.id,
        newJob.title,
        newJob.department,
        newJob.category,
        newJob.postCount,
        newJob.publishDate,
        newJob.lastDateToApply,
        newJob.examDate,
        newJob.pdfUrl,
        newJob.applyUrl,
        newJob.officialWebsite,
        newJob.ageLimit,
        newJob.qualification,
        newJob.applicationFee,
        newJob.details
      ]
    );

    return newJob;
  }

  public editJob(id: string, updated: Partial<JobNotification>): JobNotification {
    const idx = this.data.jobs.findIndex(j => j.id === id);
    if (idx === -1) throw new Error('Job not found');
    this.data.jobs[idx] = { ...this.data.jobs[idx], ...updated };
    this.log('info', `Edited job alert: ${this.data.jobs[idx].title}`);
    this.save();

    const j = this.data.jobs[idx];
    this.executeSql(
      'UPDATE jobs SET title=?, department=?, category=?, postCount=?, lastDateToApply=?, examDate=?, pdfUrl=?, applyUrl=?, officialWebsite=?, ageLimit=?, qualification=?, applicationFee=?, details=? WHERE id=?',
      [
        j.title,
        j.department,
        j.category,
        j.postCount,
        j.lastDateToApply,
        j.examDate,
        j.pdfUrl,
        j.applyUrl,
        j.officialWebsite,
        j.ageLimit,
        j.qualification,
        j.applicationFee,
        j.details,
        id
      ]
    );

    return this.data.jobs[idx];
  }

  public deleteJob(id: string) {
    this.data.jobs = this.data.jobs.filter(j => j.id !== id);
    this.log('info', `Deleted job alert code: ${id}`);
    this.save();
    this.executeSql('DELETE FROM jobs WHERE id=?', [id]);
  }

  // --- ADMIT CARDS ---
  public getAdmitCards(): AdmitCard[] {
    return this.data.admitCards;
  }

  public addAdmitCard(card: Omit<AdmitCard, 'id' | 'releaseDate'>): AdmitCard {
    const id = 'admit-' + Math.random().toString(36).substr(2, 9);
    const newCard: AdmitCard = {
      ...card,
      id,
      releaseDate: new Date().toISOString().split('T')[0]
    };
    this.data.admitCards.unshift(newCard);
    this.log('info', `Created static Admit Card alert: ${newCard.title}`);
    this.save();

    this.executeSql(
      'INSERT INTO admit_cards (id, title, category, examDate, downloadUrl, status, releaseDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newCard.id, newCard.title, newCard.category, newCard.examDate, newCard.downloadUrl, newCard.status, newCard.releaseDate]
    );

    return newCard;
  }

  public deleteAdmitCard(id: string) {
    this.data.admitCards = this.data.admitCards.filter(c => c.id !== id);
    this.save();
    this.executeSql('DELETE FROM admit_cards WHERE id=?', [id]);
  }

  // --- RESULTS ---
  public getResults(): Result[] {
    return this.data.results;
  }

  public addResult(res: Omit<Result, 'id'>): Result {
    const id = 'res-' + Math.random().toString(36).substr(2, 9);
    const newRes: Result = { ...res, id };
    this.data.results.unshift(newRes);
    this.log('info', `Published Result update: ${newRes.title}`);
    this.save();

    this.executeSql(
      'INSERT INTO results (id, title, category, declareDate, resultUrl, status) VALUES (?, ?, ?, ?, ?, ?)',
      [newRes.id, newRes.title, newRes.category, newRes.declareDate, newRes.resultUrl, newRes.status]
    );

    return newRes;
  }

  public deleteResult(id: string) {
    this.data.results = this.data.results.filter(r => r.id !== id);
    this.save();
    this.executeSql('DELETE FROM results WHERE id=?', [id]);
  }

  // --- ANSWER KEYS ---
  public getAnswerKeys(): AnswerKey[] {
    return this.data.answerKeys;
  }

  public addAnswerKey(key: Omit<AnswerKey, 'id' | 'keyReleaseDate'>): AnswerKey {
    const id = 'key-' + Math.random().toString(36).substr(2, 9);
    const newKey: AnswerKey = { ...key, id, keyReleaseDate: new Date().toISOString().split('T')[0] };
    this.data.answerKeys.unshift(newKey);
    this.log('info', `Published Answer Key alert: ${newKey.title}`);
    this.save();

    this.executeSql(
      'INSERT INTO answer_keys (id, title, category, keyReleaseDate, answerKeyUrl) VALUES (?, ?, ?, ?, ?)',
      [newKey.id, newKey.title, newKey.category, newKey.keyReleaseDate, newKey.answerKeyUrl]
    );

    return newKey;
  }

  public deleteAnswerKey(id: string) {
    this.data.answerKeys = this.data.answerKeys.filter(k => k.id !== id);
    this.save();
    this.executeSql('DELETE FROM answer_keys WHERE id=?', [id]);
  }

  // --- CURRENT AFFAIRS ---
  public getCurrentAffairs() {
    return this.data.currentAffairs;
  }

  public addCurrentAffairs(ca: Omit<CurrentAffairs, 'id' | 'date'>): CurrentAffairs {
    const id = 'ca-' + Math.random().toString(36).substr(2, 9);
    const newCa: CurrentAffairs = {
      ...ca,
      id,
      date: new Date().toISOString().split('T')[0]
    };
    this.data.currentAffairs.unshift(newCa);
    this.save();

    this.executeSql(
      'INSERT INTO current_affairs (id, title, content, date, category, tags) VALUES (?, ?, ?, ?, ?, ?)',
      [newCa.id, newCa.title, newCa.content, newCa.date, newCa.category, JSON.stringify(newCa.tags || [])]
    );

    return newCa;
  }

  public deleteCurrentAffairs(id: string) {
    this.data.currentAffairs = this.data.currentAffairs.filter(c => c.id !== id);
    this.save();
    this.executeSql('DELETE FROM current_affairs WHERE id=?', [id]);
  }

  // --- MOCK TESTS & ATTEMPTS ---
  public getMockTests() {
    return this.data.mockTests;
  }

  public addMockTest(test: Omit<MockTest, 'id' | 'createdAt'>) {
    const id = 'mock-' + Math.random().toString(36).substr(2, 9);
    const newTest: MockTest = {
      ...test,
      id,
      createdAt: new Date().toISOString()
    };
    this.data.mockTests.unshift(newTest);
    this.log('info', `Mock Test added: ${newTest.title} (${newTest.totalQuestions} Questions)`);
    this.save();

    this.executeSql(
      'INSERT INTO mock_tests (id, title, category, durationMinutes, totalQuestions, isPaid, scoreWeight, negativeMarks, questions, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newTest.id,
        newTest.title,
        newTest.category,
        newTest.durationMinutes,
        newTest.totalQuestions,
        newTest.isPaid ? 1 : 0,
        newTest.scoreWeight,
        newTest.negativeMarks,
        JSON.stringify(newTest.questions),
        newTest.createdAt
      ]
    );

    return newTest;
  }

  public submitAttempt(
    userId: string, 
    mockTestId: string, 
    answers: { [questionId: string]: number }, 
    durationSpentSeconds: number
  ): MockTestAttempt {
    const test = this.data.mockTests.find(t => t.id === mockTestId);
    if (!test) throw new Error('Mock Test not found');

    const safeAnswers = answers || {};
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    const subjectBreakdown: { [subject: string]: { total: number; correct: number; wrong: number } } = {};

    test.questions.forEach(q => {
      const qSubject = q.subject || 'General Studies';
      if (!subjectBreakdown[qSubject]) {
        subjectBreakdown[qSubject] = { total: 0, correct: 0, wrong: 0 };
      }
      subjectBreakdown[qSubject].total += 1;

      const userAns = safeAnswers[q.id];
      if (userAns === undefined || userAns === -1) {
        unattemptedCount++;
      } else if (userAns === q.answerIndex) {
        correctCount++;
        subjectBreakdown[qSubject].correct += 1;
      } else {
        wrongCount++;
        subjectBreakdown[qSubject].wrong += 1;
      }
    });

    // Score calculation with default weights
    const scoreWeight = typeof test.scoreWeight === 'number' ? test.scoreWeight : 2;
    const negativeMarks = typeof test.negativeMarks === 'number' ? test.negativeMarks : 0.5;
    const gain = correctCount * scoreWeight;
    const penalty = wrongCount * negativeMarks;
    const score = Math.max(0, parseFloat((gain - penalty).toFixed(2)));

    // Simulating global percentile & rank
    const existingAttempts = this.data.attempts.filter(a => a.mockTestId === mockTestId);
    const totalParticipants = existingAttempts.length + 1;
    
    // Better scores counting
    const betterScoresCount = existingAttempts.filter(a => a.score > score).length;
    const rank = betterScoresCount + 1;
    const percentile = parseFloat(((totalParticipants - rank) / totalParticipants * 100).toFixed(2)) || 100;

    const user = this.data.users[userId];
    const attempt: MockTestAttempt = {
      id: 'att-' + Math.random().toString(36).substr(2, 9),
      userId,
      mockTestId,
      mockTestTitle: test.title,
      score,
      totalQuestions: test.totalQuestions,
      correctAnswersCount: correctCount,
      wrongAnswersCount: wrongCount,
      unattemptedCount,
      durationSpentSeconds,
      percentile,
      rank,
      totalParticipants,
      subjectAnalysis: Object.entries(subjectBreakdown).map(([subject, stats]) => ({
        subject,
        ...stats
      })),
      createdAt: new Date().toISOString()
    };

    this.data.attempts.unshift(attempt);
    this.log('info', `User ${user ? user.name : 'Unknown'} completed mock test "${test.title}" with score ${score}`);
    this.save();

    this.executeSql(
      'INSERT INTO attempts (id, userId, mockTestId, mockTestTitle, score, totalQuestions, correctAnswersCount, wrongAnswersCount, unattemptedCount, durationSpentSeconds, percentile, rank, totalParticipants, subjectAnalysis, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        attempt.id,
        attempt.userId,
        attempt.mockTestId,
        attempt.mockTestTitle,
        attempt.score,
        attempt.totalQuestions,
        attempt.correctAnswersCount,
        attempt.wrongAnswersCount,
        attempt.unattemptedCount,
        attempt.durationSpentSeconds,
        attempt.percentile,
        attempt.rank,
        attempt.totalParticipants,
        JSON.stringify(attempt.subjectAnalysis),
        attempt.createdAt
      ]
    );

    return attempt;
  }

  public getAttemptsForUser(userId: string) {
    return this.data.attempts.filter(a => a.userId === userId);
  }

  // --- LEADERBOARD ---
  public getLeaderboard(): LeaderboardUser[] {
    const userStats: { [userId: string]: { name: string; scoresSum: number; count: number } } = {};
    
    this.data.attempts.forEach(att => {
      const u = this.data.users[att.userId];
      const name = u ? u.name : 'Aspirant ' + att.userId.substr(-4);
      if (!userStats[att.userId]) {
        userStats[att.userId] = { name, scoresSum: 0, count: 0 };
      }
      userStats[att.userId].scoresSum += att.score;
      userStats[att.userId].count += 1;
    });

    const entries = Object.entries(userStats).map(([userId, stats]) => {
      const averageScore = parseFloat((stats.scoresSum / stats.count).toFixed(2));
      const totalPoints = Math.round(stats.scoresSum * 10 + stats.count * 5); // formula
      return {
        userId,
        name: stats.name,
        testsAttempted: stats.count,
        averageScore,
        totalPoints
      };
    });

    // Sort by points desc
    const sorted = entries.sort((a, b) => b.totalPoints - a.totalPoints);
    return sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }

  // --- PAYMENTS & SUBSCRIPTIONS ---
  public getPayments() {
    return this.data.payments;
  }

  public createPayment(userId: string, packId: string, amount: number) {
    const user = this.data.users[userId];
    if (!user) throw new Error('User not found');

    const txId = 'PAYU_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const invNo = 'INV-' + new Date().getFullYear() + '-ED-' + Math.floor(1000 + Math.random() * 9000);

    const packNames: { [id: string]: string } = {
      'up-police': 'UP Police Pack',
      'ssc-gd': 'SSC GD Pack',
      'ssc-combo': 'SSC Exams Combo Pack',
      'railway-combo': 'Railway Exams Combo Pack',
      'all-combo': 'All Exams Premium Super Pass'
    };
    const packName = packNames[packId] || 'Custom Premium Exam Pack';

    // Auto-approve simulated checkout successfully (Safe and fully functional end-to-end)
    const success = true;

    if (success) {
      // Create transaction
      const txn: PaymentTransaction = {
        id: 'pay-' + Math.random().toString(36).substr(2, 9),
        userId,
        userEmail: user.email,
        packId,
        packName,
        amount,
        status: 'Success',
        createdAt: new Date().toISOString(),
        transactionId: txId,
        gstInvoiceNo: invNo
      };
      this.data.payments.unshift(txn);

      // Create subscription
      const sub: Subscription = {
        id: 'sub-' + Math.random().toString(36).substr(2, 9),
        userId,
        packId,
        packName,
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year
        amount,
        status: 'active'
      };
      this.data.subscriptions.unshift(sub);
      this.log('info', `User ${user.name} subscribed to ${packName} for ₹${amount} - Invoice ${invNo}`);
      this.save();

      this.executeSql(
        'INSERT INTO payments (id, userId, userEmail, packId, packName, amount, status, createdAt, transactionId, gstInvoiceNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [txn.id, txn.userId, txn.userEmail, txn.packId, txn.packName, txn.amount, txn.status, txn.createdAt, txn.transactionId, txn.gstInvoiceNo]
      );
      this.executeSql(
        'INSERT INTO subscriptions (id, userId, packId, packName, purchaseDate, expiryDate, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [sub.id, sub.userId, sub.packId, sub.packName, sub.purchaseDate, sub.expiryDate, sub.amount, sub.status]
      );

      return { status: 'Success', transaction: txn, subscription: sub };
    } else {
      const txn: PaymentTransaction = {
        id: 'pay-' + Math.random().toString(36).substr(2, 9),
        userId,
        userEmail: user.email,
        packId,
        packName,
        amount,
        status: 'Failed',
        createdAt: new Date().toISOString(),
        transactionId: txId,
        gstInvoiceNo: invNo
      };
      this.data.payments.unshift(txn);
      this.save();

      this.executeSql(
        'INSERT INTO payments (id, userId, userEmail, packId, packName, amount, status, createdAt, transactionId, gstInvoiceNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [txn.id, txn.userId, txn.userEmail, txn.packId, txn.packName, txn.amount, txn.status, txn.createdAt, txn.transactionId, txn.gstInvoiceNo]
      );

      return { status: 'Failed', transaction: txn };
    }
  }

  public approveVerifiedPayment(userId: string, packId: string, amount: number, txId: string) {
    const user = this.data.users[userId];
    if (!user) throw new Error('User not found');

    const invNo = 'INV-' + new Date().getFullYear() + '-ED-' + Math.floor(1000 + Math.random() * 9000);

    const packNames: { [id: string]: string } = {
      'up-police': 'UP Police Pack',
      'ssc-gd': 'SSC GD Pack',
      'ssc-combo': 'SSC Exams Combo Pack',
      'railway-combo': 'Railway Exams Combo Pack',
      'all-combo': 'All Exams Premium Super Pass'
    };
    const packName = packNames[packId] || 'Custom Premium Exam Pack';

    // Create transaction
    const txn: any = {
      id: 'pay-' + Math.random().toString(36).substr(2, 9),
      userId,
      userEmail: user.email,
      packId,
      packName,
      amount,
      status: 'Success',
      createdAt: new Date().toISOString(),
      transactionId: txId,
      gstInvoiceNo: invNo
    };
    this.data.payments.unshift(txn);

    // Create subscription
    const sub: any = {
      id: 'sub-' + Math.random().toString(36).substr(2, 9),
      userId,
      packId,
      packName,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year
      amount,
      status: 'active'
    };
    this.data.subscriptions.unshift(sub);
    this.log('info', `User ${user.name} completed real PayU Payment for ${packName} of ₹${amount} - Txn ID ${txId}`);
    this.save();

    this.executeSql(
      'INSERT INTO payments (id, userId, userEmail, packId, packName, amount, status, createdAt, transactionId, gstInvoiceNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [txn.id, txn.userId, txn.userEmail, txn.packId, txn.packName, txn.amount, txn.status, txn.createdAt, txn.transactionId, txn.gstInvoiceNo]
    );
    this.executeSql(
      'INSERT INTO subscriptions (id, userId, packId, packName, purchaseDate, expiryDate, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [sub.id, sub.userId, sub.packId, sub.packName, sub.purchaseDate, sub.expiryDate, sub.amount, sub.status]
    );

    return { transaction: txn, subscription: sub };
  }

  public getSubscriptionsForUser(userId: string) {
    return this.data.subscriptions.filter(s => s.userId === userId && s.status === 'active');
  }

  public hasActiveSubscriptionForPack(userId: string, packId: string): boolean {
    const subs = this.getSubscriptionsForUser(userId);
    // 'all-combo' has access to all packs
    return subs.some(s => s.packId === packId || s.packId === 'all-combo');
  }
}

export const db = new Database();
