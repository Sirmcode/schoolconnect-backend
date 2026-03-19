/* ================================================
   SchoolConnect — Email Service (Gmail / Nodemailer)
   ================================================ */
const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,       // e.g. yourname@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD // 16-char App Password from Google
    }
});

const FROM = `SchoolConnect <${process.env.GMAIL_USER || 'noreply@schoolconnect.com'}>`;
const APP_URL = 'https://schoolconnects.netlify.app';

/* ── Shared layout wrapper ────────────────── */
function wrap(content) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body { margin:0; padding:0; background:#f4f6f9; font-family: Arial, sans-serif; }
  .card { max-width:580px; margin:32px auto; background:#fff; border-radius:12px;
          box-shadow:0 2px 8px rgba(0,0,0,.08); overflow:hidden; }
  .header { background:linear-gradient(135deg,#1a73e8,#0d47a1); padding:32px 40px; text-align:center; }
  .header h1 { color:#fff; margin:0; font-size:22px; letter-spacing:.5px; }
  .header span { color:#90caf9; font-size:13px; }
  .body { padding:36px 40px; color:#333; line-height:1.7; }
  .body h2 { color:#1a73e8; margin-top:0; font-size:18px; }
  .btn { display:inline-block; margin:20px 0; padding:14px 32px;
         background:#1a73e8; color:#fff!important; text-decoration:none;
         border-radius:8px; font-weight:bold; font-size:15px; }
  .highlight { background:#e8f0fe; border-left:4px solid #1a73e8;
               padding:12px 16px; border-radius:0 8px 8px 0; margin:16px 0; }
  .footer { background:#f9f9f9; border-top:1px solid #eee; padding:20px 40px;
            text-align:center; color:#888; font-size:12px; }
</style></head><body>
  <div class="card">
    <div class="header">
      <h1>🎓 SchoolConnect</h1>
      <span>AI-Powered Teacher &amp; School Matching</span>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      SchoolConnect Nigeria &nbsp;|&nbsp;
      <a href="${APP_URL}" style="color:#1a73e8;">Visit Platform</a><br>
      You received this because you signed up at SchoolConnect.
    </div>
  </div>
</body></html>`;
}

/* ── Helper to send email safely ──────────── */
async function sendMail({ to, subject, html }) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return; // skip if not configured
    try {
        await transporter.sendMail({ from: FROM, to, subject, html });
        console.log(`📧 Email sent to ${to}: ${subject}`);
    } catch (err) {
        console.error(`❌ Email error (${to}):`, err.message);
    }
}

/* ── Email: Welcome Teacher ───────────────── */
async function sendTeacherWelcome({ email, firstName }) {
    await sendMail({
        to: email,
        subject: `Welcome to SchoolConnect, ${firstName}! 🎓`,
        html: wrap(`
            <h2>Welcome, ${firstName}! 👋</h2>
            <p>Your teacher account has been created on <strong>SchoolConnect</strong> — Nigeria's smartest platform for connecting qualified teachers with private schools.</p>
            <div class="highlight">
                <strong>What you can do now:</strong><br>
                ✅ Browse 15+ job listings from schools across Nigeria<br>
                ✅ Apply to jobs that match your qualifications<br>
                ✅ Run the AI Match Agent to find your best-fit schools<br>
                ✅ Build your professional teacher profile
            </div>
            <a href="${APP_URL}" class="btn">Browse Jobs Now →</a>
            <p style="color:#666;font-size:13px;">Need help? Simply reply to this email.</p>
        `),
    });
}

/* ── Email: Welcome School ────────────────── */
async function sendSchoolWelcome({ email, schoolName }) {
    await sendMail({
        to: email,
        subject: `Welcome to SchoolConnect, ${schoolName}! 🏫`,
        html: wrap(`
            <h2>Welcome, ${schoolName}! 👋</h2>
            <p>Your school account is ready on <strong>SchoolConnect</strong> — the platform where Nigerian private schools find the right teachers fast.</p>
            <div class="highlight">
                <strong>What you can do now:</strong><br>
                ✅ Browse 17+ qualified teachers in your state<br>
                ✅ Post job vacancies and receive applications<br>
                ✅ Use the AI Scout Agent to find matching teachers<br>
                ✅ Review applicants directly from your dashboard
            </div>
            <a href="${APP_URL}" class="btn">Open School Dashboard →</a>
            <p style="color:#666;font-size:13px;">Need help? Simply reply to this email.</p>
        `),
    });
}

/* ── Email: Teacher applied (confirm to teacher) ── */
async function sendApplicationConfirmation({ teacherEmail, teacherName, jobTitle, schoolName }) {
    await sendMail({
        to: teacherEmail,
        subject: `Application sent — ${jobTitle} at ${schoolName}`,
        html: wrap(`
            <h2>Application Sent ✅</h2>
            <p>Hi ${teacherName}, your application has been submitted successfully!</p>
            <div class="highlight">
                <strong>📋 Application Details</strong><br>
                Position: <strong>${jobTitle}</strong><br>
                School: <strong>${schoolName}</strong>
            </div>
            <p>The school will review your profile and get in touch if there's a match. We'll keep you posted!</p>
            <a href="${APP_URL}" class="btn">View My Applications →</a>
        `),
    });
}

/* ── Email: New applicant (notify school) ─── */
async function sendNewApplicantAlert({ schoolEmail, schoolName, jobTitle, teacherName, teacherState, teacherSubjects }) {
    await sendMail({
        to: schoolEmail,
        subject: `New applicant for ${jobTitle} — ${teacherName}`,
        html: wrap(`
            <h2>New Job Application 📬</h2>
            <p>Hi <strong>${schoolName}</strong>, a teacher just applied for one of your vacancies!</p>
            <div class="highlight">
                <strong>👩‍🏫 Applicant Details</strong><br>
                Name: <strong>${teacherName}</strong><br>
                Location: ${teacherState}<br>
                Subjects: ${teacherSubjects.join(', ')}<br>
                Position: <strong>${jobTitle}</strong>
            </div>
            <a href="${APP_URL}" class="btn">Review Applicants →</a>
            <p style="color:#666;font-size:13px;">Log in to your school dashboard to review and respond.</p>
        `),
    });
}

module.exports = {
    sendTeacherWelcome,
    sendSchoolWelcome,
    sendApplicationConfirmation,
    sendNewApplicantAlert,
};
