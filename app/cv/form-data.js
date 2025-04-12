const transformFormData = (formData) => {
  const contactInfo = {
    name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
    location: formData.cityOrState || '',
    email: formData.emailAddress || '',
    phone: formData.phoneNumber || ''
  }

  const education = []

  if (formData.ugUniveristy) {
    education.push({
      institution: formData.ugUniveristy,
      location: formData.ugCityOrState || '',
      degree: formData.ugDegree || '',
      gpa: formData.ugGrade || '',
      graduationDate: formData.ugGraduationYear || '',
      thesis: formData.ugDissertationTitle || ''
    })
  }

  if (formData.pgUniversity) {
    education.push({
      institution: formData.pgUniversity,
      location: formData.pgCityOrState || '',
      degree: formData.pgDegree || '',
      gpa: formData.pgGrade || '',
      graduationDate: formData.pgGraduationYear || '',
      thesis: formData.pgDissertationTitle || ''
    })
  }

  let studyAbroad = null
  if (formData.exchangeUniversity) {
    studyAbroad = {
      location: `${formData.exchangeUniversity}, ${formData.exchangeCityOrState || ''}`,
      program: formData.exchangeDegreeProgramme || '',
      dates: formData.exchangeYear || ''
    }
  }

  let highSchool = null
  if (formData.highSchool) {
    highSchool = {
      name: formData.highSchool,
      location: '', // Not directly in your form
      details: '', // Not in your form
      graduationDate: formData.highSchoolGraduationYear || ''
    }
  }

  const experience = []

  if (formData.jobTitle1) {
    experience.push({
      organization: formData.jobCompany1 || '',
      location: '', // Not directly in your form
      position: formData.jobTitle1,
      dates: `${formData.jobStart1 || ''} - ${formData.jobEnd1 || ''}`,
      bullets: formData.jobSummary1 ? formData.jobSummary1.split('\n') : []
    })
  }

  if (formData.jobTitle2) {
    experience.push({
      organization: formData.jobCompany2 || '',
      location: '', // Not directly in your form
      position: formData.jobTitle2,
      dates: `${formData.jobStart2 || ''} - ${formData.jobEnd2 || ''}`,
      bullets: formData.jobSummary2 ? formData.jobSummary2.split('\n') : []
    })
  }

  if (formData.jobTitle3) {
    experience.push({
      organization: formData.jobCompany3 || '',
      location: '', // Not directly in your form
      position: formData.jobTitle3,
      dates: `${formData.jobStart3 || ''} - ${formData.jobEnd3 || ''}`,
      bullets: formData.jobSummary3 ? formData.jobSummary3.split('\n') : []
    })
  }

  let skills = null
  const interests = []

  for (let i = 1; i <= 6; i++) {
    const interest = formData[`interest${i}`]
    if (interest) {
      interests.push(interest)
    }
  }

  if (interests.length > 0) {
    skills = {
      interests: interests.join(', ')
    }
  }

  const activities = []

  return {
    contactInfo,
    education,
    studyAbroad,
    highSchool,
    experience,
    activities,
    skills
  }
}

export { transformFormData }
