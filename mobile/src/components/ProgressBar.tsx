import { View } from 'react-native'
import { useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type ProgressBarProps = {
  progress?: number
}

export const ProgressBar = ({ progress = 0 }: ProgressBarProps) => {
  const sharedProgress = useSharedValue(progress)
  const style = useAnimatedStyle(() => {
    return {
      width: `${sharedProgress.value}%`,
    }
  })

  useEffect(() => {
    sharedProgress.value = withTiming(progress)
  }, [progress, sharedProgress])

  return (
    <View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
      <Animated.View className="h-3 rounded-xl bg-violet-600 " style={style} />
    </View>
  )
}
