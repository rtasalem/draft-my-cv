document.addEventListener('DOMContentLoaded', () => {
  const selectDrop = document.getElementById('country')

  fetch('https://restcountries.com/v3.1/all').then(res => {
    return res.json()
  }).then(countries => {
    let options = '<option value="" disabled selected>Country</option>'

    countries
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
      .forEach(country => {
        options += `<option value="${country.name.common}">${country.name.common}</option>`
      })

    selectDrop.innerHTML = options
  }).catch(err => {
    console.log(err)
  })
})
