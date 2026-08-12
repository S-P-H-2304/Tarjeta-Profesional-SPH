import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'video',
  schema: {
    playPauseButton: ecs.eid,
    restartButton: ecs.eid,
    video: ecs.eid,
    playIcon: ecs.eid,
    restartIcon: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {playPauseButton, restartButton, video, playIcon, restartIcon} = schemaAttribute.get(eid)

    let isPaused = false   // el video arranca reproduciéndose
    let hasEnded = false   // si llegó al final de forma natural

    const updateIcons = () => {
      ecs.Ui.mutate(world, playIcon, (cursor) => {
        cursor.opacity = isPaused ? 1 : 0
        return false
      })
      ecs.Ui.mutate(world, restartIcon, (cursor) => {
        cursor.opacity = isPaused ? 1 : 0
        return false
      })
    }

    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        updateIcons()
      })
      .listen(playPauseButton, ecs.input.UI_CLICK, () => {
        if (hasEnded) {
          // si ya terminó, "reproducir" equivale a reiniciar
          ecs.video.setCurrentTime(world, video, 0)
          hasEnded = false
        }
        isPaused = !isPaused
        ecs.VideoControls.mutate(world, video, (cursor) => {
          cursor.paused = isPaused
          return false
        })
        updateIcons()
      })
      .listen(restartButton, ecs.input.UI_CLICK, () => {
        if (!isPaused) return // el video se está reproduciendo: ignora el toque

        ecs.video.setCurrentTime(world, video, 0)
        hasEnded = false
        isPaused = false
        ecs.VideoControls.mutate(world, video, (cursor) => {
          cursor.paused = false
          return false
        })
        updateIcons()
      })
      .listen(video, ecs.events.VIDEO_END, () => {
        isPaused = true
        hasEnded = true
        updateIcons()
      })
  },
})