# Draft My CV
A CV (resume) generator that takes in information such as contact details, education, work experience, projects and builds a ready to download CV using the [University of Harvard's Mignone Center for Career Success Bullet Point Resume Template](https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/), often regarded as one of the best CV/resume templates.

This application is intended to cut down the time taken to create a structured, clear, and well-crafted CV for anyone who is currently job hunting. Good luck!

All information you enter is used solely to generate your CV and is not stored, saved, or transmitted to any database or third-party service. Once your CV is generated, your data is immediately discarded and not retained by the system in any form.

## Features
Download generated CV as a Word document or PDF.
System-based automatic theme detection for light or dark mode.

## Prequisites
Node.js v23+ <br>
or <br> 
Docker Compose.

## Getting Started
Clone repository and run `npm install` to install all dependencies.<br>
Any of the following commands can be used to run the project via Node.js.
```
npm run start // without nodemon 
```
or
```
npm run dev // with nodemon
```
Or use the following commands in the order shown to build and start the Docker container:
```
docker compose build
docker compose up -d
```

## License
See the [LICENSE](/LICENSE.md) file for license rights and limitations ([MIT](https://opensource.org/license/mit)).

## Acknowledgments
A [Nunjucks Bulma Starter Kit](https://github.com/benninkcorien/nunjucks-starter-kit) developed by [benninkcorien](https://github.com/benninkcorien) was helpful in understanding how to integrate Bulma with Nunjucks.

A [YouTube tutorial](https://www.youtube.com/watch?v=iw4lvZGBuvA) by [Osten Code Cypher](https://www.youtube.com/@OstonCodeCypher) that showed how to implement a HTML drop down list of all countries by using the [REST Countries API](https://restcountries.com/).

And lastly, Nicola, who gave me the idea in the first place.
