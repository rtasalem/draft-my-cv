export const prepareTemplateData = (formData) => {
  const personalInformation = {
    fullName: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
    location: formData.location || '',
    country: formData.country || '',
    emailAddress: formData.emailAddress || '',
    phoneNumber: `${formData.callingCode || ''} ${formData.phoneNumber || ''}`.trim()
  }

  const education = []

  if (formData.undergraduate) {
    education.push({
      university: formData.univeristy,
      location: formData.location || '',
      degree: formData.degree || '',
      graduationDate: formData.graduationDate || '',
      dissertationTitle: formData.dissertationTitle || '',
      grade: formData.grade || ''
    })
  }

  if (formData.postgraduate) {
    education.push({
      university: formData.univeristy,
      location: formData.location || '',
      degree: formData.degree || '',
      graduationDate: formData.graduationDate || '',
      dissertationTitle: formData.dissertationTitle || '',
      grade: formData.grade || ''
    })
  }

  let studyAbroad = null
  if (formData.studyAbroad) {
    studyAbroad = {
      location: `${formData.university}, ${formData.exchangeLocation || ''}`,
      program: formData.exchangeProgramme || '',
      dates: formData.exchangeYear || ''
    }
  }

  let highSchool = null
  if (formData.highSchool) {
    highSchool = {
      name: formData.highSchool,
      graduationDate: formData.graduationDate || ''
    }
  }

  const experience = []

  if (formData.mostRecentJobTitle) {
    experience.push({
      jobTitle: formData.mostRecentJobTitle || '',
      company: formData.company || '',
      dates: `${formData.jobStartDate || ''} - ${formData.jobEndDate || ''}`,
      bullets: formData.jobSummary ? formData.jobSummary.split('\n') : []
    })
  }

  if (formData.secondMostRecentJobTitle) {
    experience.push({
      jobTitle: formData.secondMostRecentJobTitle || '',
      company: formData.company || '',
      dates: `${formData.jobStartDate || ''} - ${formData.jobEndDate || ''}`,
      bullets: formData.jobSummary ? formData.jobSummary.split('\n') : []
    })
  }

  if (formData.thirdMostRecentJobTitle) {
    experience.push({
      jobTitle: formData.thirdMostRecentJobTitle || '',
      company: formData.company || '',
      dates: `${formData.jobStartDate || ''} - ${formData.jobEndDate || ''}`,
      bullets: formData.jobSummary ? formData.jobSummary.split('\n') : []
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

  return {
    personalInformation,
    education,
    studyAbroad,
    highSchool,
    experience,
    skills
  }
}
