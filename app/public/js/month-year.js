document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.job-date-picker').forEach((el) => {
    flatpickr(el, {
      plugins: [
        new monthSelectPlugin({
          shorthand: true,
          dateFormat: 'M Y',
          altFormat: 'M Y'
        })
      ]
    })
  })
})
