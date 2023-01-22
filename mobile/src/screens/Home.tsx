import { useNavigation } from '@react-navigation/native'
import { ScrollView, Text, View } from 'react-native'
import { DAY_SIZE, HabitDay } from '../components/HabitDay'
import { Header } from '../components/Header'
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generateRangeDatesFromYearStart()
const minimumSummaryDateSizes = 18 * 5
const amountOfDaysToFill = minimumSummaryDateSizes - datesFromYearStart.length

export const Home = () => {
  const { navigate } = useNavigation()

  return (
    <View className="flex-1 bg-background px-8 py-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, idx) => {
          return (
            <Text
              key={`${weekDay}-${idx}`}
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: DAY_SIZE }}
            >
              {weekDay}
            </Text>
          )
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* flex-wrap para os quadrados não ultrapassar o limite da tela */}
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map((date) => (
            <HabitDay
              onPress={() => navigate('habit', { date: date.toISOString() })}
              key={date.toISOString()}
            />
          ))}

          {amountOfDaysToFill > 0 &&
            Array.from({
              length: amountOfDaysToFill,
            }).map((_, idx) => (
              <View
                key={idx}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  )
}
