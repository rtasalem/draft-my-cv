/* global Option */
document.addEventListener('DOMContentLoaded', () => {
  const selectDrop = document.getElementById('country')

  fetch('/api/countries').then(res => {
    if (!res.ok) throw new Error(`Country list request failed with ${res.status}`)
    return res.json()
  }).then(countries => {
    const placeholder = new Option('Country', '', true, true)
    placeholder.disabled = true
    selectDrop.replaceChildren(placeholder)

    countries.forEach(country => {
      selectDrop.add(new Option(country.name, country.name))
    })
  }).catch(err => {
    console.log(err)
  })
})
