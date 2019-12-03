export function formatDate(date) {
  if (Array.isArray(date)) {
    const start = new Date(date[0])
    const end = new Date(date[1])
    return {
      startYear: start.getFullYear(),
      startMonth: start.getMonth() + 1,
      startDay: start.getDate(),
      endYear: end.getFullYear(),
      endMonth: end.getMonth() + 1,
      endDay: end.getDate()
    }
  } else {
    const d = new Date(date)
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    }
  }
}
