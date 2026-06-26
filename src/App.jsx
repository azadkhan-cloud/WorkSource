import { useState, useEffect, useRef, useCallback } from "react";

// ── Storage wrapper (production-ready) ──
const storage = {
  async get(key) {
    const val = localStorage.getItem(key);
    if (val === null) throw new Error("not found");
    return { value: val };
  },
  async set(key, val) {
    localStorage.setItem(key, val);
    return { key, value: val };
  },
};

// ─── CONFIG ─────────────────────────────────────────────────────────
const WEB3FORMS_KEY = "";
const PORTFOLIO_PDF_URL = "";
const BRAND = "WorkSource";

const P = {
  name: "Azad Khan",
  email: "azad.khan@worksource.co.in",
  location: "Mumbai, India",
  phone: "+91 9769498862",
  linkedin: "https://linkedin.com/in/azad-khan-8b4b47226",
  title: "HR Operations & AI-Driven Recruitment",
  heroLine: "AI won't take your job. But someone who knows AI might.",
  heroSub: "I went from manual HR processes to building complete HRMS automation in months — and I want to show you how.",
  bio: `I'm Azad Khan — an HR and Talent Acquisition professional with over 8 years of hands-on experience in end-to-end recruitment, HR operations, and team leadership across high-growth organizations in Mumbai.

I've built recruitment pipelines, managed hiring teams, led bulk hiring campaigns across multiple cities, and hired 1000+ candidates over my career.

Here's the part that changed everything: I discovered ChatGPT and AI tools not too long ago. What started as curiosity — automating a sales tracker in Google Sheets — turned into something much bigger. Today I build complete HRMS systems, recruitment dashboards, automated workflows, and reporting tools from scratch.

I didn't learn this in a classroom. I learned it by doing. That journey is proof of what AI can do for anyone in HR who's willing to be curious.`,
  coreMessage: [
    { icon: "🤝", title: "AI Is Your Partner", text: "AI handles the repetitive — screening, data entry, tracking. You handle the human — empathy, judgment, culture." },
    { icon: "📈", title: "Future Favors the Curious", text: "Companies will favor people who understand AI. Not coding — just awareness and willingness to learn." },
    { icon: "🔥", title: "If I Can, So Can You", text: "Zero technical background. Discovered AI months ago. Now I build complete HRMS systems. The learning curve is shorter than you think." },
  ],
};

const SKILLS = [
  { name: "End-to-End Recruitment", level: 95, cat: "HR & Recruitment" },
  { name: "Talent Acquisition Strategy", level: 92, cat: "HR & Recruitment" },
  { name: "Bulk Hiring & Scaling", level: 90, cat: "HR & Recruitment" },
  { name: "HR Operations & Compliance", level: 88, cat: "HR & Recruitment" },
  { name: "Recruitment Team Leadership", level: 90, cat: "HR & Recruitment" },
  { name: "AI-Driven HR Automation", level: 85, cat: "AI & Automation" },
  { name: "Google Apps Script", level: 82, cat: "AI & Automation" },
  { name: "ChatGPT / LLM Prompting", level: 88, cat: "AI & Automation" },
  { name: "HRMS System Building", level: 80, cat: "AI & Automation" },
  { name: "Google Sheets / Workspace", level: 92, cat: "Tools" },
  { name: "Recruitment Dashboards", level: 88, cat: "Tools" },
  { name: "Job Portals (Naukri, LinkedIn)", level: 95, cat: "Tools" },
  { name: "Stakeholder Management", level: 90, cat: "Leadership" },
  { name: "Workforce Planning", level: 85, cat: "Leadership" },
  { name: "Team Building & Mentoring", level: 88, cat: "Leadership" },
];

const EXPERIENCE = [
  { role: "Assistant HR Manager / Team Lead", company: "Ennoble Social Innovation Foundation", loc: "Mumbai", period: "Aug 2025 – Present", highlights: ["Sole HR professional managing recruitment, HR operations, payroll coordination", "Designed AI-driven HR automation workflows using Google Workspace", "Built recruitment dashboards, trackers, and reporting systems", "Reduced manual HR work by approximately 70% through automation"] },
  { role: "Senior HR Recruiter", company: "AMPA Orthodontics (Toothsi / Skinnsi)", loc: "Mumbai", period: "Oct 2021 – May 2025", highlights: ["Led a team of 7 recruiters managing high-volume hiring campaigns", "Hired 1000+ candidates across Mumbai and Bangalore", "Pan-India recruitment for Sales, Operations, and BD roles"] },
  { role: "Senior HR Recruiter", company: "PayNearby Pvt Ltd", loc: "Mumbai", period: "Apr 2019 – Aug 2021", highlights: ["Pan-India recruitment for sales and business operations", "Full lifecycle from sourcing to onboarding and offboarding"] },
  { role: "HR Executive → Team Leader", company: "AasaanJobs Pvt Ltd", loc: "Mumbai", period: "Jun 2015 – Jan 2018", highlights: ["High-volume recruitment across multiple industries", "Promoted to Team Leader for recruitment operations"] },
];

const WORK_SHOWCASE = [
  { title: "HRMS Automation System", desc: "Complete HR Management System — employee records, leave tracking, payroll coordination, automated notifications.", tag: "AI + Workspace", color: "#0284C7" },
  { title: "Recruitment Dashboard", desc: "Real-time hiring pipeline with source analytics, status tracking, and automated updates.", tag: "Dashboard", color: "#0EA5E9" },
  { title: "Sales Structure Automation", desc: "My first AI project — automated sales tracking in Google Sheets. Where my AI journey started.", tag: "First AI Project", color: "#F59E0B" },
  { title: "AI Screening Workflows", desc: "Automated candidate screening and shortlisting that dramatically cut manual screening time.", tag: "Recruitment AI", color: "#8B5CF6" },
  { title: "Onboarding System", desc: "Automated document collection, offer letters, and new joiner checklists within Google Workspace.", tag: "HR Ops", color: "#EC4899" },
  { title: "HR Reporting & Analytics", desc: "Automated headcount, attrition, hiring funnel reports delivered without manual effort.", tag: "Analytics", color: "#F97316" },
];

const ROLE_OPTIONS = ["HR Manager", "HR Executive", "HR Business Partner", "Talent Acquisition Lead", "Recruiter", "CHRO / VP HR", "Admin / Ops Manager", "Founder / CEO", "Team Leader", "Department Head", "Other"];
const DIFFICULTY_OPTIONS = ["Manual recruitment process", "No HR automation", "High attrition / retention issues", "Slow hiring pipeline", "Poor candidate experience", "No HR dashboards or reporting", "Compliance & documentation gaps", "Inconsistent onboarding", "Workforce planning challenges", "Team doesn't use AI tools", "Payroll & attendance issues", "Other"];
const GOAL_OPTIONS = ["Automate HR with AI", "Build recruitment dashboards", "Speed up hiring", "Set up HRMS from scratch", "Streamline onboarding", "Automated HR reporting", "AI candidate screening", "Train HR team on AI", "Improve workforce planning", "Reduce manual workload", "Other"];
const DEPARTMENT_OPTIONS = ["Human Resources", "Talent Acquisition", "Operations", "Administration", "Sales", "Marketing", "Finance", "Technology / IT", "Customer Support", "C-Suite", "Other"];

// ─── UTILS ──────────────────────────────────────────────────────────
async function sendEmail(subject, body, fromName, fromEmail) {
  if (!WEB3FORMS_KEY) return { ok: false, reason: "no_key" };
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: `WorkSource — ${fromName}`, name: fromName, email: fromEmail, message: body }),
    });
    const data = await res.json();
    return { ok: data.success === true };
  } catch { return { ok: false, reason: "network" }; }
}

const getNext14Days = () => {
  const days = []; const today = new Date();
  for (let i = 1; i <= 14; i++) { const d = new Date(today); d.setDate(today.getDate() + i); if (d.getDay() !== 0 && d.getDay() !== 6) days.push(d); }
  return days;
};
const fmtDate = (d) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const fmtShort = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtKey = (d) => d.toISOString().split("T")[0];
const uid = () => Math.random().toString(36).slice(2, 10);

// ─── COLORS — SKY BLUE + WHITE ──────────────────────────────────────
const C = {
  white: "#FFFFFF",
  bg: "#F0F7FF",
  bgAlt: "#E0EFFF",
  card: "#FFFFFF",
  bdr: "#BFDBFE",
  bdrLight: "#E0EFFF",
  tx: "#0F172A",
  txSec: "#334155",
  mt: "#64748B",
  sky: "#0284C7",
  skyLight: "#0EA5E9",
  skyPale: "#E0F2FE",
  skyDark: "#075985",
  accent: "#0284C7",
  err: "#DC2626",
  warn: "#D97706",
  ok: "#059669",
};

// ─── NAV ITEMS ──────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "about", label: "About", icon: "👤" },
  { id: "why-ai", label: "Why AI", icon: "🧠" },
  { id: "work", label: "My Work", icon: "🛠️" },
  { id: "skills", label: "Skills", icon: "📊" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "portfolio-dl", label: "Portfolio", icon: "📋" },
  { id: "book", label: "Book a Slot", icon: "📅" },
  { id: "contact", label: "Contact", icon: "✉️" },
];

// ─── APP ────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("hero");
  const [notifs, setNotifs] = useState([]);
  const [nOpen, setNOpen] = useState(false);
  const [mobNav, setMobNav] = useState(false);

  useEffect(() => { (async () => { try { const r = await storage.get("ws3-notifs"); if (r?.value) setNotifs(JSON.parse(r.value)); } catch {} })(); }, []);

  // Scroll spy
  useEffect(() => {
    const ids = ["hero", ...NAV_ITEMS.map(n => n.id)];
    const onScroll = () => {
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 120) { setActive(ids[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => { setMobNav(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const pushNotif = async (n) => {
    const u = [n, ...notifs]; setNotifs(u);
    try { await storage.set("ws3-notifs", JSON.stringify(u)); } catch {}
  };
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div style={s.app}>
      {/* ─── NAV ─── */}
      <nav style={s.nav}>
        <div style={s.navIn}>
          <div onClick={() => go("hero")} style={s.logoWrap}>
            <div style={s.logoBox}>W</div>
            <span style={s.logoName}>{BRAND}</span>
          </div>
          <div style={s.navLinks}>
            {NAV_ITEMS.map(n => (
              <button key={n.id} onClick={() => go(n.id)}
                style={{ ...s.navLink, ...(active === n.id ? s.navLinkActive : {}) }}>
                <span style={{ fontSize: 14 }}>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </div>
          <button style={s.ham} onClick={() => setMobNav(!mobNav)}>☰</button>
        </div>
        {mobNav && (
          <div style={s.mobMenu}>
            {NAV_ITEMS.map(n => (
              <button key={n.id} onClick={() => go(n.id)}
                style={{ ...s.mobItem, ...(active === n.id ? { color: C.sky, fontWeight: 700, background: C.skyPale } : {}) }}>
                <span style={{ fontSize: 16 }}>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* BELL */}
      <button style={s.bell} onClick={() => setNOpen(true)}>
        🔔{unread > 0 && <span style={s.bellBadge}>{unread}</span>}
      </button>
      <NotifPanel items={notifs} setItems={setNotifs} open={nOpen} onClose={() => setNOpen(false)} />

      <Hero onBook={() => go("book")} onPortfolio={() => go("portfolio-dl")} />
      <SectionAbout />
      <SectionWhyAI />
      <SectionWork />
      <SectionSkills />
      <SectionExp />
      <SectionPortfolio />
      <SectionBook pushNotif={pushNotif} />
      <SectionContact pushNotif={pushNotif} />

      <footer style={s.footer}>
        <div style={s.logoWrap}>
          <div style={{ ...s.logoBox, width: 30, height: 30, fontSize: 14 }}>W</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: C.sky }}>{BRAND}</span>
        </div>
        <p style={{ fontSize: 13, color: C.mt, marginTop: 8 }}>© {new Date().getFullYear()} {BRAND} by Azad Khan — Mumbai, India</p>
      </footer>
    </div>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────
function Hero({ onBook, onPortfolio }) {
  const [typed, setTyped] = useState("");
  const i = useRef(0);
  useEffect(() => {
    i.current = 0; setTyped("");
    const iv = setInterval(() => { i.current++; setTyped(P.heroLine.slice(0, i.current)); if (i.current >= P.heroLine.length) clearInterval(iv); }, 45);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="hero" style={s.hero}>
      <div style={s.heroIn}>
        <div style={s.heroLogoBig}>W</div>
        <p style={s.heroBrand}>{BRAND}</p>
        <p style={s.heroSub2}>{P.title} — {P.name}</p>
        <h1 style={s.h1}>{typed}<span style={{ color: C.sky, fontWeight: 200 }}>|</span></h1>
        <p style={s.heroDesc}>{P.heroSub}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
          <button style={s.btn} onClick={onBook}>📅 Book a Slot — 9 PM Daily</button>
          <button style={s.btnOut} onClick={onPortfolio}>📋 Download Portfolio</button>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {["📍 Mumbai", "💼 8+ Years HR", "🕘 9 PM IST Daily"].map((b, i) => (
            <span key={i} style={s.badge}>{b}</span>
          ))}
          <a href={P.linkedin} target="_blank" rel="noopener noreferrer" style={{ ...s.badge, textDecoration: "none" }}>🔗 LinkedIn</a>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION WRAPPER ────────────────────────────────────────────────
function Sec({ id, title, icon, sub, alt, children }) {
  return (
    <section id={id} style={{ ...s.sec, ...(alt ? s.secAlt : {}) }}>
      <div style={s.secHeader}>
        <span style={s.secIcon}>{icon}</span>
        <h2 style={s.secTitle}>{title}</h2>
      </div>
      {sub && <p style={s.secSub}>{sub}</p>}
      <div style={s.secBody}>{children}</div>
    </section>
  );
}

// ─── ABOUT ──────────────────────────────────────────────────────────
function SectionAbout() {
  return (
    <Sec id="about" title="About Me" icon="👤" sub="8+ years of HR experience, now powered by AI">
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        <div>{P.bio.split("\n\n").map((p, i) => <p key={i} style={s.body}>{p}</p>)}</div>
        <div style={s.card}>
          <h3 style={s.cardTitle}>My AI Journey</h3>
          <p style={{ fontSize: 15, fontStyle: "italic", color: C.txSec, lineHeight: 1.7, marginBottom: 16, borderLeft: `3px solid ${C.sky}`, paddingLeft: 14 }}>
            "I discovered ChatGPT with zero technical background. Started with a sales tracker. Today I build complete HRMS systems. That's the power of curiosity."
          </p>
          {["B.Com graduate — no engineering degree", "Self-taught AI automation", "Manual processes → 70% automation", "8+ years of real HR as the foundation"].map((t, i) => (
            <div key={i} style={s.chk}><span style={s.chkIcon}>✓</span><span>{t}</span></div>
          ))}
        </div>
      </div>
    </Sec>
  );
}

// ─── WHY AI ─────────────────────────────────────────────────────────
function SectionWhyAI() {
  return (
    <Sec id="why-ai" title="Why AI Matters for HR" icon="🧠" sub="What every HR professional should know" alt>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {P.coreMessage.map((m, i) => (
          <div key={i} style={{ ...s.card, textAlign: "center" }}>
            <span style={{ fontSize: 36, display: "block", marginBottom: 10 }}>{m.icon}</span>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.sky, marginBottom: 8 }}>{m.title}</h3>
            <p style={{ fontSize: 14, color: C.txSec, lineHeight: 1.65 }}>{m.text}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 28, padding: "20px 24px", background: C.skyPale, borderRadius: 14, border: `1px solid ${C.bdr}` }}>
        <p style={{ fontSize: 16, color: C.skyDark, lineHeight: 1.7 }}>
          <em>Will AI affect HR?</em> — it already has. <strong>Are you ready?</strong>
        </p>
      </div>
    </Sec>
  );
}

// ─── WORK ───────────────────────────────────────────────────────────
function SectionWork() {
  const [open, setOpen] = useState(null);
  return (
    <Sec id="work" title="My Work — Built With AI" icon="🛠️" sub="Zero coding background. All built with AI + Google Workspace.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {WORK_SHOWCASE.map((w, i) => (
          <div key={i} onClick={() => setOpen(open === i ? null : i)}
            style={{ ...s.card, cursor: "pointer", borderLeft: `4px solid ${w.color}`, transition: "box-shadow 0.2s", boxShadow: open === i ? `0 4px 20px ${w.color}22` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: w.color, background: `${w.color}14`, padding: "3px 10px", borderRadius: 6 }}>{w.tag}</span>
              <span style={{ color: C.mt }}>{open === i ? "▾" : "▸"}</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.tx }}>{w.title}</h3>
            {open === i && (
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 14, color: C.txSec, lineHeight: 1.65, marginBottom: 14 }}>{w.desc}</p>
                <div style={{ background: C.bg, borderRadius: 10, padding: 28, textAlign: "center", border: `1px dashed ${C.bdr}` }}>
                  <span style={{ fontSize: 32 }}>📸</span>
                  <p style={{ fontSize: 12, color: C.mt, marginTop: 6 }}>Screenshot coming soon</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Sec>
  );
}

// ─── SKILLS ─────────────────────────────────────────────────────────
function SectionSkills() {
  const cats = [...new Set(SKILLS.map(s => s.cat))];
  return (
    <Sec id="skills" title="Skills & Expertise" icon="📊" alt>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        {cats.map(c => (
          <div key={c} style={s.card}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: C.sky, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>{c}</h3>
            {SKILLS.filter(sk => sk.cat === c).map(sk => (
              <div key={sk.name} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4, color: C.txSec }}>
                  <span>{sk.name}</span><span style={{ color: C.sky, fontWeight: 700 }}>{sk.level}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: C.bdrLight, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${C.sky}, ${C.skyLight})`, width: `${sk.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Sec>
  );
}

// ─── EXPERIENCE ─────────────────────────────────────────────────────
function SectionExp() {
  return (
    <Sec id="experience" title="Experience" icon="💼">
      <div style={{ maxWidth: 650, margin: "0 auto" }}>
        {EXPERIENCE.map((e, i) => (
          <div key={i} style={{ position: "relative", paddingLeft: 32, paddingBottom: 32 }}>
            <div style={{ position: "absolute", left: 0, top: 6, width: 14, height: 14, borderRadius: "50%", background: C.sky, border: `3px solid ${C.white}`, boxShadow: `0 0 0 2px ${C.bdr}`, zIndex: 2 }} />
            {i < EXPERIENCE.length - 1 && <div style={{ position: "absolute", left: 6, top: 20, bottom: 0, width: 2, background: C.bdr }} />}
            <span style={{ fontSize: 12, color: C.sky, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{e.period}</span>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.tx, marginBottom: 2 }}>{e.role}</h3>
            <p style={{ fontSize: 14, color: C.mt, marginBottom: 8 }}>{e.company} — {e.loc}</p>
            {e.highlights.map((h, j) => (
              <div key={j} style={s.chk}><span style={{ ...s.chkIcon, fontSize: 11 }}>→</span><span style={{ fontSize: 13 }}>{h}</span></div>
            ))}
          </div>
        ))}
        <div style={{ ...s.card, textAlign: "center" }}>
          <p style={{ fontWeight: 600 }}>🎓 Bachelor of Commerce (B.Com) — Mumbai University</p>
        </div>
      </div>
    </Sec>
  );
}

// ─── PORTFOLIO DOWNLOAD ─────────────────────────────────────────────
function SectionPortfolio() {
  const items = [
    { icon: "🏗️", t: "HRMS Systems", d: "Employee records, leave, payroll, notifications." },
    { icon: "📊", t: "Recruitment Dashboards", d: "Live pipelines, analytics, auto-updates." },
    { icon: "⚡", t: "Workflow Automation", d: "Screening, onboarding, offers. 70% less manual." },
    { icon: "📈", t: "HR Analytics", d: "Auto reports — headcount, attrition, funnels." },
    { icon: "🤖", t: "AI Screening", d: "Pre-screen candidates with AI before your team sees them." },
    { icon: "🔄", t: "Process Redesign", d: "Job posting to exit — rebuilt for efficiency." },
  ];
  const dl = () => {
    if (PORTFOLIO_PDF_URL) { window.open(PORTFOLIO_PDF_URL, "_blank"); }
    else { alert("Upload your PDF to Google Drive and paste the link in PORTFOLIO_PDF_URL"); }
  };
  return (
    <Sec id="portfolio-dl" title="What I Build For HR" icon="📋" sub="Real solutions I've built and deployed — I can do the same for your team." alt>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 28 }}>
        {items.map((p, i) => (
          <div key={i} style={{ ...s.card, textAlign: "center", padding: 18 }}>
            <span style={{ fontSize: 28, display: "block", marginBottom: 6 }}>{p.icon}</span>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: C.tx, marginBottom: 4 }}>{p.t}</h3>
            <p style={{ fontSize: 12, color: C.mt, lineHeight: 1.5 }}>{p.d}</p>
          </div>
        ))}
      </div>
      <div style={{ ...s.card, maxWidth: 550, margin: "0 auto", textAlign: "center", padding: 28 }}>
        <span style={{ fontSize: 44 }}>📋</span>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: C.sky, marginTop: 6, marginBottom: 8 }}>Download My Portfolio</h3>
        <p style={{ fontSize: 14, color: C.txSec, marginBottom: 16, lineHeight: 1.6 }}>Full details on what I build, how I help HR, and my journey. Share it with your colleagues.</p>
        <button style={{ ...s.btn, maxWidth: 300, margin: "0 auto" }} onClick={dl}>Download Portfolio (PDF)</button>
      </div>
    </Sec>
  );
}

// ─── BOOKING ────────────────────────────────────────────────────────
function SectionBook({ pushNotif }) {
  const days = getNext14Days();
  const [selD, setSelD] = useState(null);
  const [bkd, setBkd] = useState({});
  const [done, setDone] = useState(null);
  const [ld, setLd] = useState(true);
  const [sending, setSending] = useState(false);
  const [emailSt, setEmailSt] = useState(null);
  const empty = { name: "", email: "", company: "", role: "", department: "", difficulties: [], goals: [], extra: "" };
  const [f, setF] = useState(empty);

  useEffect(() => { (async () => { try { const r = await storage.get("ws3-slots"); if (r?.value) setBkd(JSON.parse(r.value)); } catch {} setLd(false); })(); }, []);
  const toggle = (k, v) => setF(p => ({ ...p, [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v] }));
  const ok = selD && f.name && f.email && f.role && f.difficulties.length > 0 && f.goals.length > 0 && !sending;

  const book = async () => {
    if (!ok) return;
    setSending(true); setEmailSt(null);
    const dk = fmtKey(selD);
    const b = { id: uid(), date: fmtDate(selD), ds: fmtShort(selD), dk, slot: "9:00 PM IST", ...f, at: new Date().toISOString() };
    const u = { ...bkd, [`${dk}-9PM`]: b }; setBkd(u);
    try { await storage.set("ws3-slots", JSON.stringify(u)); } catch {}
    const det = [`Role: ${f.role}`, f.company && `Co: ${f.company}`, `Issues: ${f.difficulties.slice(0, 2).join(", ")}`].filter(Boolean).join(" | ");
    pushNotif({ id: b.id, type: "booking", message: `${f.name} booked 9 PM on ${fmtShort(selD)}`, detail: det.slice(0, 140), email: f.email, time: new Date().toLocaleTimeString(), read: false });
    const body = [`NEW BOOKING — WorkSource`, ``, `Date: ${fmtDate(selD)}`, `Time: 9:00 PM IST`, `Name: ${f.name}`, `Email: ${f.email}`, f.company && `Company: ${f.company}`, `Role: ${f.role}`, f.department && `Department: ${f.department}`, ``, `CHALLENGES:`, ...f.difficulties.map(d => `  • ${d}`), ``, `GOALS:`, ...f.goals.map(g => `  • ${g}`), f.extra && `\nNOTES: ${f.extra}`].filter(Boolean).join("\n");
    const r = await sendEmail(`🗓️ Booking: ${f.name} — ${fmtShort(selD)} 9 PM`, body, f.name, f.email);
    setEmailSt(r.ok ? "sent" : (r.reason === "no_key" ? "no_key" : "failed"));
    setSending(false); setDone(b); setF(empty); setSelD(null);
  };

  if (ld) return <section id="book" style={s.sec}><p style={{ textAlign: "center", color: C.mt }}>Loading…</p></section>;

  return (
    <Sec id="book" title="Book Your Session" icon="📅" sub="Select a date. Tell me your challenges. I'll be notified with all details.">
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.skyPale, padding: "8px 20px", borderRadius: 20, fontSize: 15, fontWeight: 700, color: C.sky }}>🕘 Every day at 9:00 PM IST</span>
      </div>

      {done ? (
        <div style={{ ...s.card, textAlign: "center", maxWidth: 480, margin: "0 auto", padding: 32 }}>
          <span style={{ fontSize: 44 }}>✅</span>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: C.sky, marginTop: 10, marginBottom: 8 }}>Session Booked!</h3>
          <p style={s.body}><strong>{done.name}</strong> — <strong>9:00 PM IST</strong> on <strong>{done.date}</strong></p>
          {emailSt === "sent" && <div style={{ background: "#D1FAE5", color: C.ok, padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>✅ Email sent to Azad</div>}
          {emailSt === "no_key" && <div style={{ background: "#FEF3C7", color: C.warn, padding: "8px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>⚠️ Saved but email not configured yet</div>}
          {emailSt === "failed" && <div style={{ background: "#FEE2E2", color: C.err, padding: "8px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>⚠️ Saved but email failed to send</div>}
          <button style={{ ...s.btn, maxWidth: 240, margin: "0 auto" }} onClick={() => { setDone(null); setEmailSt(null); }}>Book Another</button>
        </div>
      ) : (
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Label>Select a Date</Label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {days.map(d => {
              const taken = !!bkd[`${fmtKey(d)}-9PM`];
              return (
                <button key={d.toISOString()} disabled={taken} onClick={() => setSelD(d)}
                  style={{ ...s.datePill, ...(selD && fmtKey(selD) === fmtKey(d) ? s.datePillAct : {}), ...(taken ? { opacity: 0.3, cursor: "not-allowed" } : {}) }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span style={{ fontSize: 20, fontWeight: 900 }}>{d.getDate()}</span>
                  {taken && <span style={{ fontSize: 9, color: C.err }}>Booked</span>}
                </button>
              );
            })}
          </div>

          {selD && (
            <div style={{ ...s.card, padding: 24 }}>
              <div style={{ textAlign: "center", marginBottom: 20, padding: "10px 0", background: C.skyPale, borderRadius: 10 }}>
                <p style={{ fontSize: 17, fontWeight: 800, color: C.sky }}>{fmtShort(selD)} — 9:00 PM IST</p>
              </div>

              <Label>Your Information</Label>
              <input style={s.inp} placeholder="Your name *" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
              <input style={s.inp} placeholder="Your email *" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
              <input style={s.inp} placeholder="Company (optional)" value={f.company} onChange={e => setF({ ...f, company: e.target.value })} />

              <Label>Your Role *</Label>
              <Pills options={ROLE_OPTIONS} selected={f.role} onSelect={r => setF({ ...f, role: r })} color={C.sky} />

              <Label>Department (optional)</Label>
              <Pills options={DEPARTMENT_OPTIONS} selected={f.department} onSelect={d => setF({ ...f, department: f.department === d ? "" : d })} color={C.skyLight} />

              <Label>Challenges you're facing * <span style={{ fontSize: 11, fontWeight: 400, color: C.mt }}>(select all)</span></Label>
              <Checks options={DIFFICULTY_OPTIONS} selected={f.difficulties} onToggle={v => toggle("difficulties", v)} color={C.warn} />

              <Label>What you want to solve * <span style={{ fontSize: 11, fontWeight: 400, color: C.mt }}>(select all)</span></Label>
              <Checks options={GOAL_OPTIONS} selected={f.goals} onToggle={v => toggle("goals", v)} color={C.sky} />

              <Label>Anything else? (optional)</Label>
              <textarea style={{ ...s.inp, minHeight: 70, resize: "vertical" }} placeholder="Additional context…" value={f.extra} onChange={e => setF({ ...f, extra: e.target.value })} />

              <button style={{ ...s.btn, marginTop: 6, opacity: ok ? 1 : 0.4 }} onClick={book} disabled={!ok}>
                {sending ? "Booking…" : `Confirm — 9 PM, ${fmtShort(selD)}`}
              </button>
              {!ok && !sending && <p style={{ fontSize: 12, color: C.mt, textAlign: "center", marginTop: 8 }}>Fill: name, email, role, 1+ challenge, 1+ goal</p>}
            </div>
          )}
        </div>
      )}
    </Sec>
  );
}

// ─── CONTACT ────────────────────────────────────────────────────────
function SectionContact({ pushNotif }) {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [st, setSt] = useState(null);

  const send = async () => {
    if (!f.name || !f.email || !f.message) return;
    setSt("sending");
    pushNotif({ id: uid(), type: "message", message: `Message from ${f.name}`, detail: f.message.slice(0, 80), email: f.email, time: new Date().toLocaleTimeString(), read: false });
    try { let m = []; try { const r = await storage.get("ws3-msgs"); if (r?.value) m = JSON.parse(r.value); } catch {} await storage.set("ws3-msgs", JSON.stringify([{ id: uid(), ...f, at: new Date().toISOString() }, ...m])); } catch {}
    const r = await sendEmail(`💬 Message: ${f.name} — WorkSource`, `From: ${f.name}\nEmail: ${f.email}\n\n${f.message}`, f.name, f.email);
    setSt(r.ok ? "sent" : (r.reason === "no_key" ? "no_key" : "failed"));
    setF({ name: "", email: "", message: "" });
    setTimeout(() => setSt(null), 5000);
  };

  return (
    <Sec id="contact" title="Get in Touch" icon="✉️" sub="Questions? Just reach out." alt>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, maxWidth: 600, margin: "0 auto" }}>
        <div>
          {st === "sent" && <div style={{ background: "#D1FAE5", color: C.ok, padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 13, fontWeight: 600 }}>✅ Sent! Azad will reply soon.</div>}
          {st === "no_key" && <div style={{ background: "#FEF3C7", color: C.warn, padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 13 }}>⚠️ Saved but email not configured.</div>}
          {st === "failed" && <div style={{ background: "#FEE2E2", color: C.err, padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 13 }}>⚠️ Email failed. Try direct contact below.</div>}
          <input style={s.inp} placeholder="Your name *" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
          <input style={s.inp} placeholder="Your email *" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
          <textarea style={{ ...s.inp, minHeight: 90, resize: "vertical" }} placeholder="Your message *" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} />
          <button style={{ ...s.btn, opacity: (!f.name || !f.email || !f.message || st === "sending") ? 0.4 : 1 }} onClick={send} disabled={!f.name || !f.email || !f.message || st === "sending"}>
            {st === "sending" ? "Sending…" : "Send Message"}
          </button>
        </div>
        <div style={s.card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.sky, marginBottom: 14 }}>Direct Contact</h3>
          {[{ i: "✉️", l: "Email", v: P.email }, { i: "📍", l: "Location", v: P.location }, { i: "📞", l: "Phone", v: P.phone }, { i: "🔗", l: "LinkedIn", v: "linkedin.com/in/azad-khan-8b4b47226" }].map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
              <span style={{ fontSize: 16 }}>{c.i}</span>
              <div><p style={{ fontSize: 11, color: C.mt }}>{c.l}</p><p style={{ fontSize: 14, fontWeight: 600, color: C.tx }}>{c.v}</p></div>
            </div>
          ))}
        </div>
      </div>
    </Sec>
  );
}

// ─── SMALL COMPONENTS ───────────────────────────────────────────────
function Label({ children }) { return <h3 style={{ fontSize: 13, fontWeight: 700, color: C.sky, textTransform: "uppercase", letterSpacing: 1, marginTop: 18, marginBottom: 10 }}>{children}</h3>; }

function Pills({ options, selected, onSelect, color }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
      {options.map(o => (
        <button key={o} onClick={() => onSelect(o)}
          style={{ padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${selected === o ? color : C.bdr}`, background: selected === o ? `${color}12` : C.white, color: selected === o ? color : C.mt, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Checks({ options, selected, onToggle, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
      {options.map(o => {
        const on = selected.includes(o);
        return (
          <button key={o} onClick={() => onToggle(o)}
            style={{ padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${on ? color : C.bdr}`, background: on ? `${color}10` : C.white, color: on ? color : C.txSec, fontSize: 13, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${on ? color : C.bdr}`, background: on ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.white, fontWeight: 800, flexShrink: 0 }}>
              {on ? "✓" : ""}
            </span>
            {o}
          </button>
        );
      })}
    </div>
  );
}

// ─── NOTIFICATION PANEL ─────────────────────────────────────────────
function NotifPanel({ items, setItems, open, onClose }) {
  const mark = async (id) => { const u = items.map(n => n.id === id ? { ...n, read: true } : n); setItems(u); try { await storage.set("ws3-notifs", JSON.stringify(u)); } catch {} };
  const clr = async () => { setItems([]); try { await storage.set("ws3-notifs", JSON.stringify([])); } catch {} };
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 300, display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 370, background: C.white, height: "100%", display: "flex", flexDirection: "column", borderLeft: `1px solid ${C.bdr}`, boxShadow: "-4px 0 20px rgba(0,0,0,0.1)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: `1px solid ${C.bdr}` }}>
          <h3 style={{ margin: 0, fontSize: 17, color: C.tx, fontWeight: 800 }}>Notifications</h3>
          <div style={{ display: "flex", gap: 8 }}>
            {items.length > 0 && <button onClick={clr} style={{ background: C.bg, border: "none", color: C.mt, fontSize: 12, padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>Clear</button>}
            <button onClick={onClose} style={{ background: "none", border: "none", color: C.mt, fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {items.length === 0 ? <p style={{ textAlign: "center", color: C.mt, padding: 40 }}>No notifications</p> : items.map(n => (
            <div key={n.id} onClick={() => mark(n.id)} style={{ display: "flex", gap: 12, padding: "12px 18px", borderBottom: `1px solid ${C.bdrLight}`, cursor: "pointer", background: n.read ? "transparent" : C.skyPale }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{n.type === "booking" ? "📅" : "💬"}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.tx, marginBottom: 2 }}>{n.message}</p>
                <p style={{ fontSize: 12, color: C.mt, marginBottom: 2, lineHeight: 1.4 }}>{n.detail}</p>
                <p style={{ fontSize: 11, color: C.bdr }}>{n.time}</p>
              </div>
              {!n.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.sky, flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────
const s = {
  app: { fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", background: C.bg, color: C.tx, minHeight: "100vh", lineHeight: 1.65 },

  // Nav
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.bdr}`, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" },
  navIn: { maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px" },
  logoWrap: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
  logoBox: { width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.sky}, ${C.skyLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: C.white },
  logoName: { fontSize: 18, fontWeight: 800, color: C.sky },
  navLinks: { display: "flex", gap: 2, flexWrap: "wrap" },
  navLink: { display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: C.mt, fontSize: 13, fontWeight: 500, padding: "7px 10px", cursor: "pointer", borderRadius: 8, transition: "all 0.2s" },
  navLinkActive: { color: C.sky, background: C.skyPale, fontWeight: 700 },
  ham: { display: "none", background: "none", border: "none", color: C.tx, fontSize: 24, cursor: "pointer" },
  mobMenu: { display: "flex", flexDirection: "column", padding: "6px 16px 14px", gap: 2, background: C.white },
  mobItem: { display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", color: C.txSec, fontSize: 15, padding: "10px 12px", textAlign: "left", cursor: "pointer", borderRadius: 8 },

  // Hero
  hero: { paddingTop: 100, paddingBottom: 64, textAlign: "center", background: `linear-gradient(180deg, ${C.white} 0%, ${C.bg} 100%)` },
  heroIn: { maxWidth: 720, margin: "0 auto", padding: "0 24px" },
  heroLogoBig: { width: 60, height: 60, borderRadius: 16, background: `linear-gradient(135deg, ${C.sky}, ${C.skyLight})`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 900, color: C.white, marginBottom: 10 },
  heroBrand: { fontSize: 28, fontWeight: 900, color: C.sky, letterSpacing: 1, marginBottom: 4 },
  heroSub2: { fontSize: 13, color: C.mt, marginBottom: 14 },
  h1: { fontSize: "clamp(22px,4.5vw,36px)", fontWeight: 900, color: C.tx, letterSpacing: "-0.02em", marginBottom: 12, minHeight: "1.3em" },
  heroDesc: { fontSize: 15, color: C.txSec, maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.7 },
  badge: { background: C.skyPale, color: C.sky, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 },

  // Buttons
  btn: { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "14px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.sky}, ${C.skyLight})`, color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", transition: "opacity 0.2s", gap: 6 },
  btnOut: { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "14px 28px", borderRadius: 10, border: `2px solid ${C.sky}`, background: "transparent", color: C.sky, fontSize: 15, fontWeight: 700, cursor: "pointer", gap: 6 },

  // Section
  sec: { maxWidth: 1100, margin: "0 auto", padding: "56px 24px" },
  secAlt: { background: C.white, maxWidth: "100%", borderTop: `1px solid ${C.bdrLight}`, borderBottom: `1px solid ${C.bdrLight}` },
  secHeader: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 6 },
  secIcon: { fontSize: 28 },
  secTitle: { fontSize: "clamp(22px,3vw,28px)", fontWeight: 900, color: C.tx },
  secSub: { textAlign: "center", color: C.mt, fontSize: 14, marginBottom: 28, maxWidth: 600, margin: "0 auto 28px" },
  secBody: { maxWidth: 1100, margin: "0 auto", padding: "0" },

  // Common
  body: { color: C.txSec, fontSize: 15, lineHeight: 1.75, marginBottom: 14 },
  card: { background: C.white, borderRadius: 14, padding: 22, border: `1px solid ${C.bdr}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  cardTitle: { fontSize: 15, fontWeight: 700, color: C.sky, marginBottom: 12 },
  chk: { display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start", color: C.txSec },
  chkIcon: { color: C.sky, fontWeight: 700, flexShrink: 0, fontSize: 14 },

  // Form
  inp: { display: "block", width: "100%", padding: "12px 14px", borderRadius: 8, border: `1.5px solid ${C.bdr}`, background: C.white, color: C.tx, fontSize: 14, marginBottom: 10, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  datePill: { display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${C.bdr}`, background: C.white, cursor: "pointer", color: C.mt, minWidth: 50, transition: "all 0.15s" },
  datePillAct: { background: C.skyPale, borderColor: C.sky, color: C.sky },

  // Bell
  bell: { position: "fixed", bottom: 20, right: 20, width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${C.sky}, ${C.skyLight})`, border: "none", fontSize: 22, cursor: "pointer", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px rgba(2,132,199,0.3)`, color: C.white },
  bellBadge: { position: "absolute", top: -2, right: -2, background: C.err, color: C.white, fontSize: 11, fontWeight: 800, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },

  // Footer
  footer: { textAlign: "center", padding: "36px 24px", borderTop: `1px solid ${C.bdr}`, background: C.white },
};
