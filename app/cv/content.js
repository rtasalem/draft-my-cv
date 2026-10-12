// Layout-neutral CV content shared by the PDF and Word generators.
// Each entry has `lines` and optional `bullets`. Line types:
//   { type: 'row', left, right, bold } - left text (bold if set) with right-aligned text
//   { type: 'text', text }
//   { type: 'link', text, url }
//   { type: 'labelled', label, text }

const splitLines = (text = '') => text
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(Boolean)

const toHref = (url) => /^https?:\/\//i.test(url) ? url : `https://${url}`

const section = (title, entries) => entries.length ? { title, entries } : null

export const buildHeader = (formData) => {
  const location = [formData.city, formData.country].filter(Boolean).join(', ')
  const phone = formData.phoneNumber
    ? [formData.callingCode, formData.phoneNumber].filter(Boolean).join(' ')
    : ''

  return {
    name: [formData.firstName, formData.lastName].filter(Boolean).join(' '),
    contact: [location, formData.emailAddress, phone].filter(Boolean).join(' • ')
  }
}

const buildDegree = (university, cityOrState, degree, grade, year, dissertation) => {
  const lines = [
    { type: 'row', left: university, right: cityOrState || '', bold: true },
    { type: 'row', left: [degree, grade && `Grade: ${grade}`].filter(Boolean).join('. '), right: year || '' }
  ]
  if (dissertation) lines.push({ type: 'text', text: `Dissertation: ${dissertation}` })
  return { lines }
}

export const buildEducation = (formData) => {
  const entries = []

  if (formData.pgUniversity) {
    entries.push(buildDegree(formData.pgUniversity, formData.pgCityOrState, formData.pgDegree, formData.pgGrade, formData.pgGraduationYear, formData.pgDissertationTitle))
  }

  if (formData.ugUniversity) {
    entries.push(buildDegree(formData.ugUniversity, formData.ugCityOrState, formData.ugDegree, formData.ugGrade, formData.ugGraduationYear, formData.ugDissertationTitle))
  }

  if (formData.exchangeUniversity) {
    entries.push({
      lines: [
        { type: 'row', left: formData.exchangeUniversity, right: formData.exchangeCityOrState || '', bold: true },
        { type: 'row', left: formData.exchangeDegreeProgramme || '', right: formData.exchangeYear || '' }
      ]
    })
  }

  if (formData.highSchool) {
    entries.push({
      lines: [{ type: 'row', left: formData.highSchool, right: formData.hsGraduationYear || '', bold: true }]
    })
  }

  return section('Education', entries)
}

export const buildExperience = (formData) => {
  const entries = []

  for (let i = 1; i <= 3; i++) {
    const company = formData[`jobCompany${i}`]
    const title = formData[`jobTitle${i}`]
    if (!company && !title) continue

    const start = formData[`jobStart${i}`]
    const end = formData[`jobEnd${i}`] || 'Present'
    const lines = []
    if (company) lines.push({ type: 'row', left: company, right: '', bold: true })
    lines.push({ type: 'row', left: title || '', right: start ? `${start} – ${end}` : '', bold: true })

    entries.push({ lines, bullets: splitLines(formData[`jobSummary${i}`]) })
  }

  return section('Experience', entries)
}

export const buildProjects = (formData) => {
  const entries = []

  for (let i = 1; i <= 3; i++) {
    const title = formData[`projectTitle${i}`]
    if (!title) continue

    const url = formData[`projectUrl${i}`]
    const lines = [{ type: 'row', left: title, right: '', bold: true }]
    if (url) lines.push({ type: 'link', text: url, url: toHref(url) })

    entries.push({ lines, bullets: splitLines(formData[`projectSummary${i}`]) })
  }

  return section('Projects', entries)
}

export const buildSkillsAndInterests = (formData) => {
  const lines = [
    { type: 'labelled', label: 'Technical', text: formData.technicalSkills },
    { type: 'labelled', label: 'Language', text: formData.languageSkills },
    { type: 'labelled', label: 'Laboratory', text: formData.laboratorySkills },
    { type: 'labelled', label: 'Interests', text: formData.interests }
  ].filter(line => line.text)

  return section('Skills & Interests', lines.length ? [{ lines }] : [])
}
