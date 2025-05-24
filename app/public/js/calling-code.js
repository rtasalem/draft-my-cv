document.addEventListener('DOMContentLoaded', () => {
  const selectDrop = document.getElementById('calling-code')

  fetch('https://restcountries.com/v3.1/all').then(res => {
    return res.json()
  }).then(countries => {
    let options = '<option value="" disabled selected>Calling code</option>'

    countries
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
      .forEach(country => {
        const name = country.cca2
        const idd = country.idd
        if (!idd || !idd.root) return

        const fullCodes = (idd.suffixes && idd.suffixes.length > 0)
          ? idd.suffixes.map(suffix => `${idd.root}${suffix}`)
          : [`${idd.root}`]

        fullCodes.forEach(code => {
          options += `<option value="${code}">${name} (${code})</option>`
        })
      })

    selectDrop.innerHTML = options
  })
}).catch(err => {
  console.log(err)
})
