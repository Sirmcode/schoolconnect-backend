/* ================================================
   SchoolConnect — Database Seed Script
   Run: node seed.js  (from the backend/ directory)
   ================================================ */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();


const User = require('./models/User');
const Teacher = require('./models/Teacher');
const School = require('./models/School');
const Job = require('./models/Job');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/schoolconnect';

/* ── Demo accounts ────────────────────────── */
const DEMO_TEACHER_EMAIL = 'teacher@demo.com';
const DEMO_TEACHER_PASS = 'demo1234';
const DEMO_SCHOOL_EMAIL = 'school@demo.com';
const DEMO_SCHOOL_PASS = 'demo1234';

/* ── Teachers data ────────────────────────── */
const TEACHERS_DATA = [
    { firstName: 'Amara', lastName: 'Osei', phone: '08011111001', state: 'Lagos', lga: 'Lagos Island', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['Mathematics', 'Physics'], schoolLevels: ['Secondary (All)'], availability: 'Full-Time' },
    { firstName: 'Emeka', lastName: 'Nwosu', phone: '08011111002', state: 'Lagos', lga: 'Ikeja', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['English Language', 'Literature in English'], schoolLevels: ['Senior Secondary (SSS)'], availability: 'Part-Time' },
    { firstName: 'Chidinma', lastName: 'Eze', phone: '08011111003', state: 'Lagos', lga: 'Eti-Osa', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['Biology', 'Chemistry'], schoolLevels: ['Secondary (All)'], availability: 'Full-Time' },
    { firstName: 'Oluwaseun', lastName: 'Adeyemi', phone: '08011111004', state: 'Lagos', lga: 'Lekki', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['Computer Science', 'ICT'], schoolLevels: ['Secondary (All)'], availability: 'Both' },
    { firstName: 'Fatima', lastName: 'Aliyu', phone: '08011111005', state: 'FCT', lga: 'Abuja Municipal', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['French', 'Arabic'], schoolLevels: ['Secondary (All)'], availability: 'Part-Time' },
    { firstName: 'Babatunde', lastName: 'Coker', phone: '08011111006', state: 'Lagos', lga: 'Surulere', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['History', 'Government'], schoolLevels: ['Secondary (All)'], availability: 'Full-Time' },
    { firstName: 'Ngozi', lastName: 'Umeh', phone: '08011111007', state: 'Rivers', lga: 'Port Harcourt', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['Economics', 'Commerce', 'Accounting'], schoolLevels: ['Senior Secondary (SSS)'], availability: 'Part-Time' },
    { firstName: 'Samuel', lastName: 'Adeola', phone: '08011111008', state: 'Lagos', lga: 'Ikeja', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['Music', 'Fine & Applied Arts'], schoolLevels: ['All Levels'], availability: 'Part-Time' },
    { firstName: 'Kemi', lastName: 'Olawale', phone: '08011111009', state: 'Lagos', lga: 'Ajah', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['Physical Education', 'Health Education'], schoolLevels: ['Secondary (All)'], availability: 'Full-Time' },
    { firstName: 'David', lastName: 'Okafor', phone: '08011111010', state: 'Lagos', lga: 'Gbagada', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['Mathematics', 'Further Mathematics'], schoolLevels: ['Secondary (All)'], availability: 'Full-Time' },
    { firstName: 'Aisha', lastName: 'Musa', phone: '08011111011', state: 'FCT', lga: 'Abuja Municipal', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['Islamic Studies', 'Arabic'], schoolLevels: ['Secondary (All)'], availability: 'Part-Time' },
    { firstName: 'Victor', lastName: 'Okoro', phone: '08011111012', state: 'Enugu', lga: 'Enugu North', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['Agricultural Science'], schoolLevels: ['Secondary (All)'], availability: 'Full-Time' },
    { firstName: 'Blessing', lastName: 'Okon', phone: '08011111013', state: 'Akwa Ibom', lga: 'Uyo', category: 'Qualified Teacher', roleType: 'Class Teacher', subjects: ['English Language', 'Mathematics', 'Basic Science'], schoolLevels: ['Primary (Basic 1–6)'], availability: 'Full-Time' },
    { firstName: 'Tomisin', lastName: 'Ajayi', phone: '08011111014', state: 'Lagos', lga: 'Ojodu', category: 'Qualified Teacher', roleType: 'Class Teacher', subjects: ['Phonics', 'Early Literacy', 'Play-Based Learning'], schoolLevels: ['Nursery/Crèche'], availability: 'Full-Time' },
    { firstName: 'Chidi', lastName: 'Nnadi', phone: '08011111015', state: 'Anambra', lga: 'Onitsha North', category: 'Qualified Teacher', roleType: 'Class Teacher', subjects: ['Social Studies', 'Civic Education'], schoolLevels: ['Primary (Basic 1–6)'], availability: 'Part-Time' },
    { firstName: 'Sola', lastName: 'Bello', phone: '08011111016', state: 'Ogun', lga: 'Ado-Odo/Ota', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['Electrical Installation', 'Auto Mechanics'], schoolLevels: ['Vocational/Technical'], availability: 'Full-Time' },
    { firstName: 'Grace', lastName: 'Adamu', phone: '08011111017', state: 'Plateau', lga: 'Jos North', category: 'Qualified Teacher', roleType: 'Subject Teacher', subjects: ['Tailoring & Fashion Design', 'Home Economics'], schoolLevels: ['Vocational/Technical'], availability: 'Both' },
];

/* ── Schools data ─────────────────────────── */
const SCHOOLS_DATA = [
    { schoolName: "St. Mary's Academy", phone: '07011110001', state: 'Lagos', lga: 'Lagos Island', address: '5 Marina Rd', institutionTypes: ['Secondary School (JSS & SSS)'], plan: 'Pro' },
    { schoolName: 'Greenfields School', phone: '07011110002', state: 'Lagos', lga: 'Lekki', address: '12 Lekki Phase 1', institutionTypes: ['Secondary School (JSS & SSS)'] },
    { schoolName: 'Harmony International', phone: '07011110003', state: 'Lagos', lga: 'Eti-Osa', address: '3 VI Crescent', institutionTypes: ['International School'] },
    { schoolName: 'Sunrise Academy', phone: '07011110004', state: 'Lagos', lga: 'Ikeja', address: '8 Allen Ave', institutionTypes: ['Senior Secondary (SSS)'] },
    { schoolName: 'Royal Heritage School', phone: '07011110005', state: 'Lagos', lga: 'Surulere', address: '22 Bode Thomas St', institutionTypes: ['Secondary School (JSS & SSS)'] },
    { schoolName: 'Bright Futures Academy', phone: '07011110006', state: 'FCT', lga: 'Abuja Municipal', address: 'Gwarimpa Estate', institutionTypes: ['Secondary School (JSS & SSS)'] },
    { schoolName: 'Covenant Schools', phone: '07011110007', state: 'Rivers', lga: 'Port Harcourt', address: 'GRA Phase 2', institutionTypes: ['Senior Secondary (SSS)'] },
    { schoolName: 'Pearl British International', phone: '07011110008', state: 'Lagos', lga: 'Ajah', address: 'Sangotedo', institutionTypes: ['International School'] },
    { schoolName: 'Al-Noor Islamic School', phone: '07011110009', state: 'FCT', lga: 'Abuja Municipal', address: 'Wuse 2', institutionTypes: ['Secondary School (JSS & SSS)'] },
    { schoolName: 'Heritage Schools', phone: '07011110010', state: 'Enugu', lga: 'Enugu North', address: 'Independence Layout', institutionTypes: ['Secondary School (JSS & SSS)'] },
    { schoolName: 'Little Stars Nursery & Primary', phone: '07011110011', state: 'Akwa Ibom', lga: 'Uyo', address: 'Itam', institutionTypes: ['Nursery & Primary'] },
    { schoolName: 'Blossom Montessori', phone: '07011110012', state: 'Lagos', lga: 'Ojodu', address: 'Berger', institutionTypes: ['Montessori'] },
    { schoolName: 'Springboard Academy', phone: '07011110013', state: 'Lagos', lga: 'Gbagada', address: 'Gbagada Estate', institutionTypes: ['Primary School'] },
    { schoolName: 'Achievers Vocational Institute', phone: '07011110014', state: 'Ogun', lga: 'Ado-Odo/Ota', address: 'Sango-Ota', institutionTypes: ['Vocational/Technical School'] },
    { schoolName: 'Skills First College', phone: '07011110015', state: 'Plateau', lga: 'Jos North', address: 'Jos Central', institutionTypes: ['Vocational/Technical School'] },
];

/* ── Jobs data builder (relies on school IDs) ─ */
function buildJobs(schools) {
    // Map school names to _id
    const s = (name) => schools.find(sc => sc.schoolName === name)?._id;

    return [
        { schoolId: s("St. Mary's Academy"), title: 'Mathematics Teacher', roleType: 'Subject Teacher', level: 'Secondary (All)', subjects: ['Mathematics'], employmentType: 'Full-Time', salaryMin: 160000, salaryMax: 220000, deadline: new Date('2026-03-15'), description: 'We seek a dedicated Mathematics teacher for JSS1–SS3. Must have WAEC grading experience.' },
        { schoolId: s('Greenfields School'), title: 'Computer Science Teacher', roleType: 'Subject Teacher', level: 'Secondary (All)', subjects: ['Computer Science', 'ICT'], employmentType: 'Full-Time', salaryMin: 150000, salaryMax: 200000, deadline: new Date('2026-03-20'), description: 'Seeking an innovative CS teacher to lead our ICT curriculum and coding club.' },
        { schoolId: s('Harmony International'), title: 'English Language Teacher', roleType: 'Subject Teacher', level: 'Senior Secondary (SSS)', subjects: ['English Language'], employmentType: 'Part-Time', salaryMin: 60000, salaryMax: 90000, deadline: new Date('2026-03-10'), description: 'Part-time English teacher for SS1 & SS2. Morning sessions only (7:30AM–12PM).' },
        { schoolId: s('Sunrise Academy'), title: 'Biology Teacher', roleType: 'Subject Teacher', level: 'Secondary (All)', subjects: ['Biology'], employmentType: 'Full-Time', salaryMin: 170000, salaryMax: 210000, deadline: new Date('2026-03-25'), description: 'Experienced Biology teacher for WAEC and NECO classes.' },
        { schoolId: s('Royal Heritage School'), title: 'History Teacher', roleType: 'Subject Teacher', level: 'Secondary (All)', subjects: ['History'], employmentType: 'Part-Time', salaryMin: 55000, salaryMax: 80000, deadline: new Date('2026-03-12'), description: 'Experienced social science teacher for afternoon classes. 3 days a week.' },
        { schoolId: s('Bright Futures Academy'), title: 'French Teacher', roleType: 'Subject Teacher', level: 'Secondary (All)', subjects: ['French'], employmentType: 'Both', salaryMin: 70000, salaryMax: 130000, deadline: new Date('2026-04-01'), description: 'French teacher for a growing bilingual programme.' },
        { schoolId: s('Covenant Schools'), title: 'Economics Teacher', roleType: 'Subject Teacher', level: 'Senior Secondary (SSS)', subjects: ['Economics'], employmentType: 'Full-Time', salaryMin: 155000, salaryMax: 195000, deadline: new Date('2026-03-18'), description: 'Looking for a qualified Economics teacher to revamp our A-Levels programme.' },
        { schoolId: s('Pearl British International'), title: 'Physical Education Teacher', roleType: 'Subject Teacher', level: 'Secondary (All)', subjects: ['Physical Education'], employmentType: 'Full-Time', salaryMin: 140000, salaryMax: 180000, deadline: new Date('2026-03-28'), description: 'PE teacher and sports coordinator for a British curriculum school.' },
        { schoolId: s('Al-Noor Islamic School'), title: 'Islamic Studies Teacher', roleType: 'Subject Teacher', level: 'Secondary (All)', subjects: ['Islamic Studies', 'Arabic'], employmentType: 'Part-Time', salaryMin: 50000, salaryMax: 75000, deadline: new Date('2026-03-08'), description: 'Islamic Studies teacher. Arabic language skills required.' },
        { schoolId: s('Heritage Schools'), title: 'Agricultural Science Teacher', roleType: 'Subject Teacher', level: 'Secondary (All)', subjects: ['Agricultural Science'], employmentType: 'Full-Time', salaryMin: 130000, salaryMax: 170000, deadline: new Date('2026-04-05'), description: 'Agric Science teacher for junior and senior secondary classes.' },
        { schoolId: s('Little Stars Nursery & Primary'), title: 'Primary Class Teacher', roleType: 'Class Teacher', level: 'Primary (Basic 1–6)', subjects: ['English Language', 'Mathematics'], employmentType: 'Full-Time', salaryMin: 80000, salaryMax: 120000, deadline: new Date('2026-03-22'), description: 'Class teacher for Primary 4–6. Must be trained in primary education.' },
        { schoolId: s('Blossom Montessori'), title: 'Nursery Class Teacher', roleType: 'Class Teacher', level: 'Nursery/Crèche', subjects: ['Play-Based Learning', 'Phonics'], employmentType: 'Full-Time', salaryMin: 65000, salaryMax: 100000, deadline: new Date('2026-03-18'), description: 'Warm, creative Nursery class teacher trained in Montessori methods.' },
        { schoolId: s('Springboard Academy'), title: 'Primary Maths Teacher', roleType: 'Subject Teacher', level: 'Primary (Basic 1–6)', subjects: ['Mathematics'], employmentType: 'Part-Time', salaryMin: 50000, salaryMax: 80000, deadline: new Date('2026-03-20'), description: 'Part-time Primary Maths teacher for Saturday classes.' },
        { schoolId: s('Achievers Vocational Institute'), title: 'Electrical Installation Instructor', roleType: 'Subject Teacher', level: 'Vocational/Technical', subjects: ['Electrical Installation'], employmentType: 'Full-Time', salaryMin: 150000, salaryMax: 200000, deadline: new Date('2026-04-10'), description: 'Qualified electrical installation instructor for our City & Guilds programme.' },
        { schoolId: s('Skills First College'), title: 'Fashion Design Instructor', roleType: 'Subject Teacher', level: 'Vocational/Technical', subjects: ['Tailoring & Fashion Design'], employmentType: 'Both', salaryMin: 80000, salaryMax: 130000, deadline: new Date('2026-04-01'), description: 'Fashion design and entrepreneurship instructor.' },
    ].filter(j => j.schoolId); // only keep jobs whose school was found
}

/* ── Main seed function ───────────────────── */
async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([User.deleteMany(), Teacher.deleteMany(), School.deleteMany(), Job.deleteMany()]);
        console.log('🗑️  Cleared existing data');

        const salt = await bcrypt.genSalt(10);

        // ── Create demo teacher account ──────────
        const teacherUserHash = await bcrypt.hash(DEMO_TEACHER_PASS, salt);
        const teacherUser = await User.create({ email: DEMO_TEACHER_EMAIL, passwordHash: teacherUserHash, role: 'teacher' });
        const demoTeacher = await Teacher.create({
            userId: teacherUser._id,
            ...TEACHERS_DATA[0], // Amara Osei
        });
        console.log(`👩‍🏫 Demo teacher created: ${DEMO_TEACHER_EMAIL} / ${DEMO_TEACHER_PASS}`);

        // ── Create remaining teachers (no user accounts — browse only) ──
        for (const t of TEACHERS_DATA.slice(1)) {
            await Teacher.create({ userId: new mongoose.Types.ObjectId(), ...t });
        }
        console.log(`👩‍🏫 Seeded ${TEACHERS_DATA.length} teachers`);

        // ── Create demo school account ───────────
        const schoolUserHash = await bcrypt.hash(DEMO_SCHOOL_PASS, salt);
        const schoolUser = await User.create({ email: DEMO_SCHOOL_EMAIL, passwordHash: schoolUserHash, role: 'school' });
        const demoSchool = await School.create({
            userId: schoolUser._id,
            ...SCHOOLS_DATA[0], // St. Mary's Academy
        });
        console.log(`🏫 Demo school created: ${DEMO_SCHOOL_EMAIL} / ${DEMO_SCHOOL_PASS}`);

        // ── Create remaining schools (no user accounts — for job lookup only) ──
        const restSchools = [];
        for (const sc of SCHOOLS_DATA.slice(1)) {
            const created = await School.create({ userId: new mongoose.Types.ObjectId(), ...sc });
            restSchools.push(created);
        }

        // ── Create jobs ──────────────────────────
        const allSchools = [demoSchool, ...restSchools];
        const jobsData = buildJobs(allSchools);
        await Job.insertMany(jobsData);
        console.log(`💼 Seeded ${jobsData.length} jobs`);

        console.log('\n🎉 Seed complete! You can now start the server.\n');
        console.log('─── Demo Login Credentials ───────────────');
        console.log(`Teacher: ${DEMO_TEACHER_EMAIL}  |  Password: ${DEMO_TEACHER_PASS}`);
        console.log(`School:  ${DEMO_SCHOOL_EMAIL}   |  Password: ${DEMO_SCHOOL_PASS}`);
        console.log('──────────────────────────────────────────\n');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seed();
