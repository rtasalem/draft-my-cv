document.addEventListener('DOMContentLoaded', () => {
  const selectDrop = document.getElementById('ug-graduation-year')

  let currentYear = new Date().getFullYear()
  const earliestYear = 1900
  while (currentYear >= earliestYear) {
    const dateOption = document.createElement('option')
    dateOption.text = currentYear
    dateOption.value = currentYear
    selectDrop.add(dateOption)
    currentYear -= 1
  }
})
