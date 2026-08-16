import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'videoController',
  schema: {
    playPauseButton: ecs.eid,   // botón invisible en la pantalla
    restartButton: ecs.eid,     // botón invisible en la pantalla
    dpadPlayButton: ecs.eid,    // botón UI sobre la cruceta
    dpadRestartButton: ecs.eid, // botón UI sobre la cruceta
    video: ecs.eid,
    playIcon: ecs.eid,
    restartIcon: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {
      playPauseButton, restartButton,
      dpadPlayButton, dpadRestartButton,
      video, playIcon, restartIcon,
    } = schemaAttribute.get(eid)

    let isPaused = false

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

    const togglePlayPause = () => {
      isPaused = !isPaused
      ecs.VideoControls.mutate(world, video, (cursor) => {
        cursor.paused = isPaused
        return false
      })
      updateIcons()
    }

    const restartVideo = () => {
      ecs.video.setCurrentTime(world, video, 0)
      ecs.VideoControls.mutate(world, video, (cursor) => {
        cursor.paused = false
        return false
      })
      isPaused = false
      updateIcons()
    }

    ecs.defineState('default')
      .initial()
      .listen(playPauseButton, ecs.input.UI_CLICK, togglePlayPause)
      .listen(dpadPlayButton, ecs.input.UI_CLICK, togglePlayPause)
      .listen(restartButton, ecs.input.UI_CLICK, restartVideo)
      .listen(dpadRestartButton, ecs.input.UI_CLICK, restartVideo)
  },
})