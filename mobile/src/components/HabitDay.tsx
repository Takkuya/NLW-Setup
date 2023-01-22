import {
  Dimensions,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

const WEEK_DAYS = 7
// calcular qual o espaçamento no lado das telas
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5

export const DAY_MARGIN_BETWEEN = 8
// pegar o tamanho da tela
export const DAY_SIZE =
  Dimensions.get('screen').width / WEEK_DAYS - (SCREEN_HORIZONTAL_PADDING + 5)

type HabitDayProps = TouchableOpacityProps & {}

export const HabitDay = ({ ...props }: HabitDayProps) => {
  return (
    <TouchableOpacity
      {...props}
      className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800"
      style={{ width: DAY_SIZE, height: DAY_SIZE }}
      activeOpacity={0.7}
    />
  )
}
