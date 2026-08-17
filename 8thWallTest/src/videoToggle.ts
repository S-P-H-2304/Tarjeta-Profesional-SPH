import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'videoController',
  schema: {
    switchModel: ecs.eid,
    dpadPlayButton: ecs.eid,
    dpadRestartButton: ecs.eid,
    video: ecs.eid,
    playIcon: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {
      switchModel, dpadPlayButton, dpadRestartButton,
      video, playIcon,
    } = schemaAttribute.get(eid)

    let isPaused = false
    let videoReady = false

    const updateIcons = () => {
      ecs.Ui.mutate(world, playIcon, (cursor) => {
        cursor.opacity = isPaused ? 1 : 0
        return false
      })
    }

    const togglePlayPause = () => {
      if (!videoReady) return // ignora toques antes de que el video esté disponible

      isPaused = !isPaused
      ecs.VideoControls.mutate(world, video, (cursor) => {
        cursor.paused = isPaused
        return false
      })
      updateIcons()
    }

    const restartVideo = () => {
      if (!videoReady) return

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
      .listen(switchModel, ecs.events.GLTF_ANIMATION_FINISHED, () => {
        videoReady = true
      })
      .listen(dpadPlayButton, ecs.input.UI_CLICK, togglePlayPause)
      .listen(dpadRestartButton, ecs.input.UI_CLICK, restartVideo)
  },
})