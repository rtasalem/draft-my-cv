document.addEventListener('DOMContentLoaded', () => {
  const selectDrop = document.getElementById('country')

  fetch('https://restcountries.com/v3.1/all').then(res => {
    return res.json()
  }).then(countries => {
    let output = ''

    countries
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
      .forEach(country => {
        output += `<option>${country.name.common}</option>`
      })

    selectDrop.innerHTML = output
  }).catch(err => {
    console.log(err)
  })
})
