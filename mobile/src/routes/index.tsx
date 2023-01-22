import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { AppRoutes } from './app.routes'

// criando contexto de navegação
export const Routes = () => {
  return (
    <View className="flex-1 bg-background">
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </View>
  )
}
