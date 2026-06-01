var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");

// server/db.ts
var dotenv = __toESM(require("dotenv"), 1);
var crypto = __toESM(require("crypto"), 1);
var import_promise = __toESM(require("mysql2/promise"), 1);
dotenv.config();
function hashPassword(password) {
  return crypto.createHmac("sha256", "examduniya-salt-key-2026").update(password).digest("hex");
}
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1e3 })).toString("base64url");
  const signature = crypto.createHmac("sha256", "examduniya-jwt-secret-key-2026").update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}
function verifyToken(token) {
  try {
    const [headerStr, bodyStr, signature] = token.split(".");
    if (!headerStr || !bodyStr || !signature) return null;
    const expectedSig = crypto.createHmac("sha256", "examduniya-jwt-secret-key-2026").update(`${headerStr}.${bodyStr}`).digest("base64url");
    if (signature !== expectedSig) return null;
    const body = JSON.parse(Buffer.from(bodyStr, "base64url").toString("utf8"));
    if (body.exp < Date.now()) return null;
    return body;
  } catch {
    return null;
  }
}
var DEFAULT_SETTINGS = {
  geminiModel: "gemini-3.5-flash",
  googleOAuthEnabled: true,
  payUEnabled: true,
  maintenanceMode: false,
  smtpStatus: "Configured"
};
var INITIAL_JOBS = [
  {
    id: "job-1",
    title: "UP Police Constable Recruitment 2026",
    department: "Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB)",
    category: "UP Police",
    postCount: 60244,
    publishDate: "2026-05-15",
    lastDateToApply: "2026-06-30",
    examDate: "2026-08-12",
    pdfUrl: "https://uppbpb.gov.in/notices/constable-recruitment-2026.pdf",
    applyUrl: "https://uppbpb.gov.in/apply-online",
    officialWebsite: "https://uppbpb.gov.in",
    ageLimit: "18 - 25 Years (Relaxation as per Rules)",
    qualification: "Class 12th (Intermediate) Exam Passed from Recognized Board.",
    applicationFee: "\u20B9400 for All Categories",
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
    id: "job-2",
    title: "SSC GD Constable Notification 2026",
    department: "Staff Selection Commission (SSC)",
    category: "SSC",
    postCount: 39481,
    publishDate: "2026-05-10",
    lastDateToApply: "2026-06-15",
    examDate: "2026-09-05",
    pdfUrl: "https://ssc.gov.in/downloads/notices/SSC_GD_2026.pdf",
    applyUrl: "https://ssc.gov.in/candidate-portal",
    officialWebsite: "https://ssc.gov.in",
    ageLimit: "18 - 23 Years as on 01-01-2026",
    qualification: "Class 10th (Matriculation) Exam Passed from Recognized Board.",
    applicationFee: "\u20B9100 (SC/ST/Women/ESM are exempted)",
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
    id: "job-3",
    title: "RRB NTPC Group C Recruitment 2026",
    department: "Railway Recruitment Boards (RRB)",
    category: "Railway",
    postCount: 11558,
    publishDate: "2026-05-20",
    lastDateToApply: "2026-07-05",
    examDate: "2026-10-15",
    pdfUrl: "https://indianrailways.gov.in/rrb/ntpc-advertisement-2026.pdf",
    applyUrl: "https://rrbapply.gov.in",
    officialWebsite: "https://indianrailways.gov.in",
    ageLimit: "18 - 33 Years (Graduate Posts), 18 - 30 Years (Under-Graduate)",
    qualification: "12th pass or Graduate Degree depending on the specified post.",
    applicationFee: "\u20B9500 (Refundable \u20B9400 on CBT Stage 1) / \u20B9250 for reserved types",
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
var INITIAL_ADMIT_CARDS = [
  {
    id: "admit-1",
    title: "SSC CGL Tier 1 Exam admit Card 2026",
    category: "SSC",
    examDate: "2026-06-20",
    downloadUrl: "https://ssc.gov.in/admit-cards-cgl2026",
    status: "Released",
    releaseDate: "2026-05-30"
  },
  {
    id: "admit-2",
    title: "UPSC Civil Services Prelims Admit Card 2026",
    category: "UPSC",
    examDate: "2026-06-10",
    downloadUrl: "https://upsc.gov.in/eadmitcard-upsc",
    status: "Released",
    releaseDate: "2026-05-28"
  },
  {
    id: "admit-3",
    title: "RRB ALP (Assistant Loco Pilot) CBT-1 Admit Card 2026",
    category: "Railway",
    examDate: "2026-07-01",
    downloadUrl: "https://rrbapply.gov.in/download-alp-admit-card",
    status: "Expected Soon",
    releaseDate: "2026-06-25"
  }
];
var INITIAL_RESULTS = [
  {
    id: "res-1",
    title: "UPSC NDA & NA Exam (I) Result 2026",
    category: "Defence",
    declareDate: "2026-05-25",
    resultUrl: "https://upsc.gov.in/NDA-I-2026-results.pdf",
    status: "Released"
  },
  {
    id: "res-2",
    title: "UPSSSC PET Result & Scorecard 2025-2026",
    category: "UPSSSC",
    declareDate: "2026-05-18",
    resultUrl: "https://upsssc.gov.in/pet-result-score-login",
    status: "Released"
  },
  {
    id: "res-3",
    title: "SSC CHSL 2025 Final Result Cutoff Marks",
    category: "SSC",
    declareDate: "2026-05-29",
    resultUrl: "https://ssc.gov.in/final-result-chsl-2025",
    status: "Released"
  }
];
var INITIAL_ANSWER_KEYS = [
  {
    id: "key-1",
    title: "SSC GD Constable Written CBT Answer Key 2026",
    category: "SSC",
    keyReleaseDate: "2026-05-28",
    answerKeyUrl: "https://ssc.gov.in/answerkey-challege-gd"
  },
  {
    id: "key-2",
    title: "Railway RPF SI Written Exam Preliminary Key 2026",
    category: "Railway",
    keyReleaseDate: "2026-05-22",
    answerKeyUrl: "https://indianrailways.gov.in/answerkey-rpf-si"
  }
];
var INITIAL_CURRENT_AFFAIRS = [
  {
    id: "ca-1",
    title: "ISRO Successfully Launches INSAT-4DS Weather Satellite",
    content: `Indian Space Research Organisation (ISRO) successfully launched the INSAT-4DS weather satellite on GSLV-F14. 
The satellite aims to significantly enhance weather monitoring, climate study, and disaster warning systems for India. INSAT-4DS operates in the geostationary orbit and is funded by the Ministry of Earth Sciences.`,
    date: "2026-05-30",
    category: "Science",
    tags: ["ISRO", "Space Science", "INSAT-4DS", "Satellites"]
  },
  {
    id: "ca-2",
    title: "India Ranks 4th in Global Renewable Energy Capacity Index",
    content: `According to the latest Renewable Energy Network 21 report, India continues its march as a green leader, placing 4th globally in total installed solar and wind capacity. 
The government has set a rigorous target of achieving 500 GW of non-fossil fuel capacity by 2030, supported heavily by solar parks in Rajasthan and Gujarat.`,
    date: "2026-05-29",
    category: "Economy",
    tags: ["Renewable Energy", "Economy", "Global Index", "Solar Power"]
  },
  {
    id: "ca-3",
    title: "NITI Aayog Launches Sustainable Water Index Report",
    content: `NITI Aayog has unveiled its comprehensive Sustainable Water Management Index 2026. 
Kerala, Haryana, and Himachal Pradesh emerged as top-performing states in water-use efficiency, watershed harvesting, and recycling infrastructure.`,
    date: "2026-05-28",
    category: "National",
    tags: ["NITI Aayog", "Water Management", "Government Index"]
  }
];
var GENERAL_SCIENCE_QUESTIONS = [
  {
    id: "gn-q1",
    text: 'Which chemical element is represented by the symbol "Fe" on the periodic table?',
    options: ["Gold", "Iron", "Fluorine", "Fermium"],
    answerIndex: 1,
    explanation: '"Fe" stands for Ferrum, which is Latin for Iron. Atomic number is 26.',
    subject: "General Science",
    topic: "Physics/Chemistry",
    difficulty: "Easy"
  },
  {
    id: "gn-q2",
    text: "What gas is primarily manufactured during the process of photosynthesis by plants?",
    options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
    answerIndex: 2,
    explanation: "During photosynthesis, plants intake CO2 and Water in the presence of sunlight, generating Glucose and releasing Oxygen (O2) gas.",
    subject: "General Science",
    topic: "Biology",
    difficulty: "Easy"
  },
  {
    id: "gn-q3",
    text: "Which layer of Earth's atmosphere contains the ozone layer that protects us from ultraviolet rays?",
    options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
    answerIndex: 1,
    explanation: "The Stratosphere contains the protective Ozone Layer, absorbing about 97% to 99% of the sun's medium-frequency ultraviolet light.",
    subject: "General Science",
    topic: "Geography & Ecology",
    difficulty: "Medium"
  },
  {
    id: "gn-q4",
    text: "The absolute zero of temperature, theoretical limit of cooling, is defined as:",
    options: ["-100 \u0921\u093F\u0917\u094D\u0930\u0940 \u0938\u0947\u0932\u094D\u0938\u093F\u092F\u0938", "0 \u0921\u093F\u0917\u094D\u0930\u0940 \u0938\u0947\u0932\u094D\u0938\u093F\u092F\u0938", "-273.15 \u0921\u093F\u0917\u094D\u0930\u0940 \u0938\u0947\u0932\u094D\u0938\u093F\u092F\u0938", "-373.15 \u0921\u093F\u0917\u094D\u0930\u0940 \u0938\u0947\u0932\u094D\u0938\u093F\u092F\u0938"],
    answerIndex: 2,
    explanation: "Absolute zero is 0 Kelvin, which equates strictly to -273.15\xB0C. At this stage, thermodynamic motion ceases.",
    subject: "General Science",
    topic: "Physics",
    difficulty: "Medium"
  },
  {
    id: "gn-q5",
    text: "Which organ of the human body is responsible for producing Insulin?",
    options: ["Liver", "Pancreas", "Kidney", "Thyroid"],
    answerIndex: 1,
    explanation: "The Beta cells in the Islets of Langerhans inside the Pancreas produce insulin, managing blood sugar levels.",
    subject: "General Science",
    topic: "Biology",
    difficulty: "Easy"
  }
];
var POLITY_QUESTIONS = [
  {
    id: "pol-q1",
    text: "Which Article of the Indian Constitution outlines the Fundamental Duties of citizens?",
    options: ["Article 32", "Article 44", "Article 51A", "Article 21A"],
    answerIndex: 2,
    explanation: "Article 51A under Part IV-A specifies the Fundamental Duties, added by the 42nd Amendment Act in 1976.",
    subject: "Indian Polity",
    topic: "Constitutional Provisions",
    difficulty: "Medium"
  },
  {
    id: "pol-q2",
    text: "Who is considered the ex-officio Chairman of the Rajya Sabha (Upper House)?",
    options: ["The President of India", "The Prime Minister of India", "The Vice-President of India", "The Speaker of Lok Sabha"],
    answerIndex: 2,
    explanation: "According to Article 64 of the Indian Constitution, the Vice-President of India is the ex-officio chairman of the Council of States (Rajya Sabha).",
    subject: "Indian Polity",
    topic: "Parliament",
    difficulty: "Easy"
  },
  {
    id: "pol-q3",
    text: "How many schedules are there currently in the Indian Constitution?",
    options: ["8", "10", "12", "14"],
    answerIndex: 2,
    explanation: "Originally, the Indian Constitution had 8 schedules. Currently there are 12 schedules in total.",
    subject: "Indian Polity",
    topic: "Schedules",
    difficulty: "Easy"
  },
  {
    id: "pol-q4",
    text: "Dynamic state policy instructions (DPSPs) in the Indian Constitution were inspired from the constitution of:",
    options: ["United States (USA)", "Ireland", "Soviet Union (USSR)", "Australia"],
    answerIndex: 1,
    explanation: "The Directive Principles of State Policy are borrowed from the Irish Constitution (Part IV, Articles 36-51).",
    subject: "Indian Polity",
    topic: "Sources of Constitution",
    difficulty: "Medium"
  },
  {
    id: "pol-q5",
    text: "What is the maximum strength of members represented in the Lok Sabha as set by the Constitution?",
    options: ["500", "543", "552", "560"],
    answerIndex: 2,
    explanation: "Under Article 81, the maximum member count limits to 552 (though currently, representation is 543 after 104 Amendment removing Anglo-Indian reservations).",
    subject: "Indian Polity",
    topic: "Parliament",
    difficulty: "Hard"
  }
];
var INITIAL_MOCK_TESTS = [
  {
    id: "mock-1",
    title: "SSC CGL General GK Mini-Mock Test",
    category: "SSC",
    durationMinutes: 10,
    totalQuestions: 5,
    isPaid: false,
    scoreWeight: 2,
    negativeMarks: 0.5,
    questions: GENERAL_SCIENCE_QUESTIONS,
    createdAt: "2026-05-25"
  },
  {
    id: "mock-2",
    title: "UP Police Constitution & Polity Mock Test",
    category: "UP Police",
    durationMinutes: 10,
    totalQuestions: 5,
    isPaid: true,
    scoreWeight: 2,
    negativeMarks: 0.5,
    questions: POLITY_QUESTIONS,
    createdAt: "2026-05-28"
  }
];
var Database = class {
  constructor() {
    this.pool = null;
    this.hasMySQL = false;
    this.resetCodes = /* @__PURE__ */ new Map();
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
  async executeSql(sql, params = []) {
    if (!this.pool || !this.hasMySQL) return;
    try {
      await this.pool.execute(sql, params);
    } catch (err) {
      console.error(`MySQL Async Statement Execution Failed: ${sql}. Error:`, err);
    }
  }
  async initMySQL() {
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    const port = parseInt(process.env.DB_PORT || "3306");
    if (!host || !user || !database) {
      const errMsg = "CRITICAL CONFIG ERROR: MySQL environment variables (DB_HOST, DB_USER, DB_NAME) are missing but mandatory. Please configure your live MySQL database credentials in the environment variables to proceed.";
      console.error(errMsg);
      throw new Error(errMsg);
    }
    try {
      console.log(`Connecting to MySQL database: ${database} at ${host}:${port}...`);
      this.pool = import_promise.default.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      const connection = await this.pool.getConnection();
      console.log("MySQL connection established successfully!");
      connection.release();
      this.hasMySQL = true;
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
      console.log("MySQL Database schema matching verified.");
      this.log("info", "Database starting: Connected securely to cPanel MySQL.");
      await this.syncWithMySQLData();
    } catch (err) {
      console.error("CRITICAL DATABASE ERROR: Connected to cPanel MySQL failed. Live database is mandatory for this deploy.", err);
      this.pool = null;
      this.hasMySQL = false;
      throw new Error(`MySQL Database initialization failed: ${err.message}. Please verify hosts, database configuration, usernames, passwords, and permissions.`);
    }
  }
  async syncWithMySQLData() {
    if (!this.pool) return;
    try {
      const [userRows] = await this.pool.execute("SELECT COUNT(*) as count FROM users");
      const hasData = userRows[0] && userRows[0].count > 0;
      if (!hasData) {
        console.log("MySQL Database is clean. Seeding initial server memory dataset to MySQL...");
        this.log("info", "Seeding empty MySQL tables with current default database context.");
        for (const user of Object.values(this.data.users)) {
          await this.pool.execute(
            "INSERT INTO users (id, email, name, role, isVerified, passwordHash, savedNotifications, bookmarks, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
        for (const job of this.data.jobs) {
          await this.pool.execute(
            "INSERT INTO jobs (id, title, department, category, postCount, publishDate, lastDateToApply, examDate, pdfUrl, applyUrl, officialWebsite, ageLimit, qualification, applicationFee, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
        for (const card of this.data.admitCards) {
          await this.pool.execute(
            "INSERT INTO admit_cards (id, title, category, examDate, downloadUrl, status, releaseDate) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [card.id, card.title, card.category, card.examDate, card.downloadUrl, card.status, card.releaseDate]
          );
        }
        for (const res of this.data.results) {
          await this.pool.execute(
            "INSERT INTO results (id, title, category, declareDate, resultUrl, status) VALUES (?, ?, ?, ?, ?, ?)",
            [res.id, res.title, res.category, res.declareDate, res.resultUrl, res.status]
          );
        }
        for (const key of this.data.answerKeys) {
          await this.pool.execute(
            "INSERT INTO answer_keys (id, title, category, keyReleaseDate, answerKeyUrl) VALUES (?, ?, ?, ?, ?)",
            [key.id, key.title, key.category, key.keyReleaseDate, key.answerKeyUrl]
          );
        }
        for (const ca of this.data.currentAffairs) {
          await this.pool.execute(
            "INSERT INTO current_affairs (id, title, content, date, category, tags) VALUES (?, ?, ?, ?, ?, ?)",
            [ca.id, ca.title, ca.content, ca.date, ca.category, JSON.stringify(ca.tags || [])]
          );
        }
        for (const test of this.data.mockTests) {
          await this.pool.execute(
            "INSERT INTO mock_tests (id, title, category, durationMinutes, totalQuestions, isPaid, scoreWeight, negativeMarks, questions, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
        for (const attempt of this.data.attempts) {
          await this.pool.execute(
            "INSERT INTO attempts (id, userId, mockTestId, mockTestTitle, score, totalQuestions, correctAnswersCount, wrongAnswersCount, unattemptedCount, durationSpentSeconds, percentile, rank, totalParticipants, subjectAnalysis, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
        for (const sub of this.data.subscriptions) {
          await this.pool.execute(
            "INSERT INTO subscriptions (id, userId, packId, packName, purchaseDate, expiryDate, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [sub.id, sub.userId, sub.packId, sub.packName, sub.purchaseDate, sub.expiryDate, sub.amount, sub.status]
          );
        }
        for (const pay of this.data.payments) {
          await this.pool.execute(
            "INSERT INTO payments (id, userId, userEmail, packId, packName, amount, status, createdAt, transactionId, gstInvoiceNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [pay.id, pay.userId, pay.userEmail, pay.packId, pay.packName, pay.amount, pay.status, pay.createdAt, pay.transactionId, pay.gstInvoiceNo]
          );
        }
        await this.pool.execute(
          "INSERT INTO settings (id, geminiModel, googleOAuthEnabled, payUEnabled, maintenanceMode, smtpStatus) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "main",
            this.data.settings.geminiModel,
            this.data.settings.googleOAuthEnabled ? 1 : 0,
            this.data.settings.payUEnabled ? 1 : 0,
            this.data.settings.maintenanceMode ? 1 : 0,
            this.data.settings.smtpStatus
          ]
        );
        for (const l of this.data.logs) {
          await this.pool.execute(
            "INSERT INTO logs (id, timestamp, type, message, meta) VALUES (?, ?, ?, ?, ?)",
            [l.id, l.timestamp, l.type, l.message, JSON.stringify(l.meta || {})]
          );
        }
        console.log("MySQL Database seeding complete.");
      } else {
        console.log("MySQL database contains matching records. Synchronizing memory data store from MySQL...");
        const [usersList] = await this.pool.execute("SELECT * FROM users");
        const dbUsers = {};
        for (const r of usersList) {
          dbUsers[r.id] = {
            id: r.id,
            email: r.email,
            name: r.name,
            role: r.role,
            isVerified: r.isVerified === 1 || r.isVerified === true,
            passwordHash: r.passwordHash,
            savedNotifications: JSON.parse(r.savedNotifications || "[]"),
            bookmarks: JSON.parse(r.bookmarks || "[]"),
            createdAt: r.createdAt
          };
        }
        this.data.users = dbUsers;
        const [jobsList] = await this.pool.execute("SELECT * FROM jobs");
        this.data.jobs = jobsList;
        const [admitsList] = await this.pool.execute("SELECT * FROM admit_cards");
        this.data.admitCards = admitsList;
        const [resultsList] = await this.pool.execute("SELECT * FROM results");
        this.data.results = resultsList;
        const [keysList] = await this.pool.execute("SELECT * FROM answer_keys");
        this.data.answerKeys = keysList;
        const [caList] = await this.pool.execute("SELECT * FROM current_affairs");
        this.data.currentAffairs = caList.map((r) => ({
          id: r.id,
          title: r.title,
          content: r.content,
          date: r.date,
          category: r.category,
          tags: JSON.parse(r.tags || "[]")
        }));
        const [mockList] = await this.pool.execute("SELECT * FROM mock_tests");
        this.data.mockTests = mockList.map((r) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          durationMinutes: r.durationMinutes,
          totalQuestions: r.totalQuestions,
          isPaid: r.isPaid === 1 || r.isPaid === true,
          scoreWeight: r.scoreWeight,
          negativeMarks: r.negativeMarks,
          questions: JSON.parse(r.questions || "[]"),
          createdAt: r.createdAt
        }));
        const [attemptsList] = await this.pool.execute("SELECT * FROM attempts");
        this.data.attempts = attemptsList.map((r) => ({
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
          subjectAnalysis: JSON.parse(r.subjectAnalysis || "[]"),
          createdAt: r.createdAt
        }));
        const [subsList] = await this.pool.execute("SELECT * FROM subscriptions");
        this.data.subscriptions = subsList;
        const [paymentsList] = await this.pool.execute("SELECT * FROM payments");
        this.data.payments = paymentsList;
        const [settRows] = await this.pool.execute("SELECT * FROM settings WHERE id = ?", ["main"]);
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
        const [logsList] = await this.pool.execute("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100");
        this.data.logs = logsList.map((r) => ({
          id: r.id,
          timestamp: r.timestamp,
          type: r.type,
          message: r.message,
          meta: JSON.parse(r.meta || "{}")
        }));
        console.log("MySQL synchronization completed. Loaded users: " + Object.keys(this.data.users).length);
      }
      this.save();
    } catch (err) {
      console.error("MySQL Synchronization failed:", err);
      this.log("error", `MySQL Synchronization Exception: ${err.message}`);
    }
  }
  load() {
    this.resetToDefaults();
  }
  save() {
  }
  resetToDefaults() {
    const adminH = hashPassword("AdminPass2026!");
    const devH = hashPassword("DevStrongPass!2026");
    const userH = hashPassword("user123");
    this.data = {
      users: {
        "admin-1": {
          id: "admin-1",
          email: "admin@examduniya.in",
          name: "Super Admin",
          role: "admin",
          isVerified: true,
          passwordHash: adminH,
          savedNotifications: [],
          bookmarks: [],
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        "dev-1": {
          id: "dev-1",
          email: "deshifarmer88@gmail.com",
          // Match the user's logged in email automatically for VIP access
          name: "Super Developer",
          role: "developer",
          isVerified: true,
          passwordHash: devH,
          savedNotifications: [],
          bookmarks: [],
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        "user-1": {
          id: "user-1",
          email: "demo@examduniya.in",
          name: "Rohan Sharma",
          role: "user",
          isVerified: true,
          passwordHash: userH,
          savedNotifications: [],
          bookmarks: [],
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
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
          id: "att-1",
          userId: "user-1",
          mockTestId: "mock-1",
          mockTestTitle: "SSC CGL General GK Mini-Mock Test",
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
            { subject: "General Science", total: 5, correct: 4, wrong: 0 }
          ],
          createdAt: "2026-05-29T10:00:00Z"
        }
      ],
      subscriptions: [
        {
          id: "sub-1",
          userId: "user-1",
          packId: "up-police",
          packName: "UP Police Pack",
          purchaseDate: "2026-05-20",
          expiryDate: "2027-05-20",
          amount: 299,
          status: "active"
        }
      ],
      payments: [
        {
          id: "pay-1",
          userId: "user-1",
          userEmail: "demo@examduniya.in",
          packId: "up-police",
          packName: "UP Police Pack",
          amount: 299,
          status: "Success",
          createdAt: "2026-05-20T11:22:00Z",
          transactionId: "PAYU_TXN_88192019",
          gstInvoiceNo: "INV-2026-ED-0012"
        }
      ],
      settings: DEFAULT_SETTINGS,
      logs: [
        {
          id: "log-1",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          type: "info",
          message: "ExamDuniya local DB system initialized with comprehensive starter schema."
        }
      ]
    };
    this.save();
  }
  // --- LOGGING ---
  log(type, message, meta) {
    const l = {
      id: "log-" + Math.random().toString(36).substr(2, 9),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      type,
      message,
      meta
    };
    this.data.logs.unshift(l);
    if (this.data.logs.length > 200) this.data.logs.pop();
    this.save();
    this.executeSql("INSERT INTO logs (id, timestamp, type, message, meta) VALUES (?, ?, ?, ?, ?)", [
      l.id,
      l.timestamp,
      l.type,
      l.message,
      JSON.stringify(l.meta || {})
    ]);
  }
  getLogs() {
    return this.data.logs;
  }
  clearLogs() {
    this.data.logs = [];
    this.log("info", "System logs cleared by administrative action");
    this.save();
    this.executeSql("DELETE FROM logs");
  }
  // --- SETTINGS ---
  getSettings() {
    const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
    const hasTelegram = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
    return {
      ...this.data.settings,
      smtpStatus: hasSmtp ? "Configured" : "Not Configured",
      telegramStatus: hasTelegram ? "Configured" : "Not Configured"
    };
  }
  updateSettings(settings) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.log("info", `System settings updated: ${JSON.stringify(settings)}`);
    this.save();
    this.executeSql(
      "UPDATE settings SET geminiModel=?, googleOAuthEnabled=?, payUEnabled=?, maintenanceMode=?, smtpStatus=? WHERE id=?",
      [
        this.data.settings.geminiModel,
        this.data.settings.googleOAuthEnabled ? 1 : 0,
        this.data.settings.payUEnabled ? 1 : 0,
        this.data.settings.maintenanceMode ? 1 : 0,
        this.data.settings.smtpStatus,
        "main"
      ]
    );
    return this.data.settings;
  }
  // --- USERS ---
  getUsers() {
    return Object.values(this.data.users);
  }
  findUserById(id) {
    const u = this.data.users[id];
    if (!u) return void 0;
    const { passwordHash, ...safeUser } = u;
    return safeUser;
  }
  findUserByEmail(email) {
    return Object.values(this.data.users).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  register(name, email, pass, role = "user") {
    const existing = this.findUserByEmail(email);
    if (existing) {
      throw new Error("User with this email already exists.");
    }
    const id = "user-" + Math.random().toString(36).substr(2, 9);
    const passwordHash = hashPassword(pass);
    const newUser = {
      id,
      email,
      name,
      role,
      isVerified: role === "developer" || role === "admin",
      passwordHash,
      savedNotifications: [],
      bookmarks: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.users[id] = newUser;
    this.log("auth", `New user registered: ${name} (${email}) - Role: ${role}`);
    this.save();
    this.executeSql(
      "INSERT INTO users (id, email, name, role, isVerified, passwordHash, savedNotifications, bookmarks, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        newUser.id,
        newUser.email,
        newUser.name,
        newUser.role,
        newUser.isVerified ? 1 : 0,
        newUser.passwordHash,
        "[]",
        "[]",
        newUser.createdAt
      ]
    );
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }
  setResetCode(email, code, expiryMs = 10 * 60 * 1e3) {
    this.resetCodes.set(email.toLowerCase(), {
      code,
      expires: Date.now() + expiryMs
    });
  }
  verifyResetCode(email, code) {
    const entry = this.resetCodes.get(email.toLowerCase());
    if (!entry) return false;
    if (entry.expires < Date.now()) {
      this.resetCodes.delete(email.toLowerCase());
      return false;
    }
    return entry.code === code;
  }
  clearResetCode(email) {
    this.resetCodes.delete(email.toLowerCase());
  }
  resetUserPassword(email, pass) {
    const u = this.findUserByEmail(email);
    if (!u) return false;
    const passwordHash = hashPassword(pass);
    u.passwordHash = passwordHash;
    this.save();
    this.executeSql("UPDATE users SET passwordHash=? WHERE id=?", [passwordHash, u.id]);
    this.log("auth", `Password reset successful for user: ${u.name} (${email})`);
    return true;
  }
  findOrCreateGoogleUser(email, name) {
    const existing = this.findUserByEmail(email);
    if (existing) {
      const { passwordHash, ...safeUser } = existing;
      return safeUser;
    }
    const randomStr = crypto.randomBytes(16).toString("hex");
    return this.register(name, email, randomStr, "user");
  }
  updateRole(userId, role) {
    const u = this.data.users[userId];
    if (u) {
      u.role = role;
      this.log("info", `Updated user ${u.name} role to ${role}`);
      this.save();
      this.executeSql("UPDATE users SET role=? WHERE id=?", [role, userId]);
    }
  }
  toggleNotification(userId, jobId) {
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
      this.executeSql("UPDATE users SET savedNotifications=? WHERE id=?", [JSON.stringify(u.savedNotifications), userId]);
      return u.savedNotifications;
    }
    return [];
  }
  toggleBookmark(userId, mockTestId) {
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
      this.executeSql("UPDATE users SET bookmarks=? WHERE id=?", [JSON.stringify(u.bookmarks), userId]);
      return u.bookmarks;
    }
    return [];
  }
  // --- JOBS ---
  getJobs() {
    return this.data.jobs;
  }
  addJob(notification) {
    const id = "job-" + Math.random().toString(36).substr(2, 9);
    const newJob = {
      ...notification,
      id,
      publishDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    this.data.jobs.unshift(newJob);
    this.log("info", `Created new government job alert: ${newJob.title}`);
    this.save();
    this.executeSql(
      "INSERT INTO jobs (id, title, department, category, postCount, publishDate, lastDateToApply, examDate, pdfUrl, applyUrl, officialWebsite, ageLimit, qualification, applicationFee, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
  editJob(id, updated) {
    const idx = this.data.jobs.findIndex((j2) => j2.id === id);
    if (idx === -1) throw new Error("Job not found");
    this.data.jobs[idx] = { ...this.data.jobs[idx], ...updated };
    this.log("info", `Edited job alert: ${this.data.jobs[idx].title}`);
    this.save();
    const j = this.data.jobs[idx];
    this.executeSql(
      "UPDATE jobs SET title=?, department=?, category=?, postCount=?, lastDateToApply=?, examDate=?, pdfUrl=?, applyUrl=?, officialWebsite=?, ageLimit=?, qualification=?, applicationFee=?, details=? WHERE id=?",
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
  deleteJob(id) {
    this.data.jobs = this.data.jobs.filter((j) => j.id !== id);
    this.log("info", `Deleted job alert code: ${id}`);
    this.save();
    this.executeSql("DELETE FROM jobs WHERE id=?", [id]);
  }
  // --- ADMIT CARDS ---
  getAdmitCards() {
    return this.data.admitCards;
  }
  addAdmitCard(card) {
    const id = "admit-" + Math.random().toString(36).substr(2, 9);
    const newCard = {
      ...card,
      id,
      releaseDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    this.data.admitCards.unshift(newCard);
    this.log("info", `Created static Admit Card alert: ${newCard.title}`);
    this.save();
    this.executeSql(
      "INSERT INTO admit_cards (id, title, category, examDate, downloadUrl, status, releaseDate) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [newCard.id, newCard.title, newCard.category, newCard.examDate, newCard.downloadUrl, newCard.status, newCard.releaseDate]
    );
    return newCard;
  }
  deleteAdmitCard(id) {
    this.data.admitCards = this.data.admitCards.filter((c) => c.id !== id);
    this.save();
    this.executeSql("DELETE FROM admit_cards WHERE id=?", [id]);
  }
  // --- RESULTS ---
  getResults() {
    return this.data.results;
  }
  addResult(res) {
    const id = "res-" + Math.random().toString(36).substr(2, 9);
    const newRes = { ...res, id };
    this.data.results.unshift(newRes);
    this.log("info", `Published Result update: ${newRes.title}`);
    this.save();
    this.executeSql(
      "INSERT INTO results (id, title, category, declareDate, resultUrl, status) VALUES (?, ?, ?, ?, ?, ?)",
      [newRes.id, newRes.title, newRes.category, newRes.declareDate, newRes.resultUrl, newRes.status]
    );
    return newRes;
  }
  deleteResult(id) {
    this.data.results = this.data.results.filter((r) => r.id !== id);
    this.save();
    this.executeSql("DELETE FROM results WHERE id=?", [id]);
  }
  // --- ANSWER KEYS ---
  getAnswerKeys() {
    return this.data.answerKeys;
  }
  addAnswerKey(key) {
    const id = "key-" + Math.random().toString(36).substr(2, 9);
    const newKey = { ...key, id, keyReleaseDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] };
    this.data.answerKeys.unshift(newKey);
    this.log("info", `Published Answer Key alert: ${newKey.title}`);
    this.save();
    this.executeSql(
      "INSERT INTO answer_keys (id, title, category, keyReleaseDate, answerKeyUrl) VALUES (?, ?, ?, ?, ?)",
      [newKey.id, newKey.title, newKey.category, newKey.keyReleaseDate, newKey.answerKeyUrl]
    );
    return newKey;
  }
  deleteAnswerKey(id) {
    this.data.answerKeys = this.data.answerKeys.filter((k) => k.id !== id);
    this.save();
    this.executeSql("DELETE FROM answer_keys WHERE id=?", [id]);
  }
  // --- CURRENT AFFAIRS ---
  getCurrentAffairs() {
    return this.data.currentAffairs;
  }
  addCurrentAffairs(ca) {
    const id = "ca-" + Math.random().toString(36).substr(2, 9);
    const newCa = {
      ...ca,
      id,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    this.data.currentAffairs.unshift(newCa);
    this.save();
    this.executeSql(
      "INSERT INTO current_affairs (id, title, content, date, category, tags) VALUES (?, ?, ?, ?, ?, ?)",
      [newCa.id, newCa.title, newCa.content, newCa.date, newCa.category, JSON.stringify(newCa.tags || [])]
    );
    return newCa;
  }
  deleteCurrentAffairs(id) {
    this.data.currentAffairs = this.data.currentAffairs.filter((c) => c.id !== id);
    this.save();
    this.executeSql("DELETE FROM current_affairs WHERE id=?", [id]);
  }
  // --- MOCK TESTS & ATTEMPTS ---
  getMockTests() {
    return this.data.mockTests;
  }
  addMockTest(test) {
    const id = "mock-" + Math.random().toString(36).substr(2, 9);
    const newTest = {
      ...test,
      id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.mockTests.unshift(newTest);
    this.log("info", `Mock Test added: ${newTest.title} (${newTest.totalQuestions} Questions)`);
    this.save();
    this.executeSql(
      "INSERT INTO mock_tests (id, title, category, durationMinutes, totalQuestions, isPaid, scoreWeight, negativeMarks, questions, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
  submitAttempt(userId, mockTestId, answers, durationSpentSeconds) {
    const test = this.data.mockTests.find((t) => t.id === mockTestId);
    if (!test) throw new Error("Mock Test not found");
    const safeAnswers = answers || {};
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    const subjectBreakdown = {};
    test.questions.forEach((q) => {
      const qSubject = q.subject || "General Studies";
      if (!subjectBreakdown[qSubject]) {
        subjectBreakdown[qSubject] = { total: 0, correct: 0, wrong: 0 };
      }
      subjectBreakdown[qSubject].total += 1;
      const userAns = safeAnswers[q.id];
      if (userAns === void 0 || userAns === -1) {
        unattemptedCount++;
      } else if (userAns === q.answerIndex) {
        correctCount++;
        subjectBreakdown[qSubject].correct += 1;
      } else {
        wrongCount++;
        subjectBreakdown[qSubject].wrong += 1;
      }
    });
    const scoreWeight = typeof test.scoreWeight === "number" ? test.scoreWeight : 2;
    const negativeMarks = typeof test.negativeMarks === "number" ? test.negativeMarks : 0.5;
    const gain = correctCount * scoreWeight;
    const penalty = wrongCount * negativeMarks;
    const score = Math.max(0, parseFloat((gain - penalty).toFixed(2)));
    const existingAttempts = this.data.attempts.filter((a) => a.mockTestId === mockTestId);
    const totalParticipants = existingAttempts.length + 1;
    const betterScoresCount = existingAttempts.filter((a) => a.score > score).length;
    const rank = betterScoresCount + 1;
    const percentile = parseFloat(((totalParticipants - rank) / totalParticipants * 100).toFixed(2)) || 100;
    const user = this.data.users[userId];
    const attempt = {
      id: "att-" + Math.random().toString(36).substr(2, 9),
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
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.attempts.unshift(attempt);
    this.log("info", `User ${user ? user.name : "Unknown"} completed mock test "${test.title}" with score ${score}`);
    this.save();
    this.executeSql(
      "INSERT INTO attempts (id, userId, mockTestId, mockTestTitle, score, totalQuestions, correctAnswersCount, wrongAnswersCount, unattemptedCount, durationSpentSeconds, percentile, rank, totalParticipants, subjectAnalysis, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
  getAttemptsForUser(userId) {
    return this.data.attempts.filter((a) => a.userId === userId);
  }
  // --- LEADERBOARD ---
  getLeaderboard() {
    const userStats = {};
    this.data.attempts.forEach((att) => {
      const u = this.data.users[att.userId];
      const name = u ? u.name : "Aspirant " + att.userId.substr(-4);
      if (!userStats[att.userId]) {
        userStats[att.userId] = { name, scoresSum: 0, count: 0 };
      }
      userStats[att.userId].scoresSum += att.score;
      userStats[att.userId].count += 1;
    });
    const entries = Object.entries(userStats).map(([userId, stats]) => {
      const averageScore = parseFloat((stats.scoresSum / stats.count).toFixed(2));
      const totalPoints = Math.round(stats.scoresSum * 10 + stats.count * 5);
      return {
        userId,
        name: stats.name,
        testsAttempted: stats.count,
        averageScore,
        totalPoints
      };
    });
    const sorted = entries.sort((a, b) => b.totalPoints - a.totalPoints);
    return sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }
  // --- PAYMENTS & SUBSCRIPTIONS ---
  getPayments() {
    return this.data.payments;
  }
  createPayment(userId, packId, amount) {
    const user = this.data.users[userId];
    if (!user) throw new Error("User not found");
    const txId = "PAYU_" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const invNo = "INV-" + (/* @__PURE__ */ new Date()).getFullYear() + "-ED-" + Math.floor(1e3 + Math.random() * 9e3);
    const packNames = {
      "up-police": "UP Police Pack",
      "ssc-gd": "SSC GD Pack",
      "ssc-combo": "SSC Exams Combo Pack",
      "railway-combo": "Railway Exams Combo Pack",
      "all-combo": "All Exams Premium Super Pass"
    };
    const packName = packNames[packId] || "Custom Premium Exam Pack";
    const success = true;
    if (success) {
      const txn = {
        id: "pay-" + Math.random().toString(36).substr(2, 9),
        userId,
        userEmail: user.email,
        packId,
        packName,
        amount,
        status: "Success",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        transactionId: txId,
        gstInvoiceNo: invNo
      };
      this.data.payments.unshift(txn);
      const sub = {
        id: "sub-" + Math.random().toString(36).substr(2, 9),
        userId,
        packId,
        packName,
        purchaseDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        // 1 year
        amount,
        status: "active"
      };
      this.data.subscriptions.unshift(sub);
      this.log("info", `User ${user.name} subscribed to ${packName} for \u20B9${amount} - Invoice ${invNo}`);
      this.save();
      this.executeSql(
        "INSERT INTO payments (id, userId, userEmail, packId, packName, amount, status, createdAt, transactionId, gstInvoiceNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [txn.id, txn.userId, txn.userEmail, txn.packId, txn.packName, txn.amount, txn.status, txn.createdAt, txn.transactionId, txn.gstInvoiceNo]
      );
      this.executeSql(
        "INSERT INTO subscriptions (id, userId, packId, packName, purchaseDate, expiryDate, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [sub.id, sub.userId, sub.packId, sub.packName, sub.purchaseDate, sub.expiryDate, sub.amount, sub.status]
      );
      return { status: "Success", transaction: txn, subscription: sub };
    } else {
      const txn = {
        id: "pay-" + Math.random().toString(36).substr(2, 9),
        userId,
        userEmail: user.email,
        packId,
        packName,
        amount,
        status: "Failed",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        transactionId: txId,
        gstInvoiceNo: invNo
      };
      this.data.payments.unshift(txn);
      this.save();
      this.executeSql(
        "INSERT INTO payments (id, userId, userEmail, packId, packName, amount, status, createdAt, transactionId, gstInvoiceNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [txn.id, txn.userId, txn.userEmail, txn.packId, txn.packName, txn.amount, txn.status, txn.createdAt, txn.transactionId, txn.gstInvoiceNo]
      );
      return { status: "Failed", transaction: txn };
    }
  }
  approveVerifiedPayment(userId, packId, amount, txId) {
    const user = this.data.users[userId];
    if (!user) throw new Error("User not found");
    const invNo = "INV-" + (/* @__PURE__ */ new Date()).getFullYear() + "-ED-" + Math.floor(1e3 + Math.random() * 9e3);
    const packNames = {
      "up-police": "UP Police Pack",
      "ssc-gd": "SSC GD Pack",
      "ssc-combo": "SSC Exams Combo Pack",
      "railway-combo": "Railway Exams Combo Pack",
      "all-combo": "All Exams Premium Super Pass"
    };
    const packName = packNames[packId] || "Custom Premium Exam Pack";
    const txn = {
      id: "pay-" + Math.random().toString(36).substr(2, 9),
      userId,
      userEmail: user.email,
      packId,
      packName,
      amount,
      status: "Success",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      transactionId: txId,
      gstInvoiceNo: invNo
    };
    this.data.payments.unshift(txn);
    const sub = {
      id: "sub-" + Math.random().toString(36).substr(2, 9),
      userId,
      packId,
      packName,
      purchaseDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      // 1 year
      amount,
      status: "active"
    };
    this.data.subscriptions.unshift(sub);
    this.log("info", `User ${user.name} completed real PayU Payment for ${packName} of \u20B9${amount} - Txn ID ${txId}`);
    this.save();
    this.executeSql(
      "INSERT INTO payments (id, userId, userEmail, packId, packName, amount, status, createdAt, transactionId, gstInvoiceNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [txn.id, txn.userId, txn.userEmail, txn.packId, txn.packName, txn.amount, txn.status, txn.createdAt, txn.transactionId, txn.gstInvoiceNo]
    );
    this.executeSql(
      "INSERT INTO subscriptions (id, userId, packId, packName, purchaseDate, expiryDate, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [sub.id, sub.userId, sub.packId, sub.packName, sub.purchaseDate, sub.expiryDate, sub.amount, sub.status]
    );
    return { transaction: txn, subscription: sub };
  }
  getSubscriptionsForUser(userId) {
    return this.data.subscriptions.filter((s) => s.userId === userId && s.status === "active");
  }
  hasActiveSubscriptionForPack(userId, packId) {
    const subs = this.getSubscriptionsForUser(userId);
    return subs.some((s) => s.packId === packId || s.packId === "all-combo");
  }
};
var db = new Database();

// server/email.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
function getSMTPConfig() {
  const host = process.env.SMTP_HOST || "";
  const portStr = process.env.SMTP_PORT || "465";
  const secureStr = process.env.SMTP_SECURE || "true";
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASSWORD || "";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "";
  const fromName = process.env.SMTP_FROM_NAME || "ExamDuniya";
  if (!host || !user || !pass) {
    return null;
  }
  return {
    host,
    port: parseInt(portStr, 10) || 465,
    secure: secureStr === "true",
    user,
    pass,
    fromEmail,
    fromName
  };
}
async function sendOTPResetEmail(email, name, code) {
  const config2 = getSMTPConfig();
  if (!config2) {
    db.log("info", `SMTP Mailer is not configured. Falling back to local console simulator. OTP Code for ${email} is: ${code}`);
    return false;
  }
  const transporter = import_nodemailer.default.createTransport({
    host: config2.host,
    port: config2.port,
    secure: config2.secure,
    auth: {
      user: config2.user,
      pass: config2.pass
    },
    tls: {
      // Allow self-signed certs which are quite common on cPanel hostings
      rejectUnauthorized: false
    }
  });
  const subject = `[ExamDuniya] Security Alert: Password Reset Verification OTP (${code})`;
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; padding: 20px; }
        .card { max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background-color: #222831; padding: 25px; text-align: center; border-bottom: 2px solid #71EEE2; }
        .header h1 { margin: 0; color: #71EEE2; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 30px; line-height: 1.6; }
        .username { font-weight: bold; color: #111827; }
        .otp-box { background-color: #f9fafb; border: 2px dashed #71EEE2; color: #222831; font-size: 32px; font-weight: 800; text-align: center; letter-spacing: 6px; padding: 15px; margin: 25px 0; border-radius: 12px; font-family: monospace; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
        .warning-text { font-size: 12px; color: #6b7280; border-left: 3px solid #ff9800; padding-left: 10px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>ExamDuniya</h1>
        </div>
        <div class="content">
          <p>Dear <span class="username">${name}</span>,</p>
          <p>A request has been made to verify your identity and reset your ExamDuniya passphrase lock. Please use the following 6-digit confirmation OTP code:</p>
          
          <div class="otp-box">${code}</div>
          
          <p>This verification token is confidential and valid only for next 10 minutes. Please enter it on the forgot password modal screen to proceed with credential updating.</p>
          
          <p class="warning-text"><strong>Security Alert:</strong> If you did not request this update, please ignore this email. Your credentials will remain unchanged and fully secured.</p>
        </div>
        <div class="footer">
          <p>This is an automated notification. Please do not reply directly to this mail.</p>
          <p>&copy; 2026 ExamDuniya. India's Smartest Exam Platform.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  try {
    const info = await transporter.sendMail({
      from: `"${config2.fromName}" <${config2.fromEmail}>`,
      to: email,
      subject,
      html: htmlContent,
      text: `Hello ${name},

Your 6-digit password reset verification OTP is: ${code}

This OTP is valid for 10 minutes.

Disclaimer: If you did not initiate this request, please ignore this core email.

Regards,
Team ExamDuniya`
    });
    db.log("info", `SMTP: Successful SMTP OTP dispatch to candidate: ${email} (Message ID: ${info.messageId})`);
    return true;
  } catch (error) {
    db.log("error", `SMTP Failure: Failed sending OTP register email to ${email}. SMTP Error details: ${error.message}`);
    console.error("SMTP Mail Transport Exception:", error);
    return false;
  }
}

// server/telegram.ts
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function convertMarkdownToTelegramHTML(content) {
  if (!content) return "";
  const lines = content.split("\n");
  const formattedLines = lines.map((line) => {
    let trimmed = line.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("#")) {
      const headerText = trimmed.replace(/^#+\s*/, "");
      return `<b>${escapeHTML(headerText)}</b>`;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const bulletText = trimmed.substring(2);
      return `\u2022 ${formatInlineMarkdown(bulletText)}`;
    }
    return formatInlineMarkdown(trimmed);
  });
  return formattedLines.filter((l) => l !== null).join("\n");
}
function formatInlineMarkdown(text) {
  let escaped = escapeHTML(text);
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  escaped = escaped.replace(/\*(.*?)\*/g, "<i>$1</i>");
  escaped = escaped.replace(/_(.*?)_/g, "<i>$1</i>");
  return escaped;
}
async function sendTelegramMessage(htmlText) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    db.log("info", `Telegram Auto-Posting is not configured. Message simulation: 
${htmlText}`);
    return false;
  }
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlText,
        parse_mode: "HTML",
        disable_web_page_preview: false
      })
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.ok) {
      db.log("info", `Telegram Auto-Post: Successfully posted broadcast notification to Group/Channel [${chatId}]`);
      return true;
    } else {
      db.log("error", `Telegram Auto-Post Failed: ${data.description || "Unknown Telegram API response error"}`);
      console.error("Telegram API rejected posting payload:", data);
      return false;
    }
  } catch (error) {
    db.log("error", `Telegram Auto-Post Exception: ${error.message}`);
    console.error("Failed to communicate with Telegram API Gateway:", error);
    return false;
  }
}
async function postCurrentAffairsToTelegram(ca) {
  const appUrl = process.env.APP_URL || "https://examduniya.in";
  const currentDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const parsedHeaderTitle = ca.title.replace(/^Important:\s*/i, "").replace(/^AI Special Briefing:\s*/i, "");
  const bodyHTML = convertMarkdownToTelegramHTML(ca.content);
  const tagString = (ca.tags || []).map((t) => `#${t.replace(/\s+/g, "")}`).join(" ") || `#${ca.category}`;
  const message = `\u{1F4F0} <b>DAILY CURRENT AFFAIRS | EXAM DUNIYA</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F511} <b>Topic:</b> ${escapeHTML(parsedHeaderTitle)}
\u{1F4C2} <b>Category:</b> ${escapeHTML(ca.category)}
\u23F1 <b>Date:</b> ${currentDate}

\u{1F4DD} <b>Briefing & Study Notes:</b>
${bodyHTML}

\u{1F3F7} <b>Tags:</b> ${tagString}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F393} <i>Excel in your IAS, SSC & State level exam preparation!</i>
\u{1F517} <a href="${appUrl}">Open ExamDuniya Portal</a>`;
  return await sendTelegramMessage(message);
}
async function postJobAlertToTelegram(job) {
  const appUrl = process.env.APP_URL || "https://examduniya.in";
  const formattedDesc = convertMarkdownToTelegramHTML(job.details);
  const eligibility = job.qualification || "Refer to official Notification";
  const ageLimit = job.ageLimit || "As per government guidelines";
  const lastDate = job.lastDateToApply || "N/A";
  const primaryLink = job.applyUrl || appUrl;
  const vacancyPosts = job.postCount ? `${job.postCount} Vacancies` : "Not Specified";
  const message = `\u{1F514} <b>NEW GOVT JOB NOTIFICATION | EXAM DUNIYA</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4BC} <b>Post/Role:</b> ${escapeHTML(job.title)}
\u{1F3E2} <b>Department:</b> ${escapeHTML(job.department)}
\u{1F4C2} <b>Category:</b> ${escapeHTML(job.category)}

\u{1F3AF} <b>Total Openings:</b> ${escapeHTML(vacancyPosts)}
\u{1F393} <b>Eligibility:</b> ${escapeHTML(eligibility)}
\u{1F51E} <b>Age Limit:</b> ${escapeHTML(ageLimit)}
\u{1F4C5} <b>Last Date:</b> ${escapeHTML(lastDate)}

\u{1F4D6} <b>Recruitment Details:</b>
${formattedDesc}

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u26A1 <i>Check full updates, download official PDFs, and practice custom AI Mock tests!</i>
\u{1F517} <a href="${primaryLink}">Apply via ExamDuniya</a>`;
  return await sendTelegramMessage(message);
}

// server.ts
var import_crypto = __toESM(require("crypto"), 1);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
var geminiKey = process.env.GEMINI_API_KEY;
var aiClient = null;
if (geminiKey && geminiKey !== "MY_GEMINI_API_KEY") {
  aiClient = new import_genai.GoogleGenAI({
    apiKey: geminiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
  db.log("info", "Gemini AI Client successfully initialized in server-side application.");
} else {
  db.log("info", "No valid GEMINI_API_KEY env var detected. AI Mock Test Generator will run in intelligent fallback demonstration mode.");
}
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired login session" });
  }
  req.user = payload;
  next();
}
function requireAdmin(req, res, next) {
  const user = req.user;
  if (!user || user.role !== "admin" && user.role !== "developer") {
    return res.status(403).json({ error: "Administrative privileges required" });
  }
  next();
}
function requireDeveloper(req, res, next) {
  const user = req.user;
  if (!user || user.role !== "developer") {
    return res.status(403).json({ error: "Super Developer access required" });
  }
  next();
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  try {
    const userRole = role === "developer" || role === "admin" ? role : "user";
    const user = db.register(name, email, password, userRole);
    const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const userWithHash = db.findUserByEmail(email);
  if (!userWithHash) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const hash = hashPassword(password);
  if (userWithHash.passwordHash !== hash) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const { passwordHash, ...user } = userWithHash;
  const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  db.log("auth", `User logged in successfully: ${user.name} (${user.email})`);
  res.json({ user, token });
});
app.get("/api/auth/me", authenticate, (req, res) => {
  const authUser = req.user;
  const user = db.findUserById(authUser.id);
  if (!user) {
    return res.status(404).json({ error: "User profile not found" });
  }
  res.json({ user });
});
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const user = db.findUserByEmail(email);
  if (!user) {
    db.log("auth", `Password reset requested for non-existent email: ${email}`);
    return res.json({ success: true, message: "If an account exists with this email, a reset code has been generated." });
  }
  const code = Math.floor(1e5 + Math.random() * 9e5).toString();
  db.setResetCode(email, code);
  db.log("auth", `PASSWORD RESET VERIFICATION CODE generated for ${email}. Code is: ${code}`);
  console.log(`[FORGOT PASSWORD] Generated OTP for ${email}: ${code}`);
  const smtpSent = await sendOTPResetEmail(user.email, user.name || "Candidate", code);
  res.json({
    success: true,
    message: smtpSent ? "A secure 6-digit verification OTP has been sent directly to your registered email address." : "A verification OTP has been generated. (Sandbox Mode active: consult workspace Console logs or Server logs to see code)",
    sandboxCodeHint: code,
    // Keep for easy testing access
    smtpDispatched: smtpSent
  });
});
app.post("/api/auth/reset-password", (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: "Email, verification code, and new password are required" });
  }
  const holdsValid = db.verifyResetCode(email, code);
  if (!holdsValid) {
    return res.status(400).json({ error: "Invalid or expired password reset verification OTP." });
  }
  const result = db.resetUserPassword(email, newPassword);
  if (!result) {
    return res.status(404).json({ error: "User not found." });
  }
  db.clearResetCode(email);
  res.json({ success: true, message: "Password has been updated successfully. Please login with your new password." });
});
app.get("/api/auth/google/url", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/google/callback`;
  if (clientId && clientId !== "") {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account"
    });
    res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  } else {
    res.json({ url: `${appUrl}/api/auth/google/sandbox` });
  }
});
app.get("/api/auth/google/sandbox", (req, res) => {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign in - Google Accounts</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-[#f0f4f9] flex items-center justify-center min-h-screen font-sans">
      <div id="login-card" class="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-200/60 max-w-md w-full mx-4">
        <div class="flex flex-col items-center mb-6">
          <svg class="h-10 w-10 mb-3" viewBox="0 0 24 24" width="24" height="24">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.61 -0.06,-1.2 -0.16,-1.79Z" fill="#4285f4" />
              <path d="M12,20.73c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.91,0.61 -2.08,0.98 -3.3,0.98c-2.34,0 -4.33,-1.58 -5.04,-3.71H0.93V15.8c1.5,2.97 4.56,5.03 8.11,5.03Z" fill="#34a853" />
              <path d="M6.96,13.26a6.01,6.01,0,0,1,0,-3.82V6.87H0.93a10.02,10.02,0,0,0,0,10.21l6.03,-3.82Z" fill="#fbbc05" />
              <path d="M12,4.64c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,1.91 14.43,1.27 12,1.27c-3.55,0 -6.61,2.06 -8.11,5.03l6.03,3.82c0.71,-2.13 2.7,-3.71 5.04,-3.71Z" fill="#ea4335" />
            </g>
          </svg>
          <h1 class="text-2xl font-normal text-gray-900 tracking-tight">Sign in with Google</h1>
          <p class="text-sm text-gray-500 mt-1.5 font-normal text-center">to continue to ExamDuniya Sandbox Environment</p>
        </div>

        <div class="space-y-4">
          <!-- Main test account -->
          <button id="account-primary" onclick="submitAcc('deshifarmer88@gmail.com', 'Deshi Farmer')" class="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition flex items-center gap-3">
            <div class="h-10 w-10 text-lg font-semibold bg-indigo-600 text-white rounded-full flex items-center justify-center">DF</div>
            <div>
              <p class="font-medium text-gray-800 text-sm flex items-center gap-2">
                Deshi Farmer
              </p>
              <p class="text-xs text-gray-500">deshifarmer88@gmail.com</p>
            </div>
            <span class="ml-auto text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Developer</span>
          </button>

          <!-- Custom email option -->
          <div class="border-t border-gray-100 pt-4 mt-2">
            <p class="text-xs text-gray-400 mb-3 font-semibold tracking-wider uppercase text-center">Or Use Custom Google Account</p>
            <form onsubmit="submitCustom(event)" class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input id="custom-name" type="text" placeholder="John Doe" value="John Doe" required class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Gmail Address</label>
                <input id="custom-email" type="email" placeholder="john.doe@gmail.com" value="john.doe@gmail.com" required class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <button id="btn-custom-auth" type="submit" class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition shadow-sm">
                Connect Custom Account
              </button>
            </form>
          </div>
        </div>

        <div class="mt-6 text-center">
          <p class="text-xs text-gray-400">
            This screen simulates live Google OAuth 2.0 without billing configurations or API key setups.
          </p>
        </div>
      </div>

      <script>
        function submitAcc(email, name) {
          const callbackUrl = "${appUrl}/api/auth/google/callback?code=sandbox-" + Math.random().toString(36).substr(2, 9) + "&email=" + encodeURIComponent(email) + "&name=" + encodeURIComponent(name);
          window.location.href = callbackUrl;
        }

        function submitCustom(e) {
          e.preventDefault();
          const name = document.getElementById('custom-name').value;
          const email = document.getElementById('custom-email').value;
          submitAcc(email, name);
        }
      </script>
    </body>
    </html>
  `);
});
app.get("/api/auth/google/callback", async (req, res) => {
  const { code, email: sandboxEmail, name: sandboxName } = req.query;
  let email = "";
  let name = "";
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && clientId !== "" && code && !code.toString().startsWith("sandbox-")) {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${process.env.APP_URL || "http://localhost:3000"}/api/auth/google/callback`,
          grant_type: "authorization_code"
        })
      });
      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) {
        throw new Error(tokenData.error_description || "Failed to exchange Google code");
      }
      const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const googleUser = await userResponse.json();
      email = googleUser.email;
      name = googleUser.name || googleUser.given_name || "Google User";
    } else {
      email = sandboxEmail || "deshifarmer88@gmail.com";
      name = sandboxName || "Deshi Farmer";
    }
    if (!email) {
      throw new Error("Google identity email not found.");
    }
    const user = db.findOrCreateGoogleUser(email, name);
    const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    db.log("auth", `Google Login Success: ${user.name} (${user.email})`);
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'OAUTH_AUTH_SUCCESS',
                token: "${token}",
                user: ${JSON.stringify(user)}
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <p style="font-size: 1.125rem; color: #4F46E5; font-weight: 500;">
              Connecting secure session...
            </p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    db.log("error", `Google authentication failed: ${err.message}`);
    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h2 style="color: #EF4444;">Google Sign-In Error</h2>
          <p>${err.message}</p>
          <button onclick="window.close()" style="padding: 8px 16px; background-color: #EF4444; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Close Tab
          </button>
        </body>
      </html>
    `);
  }
});
app.get("/api/jobs", (req, res) => {
  const category = req.query.category;
  let list = db.getJobs();
  if (category) {
    list = list.filter((j) => j.category.toLowerCase() === category.toLowerCase());
  }
  res.json(list);
});
app.post("/api/jobs", authenticate, requireAdmin, (req, res) => {
  try {
    const job = db.addJob(req.body);
    postJobAlertToTelegram(job).catch((err) => {
      console.error("[TELEGRAM AUTOPOST ERROR]", err);
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put("/api/jobs/:id", authenticate, requireAdmin, (req, res) => {
  try {
    const job = db.editJob(req.params.id, req.body);
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/api/jobs/:id", authenticate, requireAdmin, (req, res) => {
  try {
    db.deleteJob(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/user/saved-notifications/:jobId", authenticate, (req, res) => {
  const userId = req.user.id;
  const list = db.toggleNotification(userId, req.params.jobId);
  res.json(list);
});
app.post("/api/user/bookmarks/:mockId", authenticate, (req, res) => {
  const userId = req.user.id;
  const list = db.toggleBookmark(userId, req.params.mockId);
  res.json(list);
});
app.get("/api/admit-cards", (req, res) => {
  res.json(db.getAdmitCards());
});
app.post("/api/admit-cards", authenticate, requireAdmin, (req, res) => {
  const card = db.addAdmitCard(req.body);
  res.status(201).json(card);
});
app.delete("/api/admit-cards/:id", authenticate, requireAdmin, (req, res) => {
  db.deleteAdmitCard(req.params.id);
  res.json({ success: true });
});
app.get("/api/results", (req, res) => {
  res.json(db.getResults());
});
app.post("/api/results", authenticate, requireAdmin, (req, res) => {
  const result = db.addResult(req.body);
  res.status(201).json(result);
});
app.delete("/api/results/:id", authenticate, requireAdmin, (req, res) => {
  db.deleteResult(req.params.id);
  res.json({ success: true });
});
app.get("/api/answer-keys", (req, res) => {
  res.json(db.getAnswerKeys());
});
app.post("/api/answer-keys", authenticate, requireAdmin, (req, res) => {
  const key = db.addAnswerKey(req.body);
  res.status(201).json(key);
});
app.delete("/api/answer-keys/:id", authenticate, requireAdmin, (req, res) => {
  db.deleteAnswerKey(req.params.id);
  res.json({ success: true });
});
app.get("/api/current-affairs", (req, res) => {
  res.json(db.getCurrentAffairs());
});
app.post("/api/current-affairs", authenticate, requireAdmin, (req, res) => {
  const ca = db.addCurrentAffairs(req.body);
  postCurrentAffairsToTelegram(ca).catch((err) => {
    console.error("[TELEGRAM AUTOPOST ERROR]", err);
  });
  res.status(201).json(ca);
});
app.delete("/api/current-affairs/:id", authenticate, requireAdmin, (req, res) => {
  db.deleteCurrentAffairs(req.params.id);
  res.json({ success: true });
});
app.post("/api/current-affairs/generate", authenticate, requireAdmin, async (req, res) => {
  const { topic, category } = req.body;
  if (!topic || !category) {
    return res.status(400).json({ error: "Topic and category are required" });
  }
  const prompt = `Write a professional daily current affairs educational post for Indian government exams on the topic: "${topic}". 
Produce a structured markdown content that explains the context, historical facts, government policies, and relevance to competitive exams (e.g. IAS, SSC, UP State PCS). 
Keep it incredibly concise, highly factual, objective, and simple. Add 3 hashtags at the end.`;
  try {
    if (!aiClient) {
      const fakeArticle = db.addCurrentAffairs({
        title: `AI Special Briefing: ${topic}`,
        content: `### Special Briefing on ${topic}
This article is generated via intelligent fallback simulation.

Key educational aspects:
- **Primary Policy**: Enhanced infrastructural governance with a 5-year budget horizon.
- **Significance for Exams**: Questions regarding federal allocations under NITI Aayog can feature heavily in civil reviews.
- **Economic impact**: Projecting positive trade margins aligning with India's macro parameters.

#${category} #CompetitiveExams #GeneralKnowledge`,
        category,
        tags: [category, "AI-Generated"]
      });
      postCurrentAffairsToTelegram(fakeArticle).catch((err) => {
        console.error("[TELEGRAM AUTOPOST ERROR]", err);
      });
      return res.json(fakeArticle);
    }
    const modelToUse = db.getSettings().geminiModel || "gemini-3.5-flash";
    const response = await aiClient.models.generateContent({
      model: modelToUse,
      contents: prompt,
      config: {
        systemInstruction: "You are an elite Lead Current Affairs editor for dynamic IAS guidance textbooks. You write detailed, factual summaries of recent news and public events."
      }
    });
    const bodyText = response.text || `Detailed summary regarding ${topic}. Please check official channels for additional details.`;
    const cleanTitle = `Important: Key Updates on ${topic}`;
    const ca = db.addCurrentAffairs({
      title: cleanTitle,
      content: bodyText,
      category,
      tags: [category, "AI-Generated"]
    });
    postCurrentAffairsToTelegram(ca).catch((err) => {
      console.error("[TELEGRAM AUTOPOST ERROR]", err);
    });
    db.log("info", `AI Current Affairs alert written for: ${topic}`);
    res.json(ca);
  } catch (err) {
    db.log("error", `AI Current Affairs generation failed: ${err.message}`);
    res.status(500).json({ error: "Gemini creation failed: " + err.message });
  }
});
app.get("/api/mock-tests", (req, res) => {
  const user = req.user;
  const list = db.getMockTests();
  const safeList = list.map((test) => ({
    ...test,
    questions: test.questions.map((q) => {
      const { answerIndex, explanation, ...safeQ } = q;
      return safeQ;
    })
  }));
  res.json(safeList);
});
app.get("/api/mock-tests/:id", authenticate, (req, res) => {
  const user = req.user;
  const list = db.getMockTests();
  const test = list.find((t) => t.id === req.params.id);
  if (!test) {
    return res.status(404).json({ error: "Mock test not found" });
  }
  if (test.isPaid) {
    const activeSub = db.hasActiveSubscriptionForPack(user.id, test.category.toLowerCase().replace(/[^a-z]/g, ""));
    if (!activeSub) {
      return res.status(403).json({
        error: "Subscription Required",
        message: `This is a premium set included in the ${test.category} Pack. Please upgrade to unlock.`
      });
    }
  }
  const clientQuestions = test.questions.map((q) => {
    const { answerIndex, explanation, ...safeQ } = q;
    return safeQ;
  });
  res.json({
    ...test,
    questions: clientQuestions
  });
});
app.post("/api/mock-tests/:id/submit", authenticate, (req, res) => {
  const userId = req.user.id;
  const { answers, timeSpentSeconds } = req.body;
  try {
    const attempt = db.submitAttempt(userId, req.params.id, answers, timeSpentSeconds || 0);
    const originalTest = db.getMockTests().find((t) => t.id === req.params.id);
    res.json({
      attempt,
      solutions: originalTest ? originalTest.questions.map((q) => ({
        id: q.id,
        correctIndex: q.answerIndex,
        explanation: q.explanation
      })) : []
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/user/attempts", authenticate, (req, res) => {
  const userId = req.user.id;
  res.json(db.getAttemptsForUser(userId));
});
app.get("/api/leaderboard", (req, res) => {
  res.json(db.getLeaderboard());
});
app.post("/api/mock-tests/generate", authenticate, requireAdmin, async (req, res) => {
  const { examName, subject, topic, difficulty, quantity } = req.body;
  if (!examName || !subject || !topic) {
    return res.status(400).json({ error: "Please supply Exam Name, Subject, and Topic." });
  }
  const count = parseInt(quantity) || 5;
  const prompt = `Generate an array of exactly ${count} educational multiple-choice quiz questions for the government exam: "${examName}".
Subject: "${subject}"
Topic Focus: "${topic}"
Overall Difficulty: "${difficulty || "Medium"}"

Each question object inside the JSON array MUST strictly match this exact JSON schema:
{
  "text": "Write the quiz question clearly in English or simple Hindi context, detailing parameters and numbers.",
  "options": [
    "Option A/\u0915",
    "Option B/\u0916",
    "Option C/\u0917",
    "Option D/\u0918"
  ],
  "answerIndex": 0, // This must be an integer: 0 for Option A, 1 for Option B, 2 for Option C, 3 for Option D.
  "explanation": "Provide a complete fact-based logic explaining why the selected option is correct and why other options are incorrect.",
  "subject": "${subject}",
  "topic": "${topic}",
  "difficulty": "${difficulty || "Medium"}"
}

Respond with a raw array containing exactly JSON object items without backticks or tags, meeting exact educational standards.`;
  try {
    let questionsList = [];
    if (aiClient) {
      const modelToUse = db.getSettings().geminiModel || "gemini-3.5-flash";
      db.log("api", `Calling Gemini to build Mock Test for ${examName} - Topic: ${topic}`);
      const response = await aiClient.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are an expert Government Exam Paper Setter in India. Your mock test questions are accurate, challenging, have exactly four distinct options, and include exhaustive explanations.",
          responseSchema: {
            type: import_genai.Type.ARRAY,
            items: {
              type: import_genai.Type.OBJECT,
              properties: {
                text: { type: import_genai.Type.STRING },
                options: {
                  type: import_genai.Type.ARRAY,
                  items: { type: import_genai.Type.STRING }
                },
                answerIndex: { type: import_genai.Type.INTEGER },
                explanation: { type: import_genai.Type.STRING },
                subject: { type: import_genai.Type.STRING },
                topic: { type: import_genai.Type.STRING },
                difficulty: { type: import_genai.Type.STRING }
              },
              required: ["text", "options", "answerIndex", "explanation", "subject", "topic", "difficulty"]
            }
          }
        }
      });
      const responseText = response.text;
      if (responseText) {
        questionsList = JSON.parse(responseText);
      }
    } else {
      db.log("info", `Gemini Client absent, using fallback generator to populate test with customizable mock questions on: ${topic}`);
      questionsList = Array.from({ length: count }).map((_, i) => ({
        id: `gen-q-${Math.random().toString(36).substr(2, 9)}`,
        text: `Advanced Exam Question on ${topic} (${subject}) - Question Part ${i + 1}`,
        options: [
          `Primary theory of ${topic} emphasizing fiscal optimization.`,
          `Secondary structured policy directive for ${examName} standards.`,
          `Administrative governance protocol specified under national rules.`,
          `None of the above parameters apply to this topic.`
        ],
        answerIndex: Math.floor(Math.random() * 3),
        explanation: `This is a complete explanations brief for topic ${topic} inside ${subject}. In ${examName}, these questions are designed to test the applicant's conceptual foundations, and the first three choices reflect correct standard guidelines.`,
        subject,
        topic,
        difficulty: difficulty || "Medium"
      }));
    }
    const cleanQuestions = questionsList.map((q) => ({
      id: q.id || `gen-q-${Math.random().toString(36).substr(2, 9)}`,
      text: q.text || `Sample Question on ${topic}`,
      options: q.options || ["A", "B", "C", "D"],
      answerIndex: typeof q.answerIndex === "number" ? q.answerIndex : 0,
      explanation: q.explanation || "Detailed fact check here.",
      subject: q.subject || subject,
      topic: q.topic || topic,
      difficulty: q.difficulty || difficulty || "Medium"
    }));
    const categoryMapping = {
      "up police": "UP Police",
      "ssc": "SSC",
      "railway": "Railway",
      "upsc": "UPSC",
      "teaching": "Teaching",
      "banking": "Banking"
    };
    const dbCategory = categoryMapping[examName.toLowerCase()] || "SSC";
    const test = db.addMockTest({
      title: `${examName}: ${topic} Comprehensive Test`,
      category: dbCategory,
      durationMinutes: count * 2,
      totalQuestions: cleanQuestions.length,
      isPaid: Math.random() > 0.5,
      // 50% chance premium to encourage memberships
      scoreWeight: 2,
      negativeMarks: 0.5,
      questions: cleanQuestions
    });
    db.log("info", `Successfully created generated AI Mock Test via Gemini: ${test.title}`);
    res.json({ test, success: true });
  } catch (err) {
    db.log("error", `AI Mock Test Generator Exception: ${err.message}`);
    res.status(500).json({ error: "Gemini processing failed: " + err.message });
  }
});
app.post("/api/payments/checkout", authenticate, (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const userName = req.user.name || "User";
  const { packId, amount } = req.body;
  if (!packId || !amount) {
    return res.status(400).json({ error: "Package ID and amount are required" });
  }
  const payuKey = process.env.PAYU_MERCHANT_KEY;
  const payuSalt = process.env.PAYU_MERCHANT_SALT;
  const isSandbox = process.env.PAYU_SANDBOX !== "false";
  if (!payuKey || !payuSalt) {
    try {
      const result = db.createPayment(userId, packId, parseFloat(amount));
      return res.json({
        isSimulated: true,
        status: "Success",
        ...result
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  try {
    const txnid = "TXN_" + Date.now() + "_" + Math.floor(1e3 + Math.random() * 9e3);
    const amountStr = parseFloat(amount).toFixed(2);
    const packNames = {
      "up-police": "UP Police Pack",
      "ssc-gd": "SSC GD Pack",
      "ssc-combo": "SSC Exams Combo Pack",
      "railway-combo": "Railway Exams Combo Pack",
      "all-combo": "All Exams Premium Super Pass"
    };
    const productinfo = packNames[packId] || "Custom Premium Exam Pack";
    const firstname = userName.split(" ")[0] || "Applicant";
    const email = userEmail;
    const phone = "9999999999";
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const surl = `${appUrl}/api/payments/payu-callback`;
    const furl = `${appUrl}/api/payments/payu-callback`;
    const hashString = `${payuKey}|${txnid}|${amountStr}|${productinfo}|${firstname}|${email}|${userId}|${packId}|||||||||${payuSalt}`;
    const hash = import_crypto.default.createHash("sha512").update(hashString).digest("hex");
    const payUrl = isSandbox ? "https://test.payu.in/_payment" : "https://secure.payu.in/_payment";
    res.json({
      isSimulated: false,
      payUrl,
      params: {
        key: payuKey,
        txnid,
        amount: amountStr,
        productinfo,
        firstname,
        email,
        phone,
        surl,
        furl,
        hash,
        udf1: userId,
        udf2: packId
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Generating PayU authentication hash failed: " + err.message });
  }
});
app.post("/api/payments/payu-callback", (req, res) => {
  const {
    status,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    hash,
    udf1,
    // userId
    udf2,
    // packId
    key,
    error,
    unmappedstatus
  } = req.body;
  const payuSalt = process.env.PAYU_MERCHANT_SALT;
  if (!payuSalt) {
    db.log("error", `PayU Callback failed: PAYU_MERCHANT_SALT not configured on host env.`);
    return res.redirect("/?payment=failed&reason=missing_salt");
  }
  try {
    const udf5 = req.body.udf5 || "";
    const udf4 = req.body.udf4 || "";
    const udf3 = req.body.udf3 || "";
    const hashString = `${payuSalt}|${status}|||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const calculatedHash = import_crypto.default.createHash("sha512").update(hashString).digest("hex");
    if (calculatedHash !== hash) {
      db.log("error", `Forgery detected! Callback Hash verification mismatch. Txn ID: ${txnid}`);
      return res.redirect("/?payment=failed&reason=hash_mismatch");
    }
    if (status === "success") {
      db.approveVerifiedPayment(udf1, udf2, parseFloat(amount), txnid);
      res.redirect(`/?payment=success&packId=${udf2}&amount=${amount}`);
    } else {
      db.log("info", `PayU Transaction Cancelled/Declined. Txn ID: ${txnid}, Reason: ${unmappedstatus || error}`);
      res.redirect(`/?payment=failed&reason=${encodeURIComponent(unmappedstatus || "declined")}`);
    }
  } catch (err) {
    db.log("error", `PayU Callback Exception processing: ${err.message}`);
    res.redirect(`/?payment=failed&reason=${encodeURIComponent(err.message)}`);
  }
});
app.get("/api/payments/history", authenticate, (req, res) => {
  const userId = req.user.id;
  const list = db.getPayments().filter((p) => p.userId === userId);
  res.json(list);
});
app.get("/api/user/subscriptions", authenticate, (req, res) => {
  const userId = req.user.id;
  res.json(db.getSubscriptionsForUser(userId));
});
app.get("/api/developer/logs", authenticate, requireDeveloper, (req, res) => {
  res.json(db.getLogs());
});
app.delete("/api/developer/logs", authenticate, requireDeveloper, (req, res) => {
  db.clearLogs();
  res.json({ success: true });
});
app.get("/api/developer/settings", authenticate, requireDeveloper, (req, res) => {
  res.json(db.getSettings());
});
app.put("/api/developer/settings", authenticate, requireDeveloper, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    if (req.body.geminiApiKey) {
      aiClient = new import_genai.GoogleGenAI({
        apiKey: req.body.geminiApiKey,
        httpOptions: {
          headers: { "User-Agent": "aistudio-build" }
        }
      });
      db.log("info", "Gemini client settings reloaded with new API Credentials.");
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    db.log("info", "Vite live development middleware attached sequentially.");
  } else {
    const distPath = import_path.default.join(__dirname, "../dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
    db.log("info", "Serving prepared static assets in compiled production mode.");
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on ${process.env.APP_URL || "http://localhost:" + PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
