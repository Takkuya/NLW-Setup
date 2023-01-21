import { View, TouchableOpacity, Touchable, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'

import Logo from '../assets/logo.svg'

export const Header = () => {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Logo />
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row h-11 px-4 border border-violet-500 rounded-lg items-center"
      >
        <Feather
          name="plus"
          // acessando as cores do tailwind
          color={colors.violet[500]}
          size={20}
        />

        <Text className="text-white ml-3 font-semibold text-base"> Novo </Text>
      </TouchableOpacity>
    </View>
  )
}
