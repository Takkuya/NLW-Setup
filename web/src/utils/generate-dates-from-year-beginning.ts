import dayjs from 'dayjs'

export const generateDatesFromYearBeginning = () => {
  const firstDayOfTheYear = dayjs().startOf('year')
  const today = new Date()

  const dates = []
  let compareDate = firstDayOfTheYear

  // enquanto a data for anterior a hoje eu vou continuar rodando o while
  while (compareDate.isBefore(today)) {
    dates.push(compareDate.toDate())
    compareDate = compareDate.add(1, 'day')
  }

  return dates
}
