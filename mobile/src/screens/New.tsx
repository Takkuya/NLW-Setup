import { ScrollView, Text, View } from 'react-native'

export const New = () => {
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-white">Olá new</Text>
      </ScrollView>
    </View>
  )
}
