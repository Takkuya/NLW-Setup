import { ScrollView, Text, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { BackButton } from '../components/BackButton'
import dayjs from 'dayjs'
import { ProgressBar } from '../components/ProgressBar'
import { Checkbox } from '../components/Checkbox'

type HabitProps = {
  date: string
}

export const Habit = () => {
  // obtendo parâmetros da rota
  const route = useRoute()
  const { date } = route.params as HabitProps

  // convertendo a data para uma string
  const parsedDate = dayjs(date)
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>
        <ProgressBar progress={30} />

        <View className="mt-6">
          <Checkbox title="Beber 2l de água" checked={false} />
          <Checkbox title="Beber 2l de água" checked={false} />
          <Checkbox title="Beber 2l de água" checked={true} />
        </View>
      </ScrollView>
    </View>
  )
}
