document.addEventListener('DOMContentLoaded', () => {
  const selects = document.querySelectorAll('.graduation-year')
  const currentYear = new Date().getFullYear()

  selects.forEach(select => {
    select.innerHTML = '<option value="" disabled selected>Year</option>'

    for (let year = currentYear; year >= 1900; year--) {
      select.innerHTML += `<option value="${year}">${year}</option>`
    }
  })
})
