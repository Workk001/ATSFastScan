import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const articles = [
  {
    slug: "ats-friendly-resume-guide-2026",
    title: "How to Make Your Resume ATS-Friendly (2026 Guide)",
    excerpt: "A comprehensive guide to formatting, keywords, and structure that gets your resume past automated screening systems.",
    date: "Mar 25, 2026",
    readTime: "8 min read",
    category: "Guide",
    content: `
## What Is an ATS-Friendly Resume?

An ATS-friendly resume is one that can be accurately read and parsed by Applicant Tracking Systems — the software that 99% of large companies use to filter resumes before a human ever sees them. If your resume isn't ATS-compatible, it gets auto-rejected regardless of your qualifications.

## Why Most Resumes Fail ATS Scans

Most resumes fail because of **formatting**, not content. Common killers include:

- **Tables and columns** — ATS reads left-to-right, top-to-bottom. Multi-column layouts scramble your information.
- **Headers and footers** — Many ATS systems skip these entirely. If your name or contact info is in a header, it may be lost.
- **Graphics, icons, and images** — ATS cannot read images. That skill bar chart? Invisible.
- **Fancy fonts and special characters** — Stick to standard fonts like Arial, Calibri, or Times New Roman.
- **PDF issues** — Some PDFs are image-based (scanned documents). Always use text-based PDFs.

## The ATS-Friendly Resume Checklist

### 1. Use a Simple, Single-Column Layout
One column. No tables. No text boxes. Standard section headings: "Experience", "Education", "Skills".

### 2. Use Standard Section Headings
ATS looks for specific headings. Use these exact words:
- **Work Experience** (not "Career Journey" or "Where I've Been")
- **Education** (not "Academic Background")
- **Skills** (not "What I'm Good At")
- **Contact Information**

### 3. Include Keywords from the Job Description
Read the job posting carefully. If it says "project management", use those exact words — don't say "managed projects" and hope the ATS connects them. Match the language precisely.

### 4. Use a Standard File Format
Submit as .docx unless the posting specifically asks for PDF. DOCX is the most reliably parsed format across all ATS systems.

### 5. Put Contact Info in the Body
Don't put your name, email, or phone in a header/footer. Put it at the top of the document body.

## How to Test Your Resume

The fastest way is to use a tool like [ATS FastScan](/upload) that shows you exactly what an ATS sees when it reads your resume. Upload your file, get a score, and see specific issues to fix.

## Final Tip

ATS optimization isn't about gaming the system — it's about clear, structured communication. A well-formatted resume is easier for both machines AND humans to read.
    `,
  },
  {
    slug: "resume-mistakes-that-get-rejected",
    title: "Top 10 Resume Mistakes That Get You Rejected",
    excerpt: "The most common resume mistakes that cause automatic rejections — and exactly how to fix each one.",
    date: "Mar 20, 2026",
    readTime: "6 min read",
    category: "Tips",
    content: `
## 1. Using a Non-Standard File Format

Submitting a .pages, .odt, or image-based PDF guarantees rejection. Stick to .docx or text-based .pdf files.

## 2. Including a Photo

In many countries (especially the US), photos trigger bias concerns and are auto-flagged. In most ATS systems, the photo is simply stripped, wasting valuable space.

## 3. Missing Keywords

If the job description mentions "Python" 5 times and you never mention it, the ATS scores you low — even if you've used Python for 10 years. Mirror the job description's language.

## 4. Using Tables or Multi-Column Layouts

ATS reads sequentially. Tables break the reading order. Your "Skills" column might merge with your "Experience" column into gibberish.

## 5. Vague Descriptions

"Responsible for team activities" tells nothing. Use quantified achievements: "Led 8-person team, delivering project 2 weeks ahead of schedule, saving $50K."

## 6. Typos and Grammar Errors

ATS won't catch these, but recruiters will — in the 6 seconds they spend on your resume. One typo = reject for competitive roles.

## 7. Too Long or Too Short

Freshers: 1 page max. Experienced (5+ years): 2 pages max. Executives: 2-3 pages. Nobody reads page 4.

## 8. No Contact Information (or Wrong Info)

Sounds obvious, but 12% of resumes have missing or incorrect contact details. Double-check your email and phone.

## 9. Irrelevant Information

Your high school achievements don't matter if you have a master's degree. Hobbies only matter if they're relevant (e.g., "competitive programming" for a dev role).

## 10. Not Tailoring to the Job

Sending the same generic resume to 50 jobs is the #1 reason for rejection. Each application needs keyword and content adjustments.

---

**Fix all of these in minutes:** [Scan your resume with ATS FastScan](/upload) and get a detailed report on exactly what to change.
    `,
  },
  {
    slug: "best-resume-format-freshers",
    title: "Best Resume Format for Freshers & Campus Placements",
    excerpt: "The optimal resume structure for students and fresh graduates applying through campus placement drives.",
    date: "Mar 15, 2026",
    readTime: "7 min read",
    category: "Students",
    content: `
## The Fresher's Resume Problem

As a fresher, you face a unique challenge: you need a job to get experience, but you need experience to get a job. Your resume format can bridge this gap.

## The Ideal Format for Freshers

Use this exact order:

### 1. Contact Information
Name, email, phone, LinkedIn URL, city. No photo. No "Objective" statement — replace it with a **Professional Summary** (2 lines max).

**Example Summary:**
"B.Tech Computer Science graduate (8.2 CGPA) with hands-on experience in React and Node.js through 3 academic projects and a 2-month internship at [Company]."

### 2. Education
For freshers, education comes BEFORE experience. Include:
- Degree, University, Year
- CGPA/Percentage (only if above 7.0/70%)
- Relevant coursework (3-5 courses max)

### 3. Projects (This Is Your Experience)
This is the most important section for freshers. Format each project like a job:
- **Project Name** | Technologies Used
- 2-3 bullet points with what you built and the impact
- Include links to GitHub repos or live demos

**Example:**
"**E-Commerce Platform** | React, Node.js, MongoDB
- Built full-stack shopping platform with payment integration, serving 200+ test users
- Implemented search with filters, reducing product discovery time by 40%"

### 4. Skills
List technical skills that match the job description. Group them:
- **Languages:** Python, JavaScript, Java
- **Frameworks:** React, Express.js
- **Tools:** Git, Docker, VS Code

### 5. Internships / Experience
Even 1-month internships count. Format like:
- Company, Role, Duration
- 2 bullet points with achievements

### 6. Certifications & Achievements
- Online certifications (Coursera, Udemy — only relevant ones)
- Hackathon wins, coding contest rankings
- Paper publications

## Campus Placement Specific Tips

- **Keep it to 1 page.** Recruiters at placement drives review 200+ resumes in a day.
- **Use the college template if provided**, but check it's ATS-compatible.
- **Include your roll number** if the company requires it.
- **Match keywords from the Job Description** — campus JDs are usually available in advance.

## Check Your Resume Before the Drive

Don't wait until the last minute. [Run your resume through ATS FastScan](/upload) to catch formatting issues and missing keywords before your campus placement drive.
    `,
  },
  {
    slug: "what-is-ats-how-does-it-work",
    title: "What Is ATS and How Does It Work?",
    excerpt: "Everything you need to know about Applicant Tracking Systems — the gatekeepers between your resume and the recruiter.",
    date: "Mar 10, 2026",
    readTime: "5 min read",
    category: "Education",
    content: `
## What Is an ATS?

An **Applicant Tracking System (ATS)** is software used by companies to manage job applications. It collects, sorts, scans, and ranks resumes — all before a human recruiter sees them.

**75% of resumes are rejected by ATS before a human ever reads them.**

## How Does ATS Work?

### Step 1: Parsing
When you submit your resume, the ATS extracts text and organizes it into fields: name, email, work experience, education, skills. If your formatting is complex (tables, images, fancy layouts), the parser fails and your data gets scrambled.

### Step 2: Keyword Matching
The ATS compares your resume content against the job description. It looks for:
- **Hard skills** (Python, Excel, SQL)
- **Job titles** (Software Engineer, Data Analyst)
- **Certifications** (PMP, AWS Certified)
- **Education requirements** (B.Tech, MBA)

### Step 3: Ranking
Based on keyword matches and other criteria, the ATS assigns a score. Only top-scoring resumes get forwarded to the recruiter. Some systems use a simple percentage match; others use weighted scoring.

### Step 4: Recruiter Review
The recruiter sees your resume within the ATS interface — often a plain-text version, not your beautifully designed PDF. This is why clean formatting matters more than pretty design.

## Popular ATS Systems

- **Workday** — Used by Fortune 500 companies
- **Greenhouse** — Popular with tech startups
- **Lever** — Common in mid-size companies
- **Taleo** (Oracle) — Used by large enterprises
- **iCIMS** — Healthcare and retail sectors

Each parses resumes slightly differently, which is why the safest approach is to use a simple, standard format.

## How to Beat ATS (Ethically)

1. **Use standard formatting** — no tables, no images, no headers/footers
2. **Mirror the job description keywords** — exact matches matter
3. **Use a standard font** — Arial, Calibri, or Times New Roman
4. **Submit .docx when possible** — it's the most reliably parsed format
5. **Test your resume** — use [ATS FastScan](/upload) to see exactly how an ATS reads your resume

## The Bottom Line

ATS isn't your enemy — it's a filter. Understanding how it works lets you format your resume so it passes through cleanly to the recruiter. The goal is simple: make your resume machine-readable AND human-impressive.
    `,
  },
];

const Blog = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog – ATS & Resume Insights | ATS FastScan</title>
        <meta name="description" content="Articles on ATS systems, resume optimization, and job application strategies for Naukri, LinkedIn, and Indian employers." />
        <link rel="canonical" href="https://www.atsfastscan.com/blog" />
      </Helmet>
      <main className="pt-24 sm:pt-28 lg:pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              Blog
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              ATS Resume Guides &{" "}
              <span className="text-primary">Tips</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Practical, in-depth guides to help students, freshers, and job seekers build resumes that pass ATS and impress recruiters.
            </p>
          </div>
        </section>

        {/* Blog Cards Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6">
              {articles.map((post) => (
                <a
                  key={post.slug}
                  href={`#${post.slug}`}
                  className="group bg-card/30 rounded-2xl border border-border/50 p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Full Articles */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-20">
            {articles.map((article) => (
              <article
                key={article.slug}
                id={article.slug}
                className="scroll-mt-28"
              >
                <div className="mb-6">
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">
                    {article.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 mb-2">
                    {article.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                <div className="prose prose-sm sm:prose-base prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-li:text-muted-foreground prose-ul:text-muted-foreground">
                  {article.content.split('\n').map((line, i) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;
                    if (trimmed.startsWith('## ')) return <h2 key={i}>{trimmed.slice(3)}</h2>;
                    if (trimmed.startsWith('### ')) return <h3 key={i}>{trimmed.slice(4)}</h3>;
                    if (trimmed.startsWith('- **')) {
                      const match = trimmed.match(/^- \*\*(.+?)\*\*\s*[-—]?\s*(.*)/);
                      if (match) return <li key={i}><strong>{match[1]}</strong>{match[2] ? ` — ${match[2]}` : ''}</li>;
                    }
                    if (trimmed.startsWith('- ')) return <li key={i}>{trimmed.slice(2)}</li>;
                    if (trimmed.startsWith('---')) return <hr key={i} />;
                    if (trimmed.startsWith('**') && trimmed.endsWith('**')) return <p key={i}><strong>{trimmed.slice(2, -2)}</strong></p>;
                    // Handle inline links
                    const withLinks = trimmed.replace(
                      /\[([^\]]+)\]\(([^)]+)\)/g,
                      '<a href="$2" class="text-primary hover:underline">$1</a>'
                    );
                    if (withLinks.startsWith('"')) return <blockquote key={i} dangerouslySetInnerHTML={{ __html: withLinks }} />;
                    return <p key={i} dangerouslySetInnerHTML={{ __html: withLinks }} />;
                  })}
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
                  <p className="text-sm text-muted-foreground mb-3">Ready to check your resume?</p>
                  <Link
                    to="/upload"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                  >
                    Scan your resume for free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
