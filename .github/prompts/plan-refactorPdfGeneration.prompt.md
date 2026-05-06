## Plan: Refactor PDF Generation to Match Word Structure

**TL;DR**: Extract the ~90 lines of monolithic PDF generation logic from `app/routes/submit.js` into modular section builders and an orchestrator, mirroring your refactored Word pattern. Result: cleaner codebase, consistent patterns across both formats.

---

## Implementation Phases

### **Phase 1: Create Shared Helpers** (1 file)
- **`app/cv/pdf/utils.js`** — Extract `addSectionTitle()` and `addEntry()` functions from submit.js (lines 32–38)
  - These are reused across 5 sections; mirrors `app/cv/word/utils.js`

### **Phase 2: Create Section Builders** (5 files, can run in parallel)
Each takes signature `(doc, formData)` and renders to the PDFDocument:

- **`app/cv/pdf/sections/header.js`** — Name, horizontal line, contact info (submit.js lines 41–52)
- **`app/cv/pdf/sections/education.js`** — UG, PG, exchange, high school entries (lines 56–84)
- **`app/cv/pdf/sections/experience.js`** — 3 jobs with titles, dates, bullet summaries (lines 87–103)
- **`app/cv/pdf/sections/projects.js`** — 3 projects with URLs and bullets (lines 106–127)
- **`app/cv/pdf/sections/interests.js`** — 6 interests as bullets (lines 130–139)

### **Phase 3: Create Orchestrator** (1 file, *depends on Phases 1 & 2*)
- **Rewrite `app/cv/generate/pdf.js`** — New `generatePdf(formData, res)` function that:
  - Validates formData, creates PDFDocument, sets headers
  - Calls all 5 section builders in sequence
  - Ends document and sends response
  - Includes try/catch error handling (mirrors `app/cv/generate/word.js`)

### **Phase 4: Simplify Route** (*depends on Phase 3*)
- **Modify `app/routes/submit.js`**:
  - Remove `/generate-pdf` route's ~90 lines of inline logic
  - Replace with: `router.get('/generate-pdf', (req, res) => generatePdf(formData, res))`
  - Update imports: remove `PDFDocument`, add `generatePdf`

---

## Key Code Examples

**New `app/cv/generate/pdf.js` (orchestrator)**
```javascript
import PDFDocument from 'pdfkit'
import { createHeader } from '../pdf/sections/header.js'
import { createEducation } from '../pdf/sections/education.js'
import { createExperience } from '../pdf/sections/experience.js'
import { createProjects } from '../pdf/sections/projects.js'
import { createInterests } from '../pdf/sections/interests.js'

export const generatePdf = (formData, res) => {
  if (!formData) {
    return res.status(400).send('No data to generate PDF')
  }

  try {
    const doc = new PDFDocument({ margin: 40 })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf')
    doc.pipe(res)

    createHeader(doc, formData)
    createEducation(doc, formData)
    createExperience(doc, formData)
    createProjects(doc, formData)
    createInterests(doc, formData)

    doc.end()
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).send('Failed to generate PDF')
  }
}
```

**New `app/cv/pdf/utils.js` (helpers)**
```javascript
export const addSectionTitle = (doc, title) => {
  doc.moveDown(1).fontSize(14).font('Times-Bold').text(title, { align: 'center' }).moveDown(0.5)
}

export const addEntry = (doc, lines = []) => {
  lines.forEach(line => {
    if (line) doc.fontSize(11).font('Times-Roman').text(line)
  })
  doc.moveDown(0.5)
}
```

**Section builder example (`app/cv/pdf/sections/header.js`)**
```javascript
import { addEntry } from '../utils.js'

export const createHeader = (doc, formData) => {
  doc.fontSize(18).font('Times-Bold').text(`${formData.firstName} ${formData.lastName}`, { align: 'center' })
  doc.moveDown(0.5)
  doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).stroke()
  doc.moveDown(0.5)
  
  const city = formData.city || ''
  const country = formData.country || ''
  const location = city + (country ? `, ${country}` : '')
  const contact = [location, formData.emailAddress, `${formData.callingCode || ''} ${formData.phoneNumber}`].filter(Boolean).join(' • ')
  doc.fontSize(11).font('Times-Roman').text(contact, { align: 'center' })
  doc.moveDown(1)
}
```

**Simplified route (`app/routes/submit.js`)**
```javascript
import express from 'express'
import { generateWordDoc } from '../cv/generate/word.js'
import { generatePdf } from '../cv/generate/pdf.js'  // ← add this

// ...existing code...

router.get('/generate-pdf', (req, res) => {
  generatePdf(formData, res)
})
```

---

## Verification Steps

1. ✅ All new files create valid ES6 modules with correct imports
2. ✅ Generate a PDF with complete test data — verify all sections render
3. ✅ Compare new PDF output with current output (should be identical)
4. ✅ Verify route simplification: submit.js `/generate-pdf` goes from ~90 to ~3 lines
5. ✅ Test error case: call `/generate-pdf` with no formData, expect 400 response

---

## Full Code for Each Section File

### `app/cv/pdf/sections/header.js`
```javascript
export const createHeader = (doc, formData) => {
  doc.fontSize(18).font('Times-Bold').text(`${formData.firstName} ${formData.lastName}`, { align: 'center' })
  doc.moveDown(0.5)
  doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).stroke()
  doc.moveDown(0.5)
  
  const city = formData.city || ''
  const country = formData.country || ''
  const location = city + (country ? `, ${country}` : '')
  const contact = [location, formData.emailAddress, `${formData.callingCode || ''} ${formData.phoneNumber}`].filter(Boolean).join(' • ')
  doc.fontSize(11).font('Times-Roman').text(contact, { align: 'center' })
  doc.moveDown(1)
}
```

### `app/cv/pdf/sections/education.js`
```javascript
import { addSectionTitle, addEntry } from '../utils.js'

export const createEducation = (doc, formData) => {
  addSectionTitle(doc, 'Education')
  
  if (formData.ugUniversity) {
    addEntry(doc, [
      `${formData.ugUniversity} (${formData.ugLocation})`,
      `${formData.ugDegree} • Graduation: ${formData.ugGraduationYear}`,
      formData.ugDissertationTitle && `Thesis: ${formData.ugDissertationTitle}`,
      formData.ugGrade && `Grade: ${formData.ugGrade}`
    ])
  }
  
  if (formData.pgUniversity) {
    addEntry(doc, [
      `${formData.pgUniversity} (${formData.pgCityOrState})`,
      `${formData.pgDegree} • Graduation: ${formData.pgGraduationYear}`,
      formData.pgDissertationTitle && `Thesis: ${formData.pgDissertationTitle}`,
      formData.pgGrade && `Grade: ${formData.pgGrade}`
    ])
  }
  
  if (formData.exchangeUniversity) {
    addEntry(doc, [
      `Study Abroad: ${formData.exchangeUniversity} (${formData.exchangeCityOrState})`,
      `${formData.exchangeDegreeProgramme} • ${formData.exchangeYear}`
    ])
  }
  
  if (formData.highSchool) {
    addEntry(doc, [
      `${formData.highSchool} • Graduation: ${formData.hsGraduationYear}`
    ])
  }
}
```

### `app/cv/pdf/sections/experience.js`
```javascript
import { addSectionTitle } from '../utils.js'

export const createExperience = (doc, formData) => {
  addSectionTitle(doc, 'Experience')
  
  for (let i = 1; i <= 3; i++) {
    const jobTitle = formData[`jobTitle${i}`]
    const jobCompany = formData[`jobCompany${i}`]
    const jobStart = formData[`jobStart${i}`]
    const jobEnd = formData[`jobEnd${i}`]
    const jobSummary = formData[`jobSummary${i}`]
    
    if (jobTitle) {
      doc.fontSize(11).font('Times-Bold').text(`${jobCompany} (${jobStart} – ${jobEnd})`)
      doc.fontSize(11).font('Times-Roman').text(jobTitle)
      
      if (jobSummary) {
        const lines = jobSummary.split('\n').filter(line => line.trim())
        doc.moveDown(0.2)
        lines.forEach(line => {
          doc.circle(doc.x - 5, doc.y + 4, 1).fill().text(`  ${line}`, { continued: false }).fillColor('black')
        })
        doc.moveDown(0.5)
      }
    }
  }
}
```

### `app/cv/pdf/sections/projects.js`
```javascript
import { addSectionTitle } from '../utils.js'

export const createProjects = (doc, formData) => {
  if (formData.projectTitle1 || formData.projectTitle2 || formData.projectTitle3) {
    addSectionTitle(doc, 'Projects')
    
    for (let i = 1; i <= 3; i++) {
      const title = formData[`projectTitle${i}`]
      const url = formData[`projectUrl${i}`]
      const summary = formData[`projectSummary${i}`]
      
      if (title) {
        doc.fontSize(11).font('Times-Bold').text(title, { continued: true })
        
        if (url) {
          doc.fontSize(11).font('Times-Roman').text(` (${url})`, { link: url, underline: true, continued: false })
        } else {
          doc.text('', { continued: false })
        }
        
        if (summary) {
          const lines = summary.split('\n').filter(line => line.trim())
          lines.forEach(line => {
            doc.circle(doc.x - 5, doc.y + 4, 1).fill().text(`  ${line}`, { continued: false }).fillColor('black')
          })
          doc.moveDown(0.5)
        }
      }
    }
  }
}
```

### `app/cv/pdf/sections/interests.js`
```javascript
import { addSectionTitle } from '../utils.js'

export const createInterests = (doc, formData) => {
  addSectionTitle(doc, 'Skills & Interests')
  
  const interests = []
  for (let i = 1; i <= 6; i++) {
    if (formData[`interest${i}`]) {
      interests.push(formData[`interest${i}`])
    }
  }
  
  if (interests.length) {
    interests.forEach(item => {
      doc.circle(doc.x - 5, doc.y + 4, 1).fill().text(`  ${item}`, { continued: false }).fillColor('black')
    })
  }
}
```

---

## Summary of Changes

| Action | File | Details |
|--------|------|---------|
| Create | `app/cv/pdf/utils.js` | Extract `addSectionTitle()` and `addEntry()` helpers |
| Create | `app/cv/pdf/sections/header.js` | Header with name, line, contact info |
| Create | `app/cv/pdf/sections/education.js` | Education section builder |
| Create | `app/cv/pdf/sections/experience.js` | Experience section builder |
| Create | `app/cv/pdf/sections/projects.js` | Projects section builder |
| Create | `app/cv/pdf/sections/interests.js` | Interests section builder |
| Rewrite | `app/cv/generate/pdf.js` | New orchestrator function `generatePdf()` |
| Modify | `app/routes/submit.js` | Simplify route, update imports |

---

## Next Steps

1. Review this plan for accuracy and completeness
2. Refine any section builders as needed
3. Execute all file creations and modifications
4. Test PDF generation to verify output matches original
5. Optionally add unit tests for each section builder
