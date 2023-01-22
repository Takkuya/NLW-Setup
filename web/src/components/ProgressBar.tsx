type ProgressBarProps = {
  progress: number
}

export const ProgressBar = (props: ProgressBarProps) => {
  const progressStyles = {
    width: `${props.progress}%`,
  }

  return (
    <div className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
      {/* acessibilidade */}
      {/* role => div se comporta como uma progressbar */}
      <div
        role="progressbar"
        aria-label="Progresso de hábitos completados nesse dia"
        aria-valuenow={props.progress}
        className="h-3 rounded-xl bg-violet-600"
        style={progressStyles}
      />
    </div>
  )
}
