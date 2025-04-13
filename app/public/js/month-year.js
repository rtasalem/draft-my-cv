flatpickr('.job-date-picker', {
  plugins: [
    new monthSelectPlugin({
      shorthand: true,
      dateFormat: 'M Y',
      altFormat: 'M Y'
    })
  ]
})
