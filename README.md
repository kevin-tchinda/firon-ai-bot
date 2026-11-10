# tech-job-search

A personal job-application system for technical roles in the Ottawa region and remote Canada. It combines a structured master profile of my background with a taxonomy of target job families, a matching specification, a set of resume-selection rules, and an ATS-oriented LaTeX template. The goal is repeatable, honest, tailored applications rather than one generic resume sent everywhere.

Built and maintained by [Kevin Tchinda Ndiffo](https://github.com/kevin-tchinda).

---

## What this is

A working pipeline that turns a job posting into a tailored, ATS-readable resume, with a traceability file that maps every bullet back to a source entry in a master profile.

It is intentionally manual in its current version (V1). No scraping, no automation, no API calls. Every step is executed by hand and validated before submission. Automation is deferred to V2 and documented as a backlog.

## What this is not

- Not a resume spam tool. Every application is selected against a matching specification with hard gates.
- Not a claim-mining tool. Every bullet traces to a master profile entry. Nothing is inferred into a resume that is not backed by evidence in the profile.
- Not a substitute for judgment. The matching engine classifies and scores; the human decides.

---

## Project structure

```
tech-job-search/
├── README.md                          this file
├── master-profile.md                  authoritative source of truth for all content
├── capability-matrix.csv              skills with context, proficiency, evidence basis
├── job-taxonomy.md                    target job families with inclusion rules
├── matching-spec.md                   hard gates, scoring, years classification
├── selection-rules.md                 what goes on a resume, and what does not
├── resume-template.tex                ATS-oriented LaTeX template (revision 2)
├── cover-letter-ai-role.tex           role-dependent cover letter for AI roles
├── application-log.csv                one row per submission
├── postings/                          captured job postings, one .txt per posting
├── generated/                         one .tex + .pdf + .trace.json per application
└── logs/
    └── compile.log                    timestamped compile results
```

---

## Workflow

```
1. Discover   →  search sources, capture posting to postings/<company>-<slug>.txt
2. Score      →  apply matching-spec.md: Layer 1 gates, Layer 2 gating,
                 Layer 2.1 years classification, Layer 3 fit_score,
                 Layer 4 coverage
3. Decide     →  Priority / Apply / Stretch / Skip
4. Generate   →  select family + tailoring intensity, build resume
                 from master-profile.md using selection-rules.md
5. Compile    →  pdflatex generated/<company>-<role>.tex
6. Validate   →  ATS extraction test + visual review
7. Submit     →  apply through posting URL, log to application-log.csv
8. Track      →  follow-up reminders, response pattern analysis
```

---

## File-by-file summary

### `master-profile.md`

The only source of resume content. Education, employment, projects, technical skills, certifications, soft skills, domain knowledge. Each entry is dated, located, and verifiable. If something is not in this file, it does not go on a resume.

### `capability-matrix.csv`

Every skill with four attributes:

- **Context:** `P` professional, `A` academic, `Pr` project, `Cert`, `Life`
- **Proficiency:** `E` expert, `S` strong, `W` working, `B` basic, `NR` not recorded
- **Evidence basis:** `cited` (directly demonstrated in a named deliverable) or `inferred` (indirectly demonstrated across multiple items)
- **Confidence:** `high`, `medium`, `low`

The matching engine uses this matrix to distinguish "used TensorFlow in a job" from "studied TensorFlow in a course." Those are not equivalent and are not treated as equivalent.

### `job-taxonomy.md`

Target job families, organized in three tiers:

- **Tier A** — direct professional evidence
- **Tier B** — strong evidence, mixed context
- **Tier C** — plausible but evidence-thin

Each family has hard-gate keywords, supporting evidence, and known gaps. Exclusion rules cover clearance, regulated titles, offensive security, and language mismatches.

### `matching-spec.md`

The scoring logic. Four layers:

1. Hard gates (pass/fail)
2. Experience-type gating (professional vs. project vs. academic)
3. Weighted scoring with context multipliers, proficiency scores, and evidence penalties
4. Coverage diagnostic

Years-of-experience requirements are classified (firm / standard / soft / unspecified) and treated as risk factors, not hard gates. The specification forbids computing a total-years figure, because a total invites arithmetic against a visible timeline containing student periods.

### `selection-rules.md`

What appears on a resume and in what order. Composition rules, inclusion rules, exclusion rules, bullet construction rules, keyword policy, length policy, tailoring intensity levels, and traceability requirements.

Two rules worth highlighting:

- **No total years-of-experience figure anywhere.** Continuous practice may be expressed as a start year ("since 2016") but never as a total.
- **Distinction appears once**, in the education line only.

### `resume-template.tex`

Single column, Latin Modern with T1 encoding, no tables for content, no images, no icons. Dates sit beside titles rather than pushed to the right margin, because right-margin content is dropped by many text extractors.

The template was validated by extracting the text layer and confirming every date and section header survives. "Looks fine in the viewer" is not the test; text extraction is the test.

### `cover-letter-ai-role.tex`

Role-dependent, not posting-dependent. Three macros at the top are changed per application (`\CompanyName`, `\RoleTitle`, `\HiringTeam`). The body stays fixed for the AI role family. Best used for volume applications and unsolicited approaches; tailored letters are still preferred for high-priority postings.

### `application-log.csv`

One row per submission:

```
company, role_title, family_id, url, location, arrangement, posted_date,
seniority, salary, fit_score, status, resume_file, applied_date,
follow_up_date, notes
```

### `postings/`

One `.txt` file per captured posting, named `<company>-<role-slug>.txt`. Header block with metadata, then the posting body verbatim. Saved because postings close and URLs rot; the saved file is the permanent record of what was applied to.

### `generated/`

Per application:

- `<slug>.tex` — the source
- `<slug>.pdf` — the compiled output
- `<slug>.trace.json` — internal, not distributed; maps every bullet to a master profile ID, records the fit score, coverage, tailoring intensity, and any rule overrides applied

The trace is the anti-fabrication mechanism. It also enables post-hoc analysis: if a resume leads to an interview, the trace shows what it contained; if it does not, the trace shows what it lacked.

---

## Design principles

**1. Honesty over volume.** A bullet that cannot be traced is removed. A years-of-experience total that invites scrutiny is removed. A brand that did not work out is recorded in the profile and not surfaced on a resume.

**2. Distinguish contexts.** Professional, project, academic, and self-directed experience are not the same. The matching engine treats them differently.

**3. Traceability.** Every generated resume ships with a trace file. If a claim cannot be mapped back, it does not belong.

**4. ATS-first, then human.** Text extraction is tested before visual appeal. A beautiful resume that a parser scrambles is a failed resume.

**5. Single-pass approval.** Each step is approved once. Refinements go to a backlog rather than reopening approved steps.

---

## V1 status and V2 backlog

**V1 is manual.** Every step is executed by hand. Validation is manual. Compilation is local `pdflatex`. Submission is manual.

**V2 will automate** the highest-friction steps, in this order:

1. Posting capture and extraction
2. Matching and scoring
3. Resume selection and generation
4. Compilation via the LaTeX Online API
5. Application tracking dashboard

Each item is documented in the project's V2 backlog, with the reason it was deferred.

---

## Requirements

- **LaTeX:** TeX Live 2016 or later, with `pdflatex`, `lmodern`, `titlesec`, `enumitem`, `hyperref`, `needspace`.
- **Fonts:** Latin Modern, T1 encoding (bundled with TeX Live).
- **Optional:** `pdftotext` (poppler-utils) for automated extraction testing.

No Python, no Node, no Docker in V1. Those enter in V2.

---

## Usage

```bash
# 1. Create a posting capture file
cp postings/_template.txt postings/acme-ml-engineer.txt
# fill in the header block and paste the posting body verbatim

# 2. Score the posting against matching-spec.md
#    (manual in V1, produces fit_score and verdict)

# 3. If verdict is Priority or Apply, generate a resume
cp resume-template.tex generated/acme-ml-engineer.tex
# fill in the tailored content per selection-rules.md

# 4. Compile
cd generated && pdflatex acme-ml-engineer.tex

# 5. Validate — extraction test
pdftotext acme-ml-engineer.pdf - | less
# confirm dates, section headers, and bullet content survive extraction

# 6. Submit and log
# append a row to application-log.csv
```

---

## What is deliberately excluded

- High school education
- Tutoring and barbering from earlier years
- Metasploit and offensive security tools (blue team orientation only)
- Total years-of-experience claims
- A dormant freelance brand ("Kev's Standard AI agentic services") — preserved in the master profile for reference, not surfaced on resumes

These exclusions are not losses. They are the result of deciding what signal each one actually carries versus what risk it introduces.

---

## License

Personal project. No license granted for reuse. The matching specification, selection rules, and resume template are shared publicly as a reference; reuse is welcome with attribution.

---

## Contact

Kevin Tchinda Ndiffo
Ottawa, Ontario, Canada
[linkedin.com/in/kevinntchinda](https://linkedin.com/in/kevinntchinda)
[github.com/kevin-tchinda](https://github.com/kevin-tchinda)
[kevin-tchinda.github.io](https://kevin-tchinda.github.io)
