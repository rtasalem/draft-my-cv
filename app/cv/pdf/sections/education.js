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
