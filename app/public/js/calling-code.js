/* global Option */
document.addEventListener('DOMContentLoaded', () => {
  const selectDrop = document.getElementById('calling-code')

  fetch('/api/countries').then(res => {
    if (!res.ok) throw new Error(`Country list request failed with ${res.status}`)
    return res.json()
  }).then(countries => {
    const placeholder = new Option('Calling code', '', true, true)
    placeholder.disabled = true
    selectDrop.replaceChildren(placeholder)

    countries.forEach(country => {
      country.callingCodes.forEach(code => {
        selectDrop.add(new Option(`${country.code || country.name} (${code})`, code))
      })
    })
  }).catch(err => {
    console.log(err)
  })
})
