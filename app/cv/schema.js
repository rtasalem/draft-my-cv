import Joi from 'joi'

export const schema = Joi.object({
  personalInformation: Joi.object({
    firstName: Joi.string().requried(),
    lastName: Joi.string().requried(),
    location: Joi.string().requred(),
    country: Joi.string().required(),
    emailAddress: Joi.string().required(),
    callingCode: Joi.string().required(),
    phoneNumber: Joi.string().required()
  }).required(),
  education: Joi.object({
    undergraduate: Joi.object({
      university: Joi.string().optional(),
      location: Joi.string().optional(),
      degree: Joi.string().optional(),
      graduationDate: Joi.string().optional(),
      dissertation: Joi.string().optional(),
      grade: Joi.string().optional()
    }).optional(),
    postgraduate: Joi.object({
      university: Joi.string().optional(),
      location: Joi.string().optional(),
      degree: Joi.string().optional(),
      graduationDate: Joi.string().optional(),
      dissertation: Joi.string().optional(),
      grade: Joi.string().optional()
    }).optional(),
    studyAbroad: Joi.object({
      university: Joi.string().optional(),
      country: Joi.string().optional(),
      degreeProgramme: Joi.string().optional(),
      yearCompleted: Joi.string().optional()
    }).optional(),
    highSchool: Joi.object({
      school: Joi.string().optional(),
      year: Joi.string().optional()
    }).optional()
  }),
  workExperience: Joi.object({
    mostRecent: Joi.object({
      jobTitle: Joi.string().required(),
      company: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate: Joi.string.required(),
      summary: Joi.string.required() // set max word count on this.
    }).required(),
    secondRecent: Joi.object({
      jobTitle: Joi.string().required(),
      company: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate: Joi.string.required(),
      summary: Joi.string.required() // set max word count on this.
    }).required(),
    thirdRecent: Joi.object({
      jobTitle: Joi.string().required(),
      company: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate: Joi.string.required(),
      summary: Joi.string.required() // set max word count on this.
    }).required()
  }).required(),
  projects: Joi.object({
    firstProject: Joi.object({
      title: Joi.string().optional(),
      url: Joi.string().optional(),
      role: Joi.string().optional(),
      summary: Joi.string().optional() // set max word count on this.
    }).optional(),
    secondProject: Joi.object({
      title: Joi.string().optional(),
      url: Joi.string().optional(),
      role: Joi.string().optional(),
      summary: Joi.string().optional() // set max word count on this.
    }).optional(),
    thirdProject: Joi.object({
      title: Joi.string().optional(),
      url: Joi.string().optional(),
      role: Joi.string().optional(),
      summary: Joi.string().optional() // set max word count on this.
    }).optional()
  }).optional(),
  interests: Joi.object({
    firstInterest: Joi.string().optional(),
    secondInterest: Joi.string().optional(),
    thirdInterest: Joi.string().optional(),
    fourthInterest: Joi.string().optional(),
    fifthInterest: Joi.string().optional(),
    sixthInterest: Joi.string().optional()
  }).optional()
})
