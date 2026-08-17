import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'trackerVideoAnimationSync',
  schema: {
    switchModel: ecs.eid,
    videoScreen: ecs.eid,
    video: ecs.eid,
    dpadPlayIcon: ecs.eid,
    dpadRestartIcon: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {switchModel, videoScreen, video, dpadPlayIcon, dpadRestartIcon} = schemaAttribute.get(eid)

    let animationFinished = false
    let videoWasPlayingWhenLost = false

    const fadeOpacity = (mutateFn, from, to, duration) => {
      const startTime = Date.now()
      const step = () => {
        const elapsed = Date.now() - startTime
        const t = Math.min(elapsed / duration, 1)
        mutateFn(from + (to - from) * t)
        if (t < 1) requestAnimationFrame(step)
      }
      step()
    }

    ecs.defineState('default')
      .initial()
      .listen(switchModel, ecs.events.GLTF_ANIMATION_FINISHED, () => {
        animationFinished = true

        fadeOpacity((value) => {
          ecs.Material.mutate(world, videoScreen, (cursor) => {
            cursor.opacity = value
            return false
          })
        }, 0, 1, 2500)

        fadeOpacity((value) => {
          ecs.Ui.mutate(world, dpadPlayIcon, (cursor) => {
            cursor.opacity = value
            return false
          })
        }, 0, 1, 2500)

        fadeOpacity((value) => {
          ecs.Ui.mutate(world, dpadRestartIcon, (cursor) => {
            cursor.opacity = value
            return false
          })
        }, 0, 1, 2500)

        ecs.VideoControls.mutate(world, video, (cursor) => {
          cursor.paused = false
          return false
        })
      })
      .listen(world.events.globalId, ecs.events.REALITY_IMAGE_LOST, () => {
        if (!animationFinished) {
          ecs.GltfModel.mutate(world, switchModel, (cursor) => {
            cursor.paused = true
            return false
          })
        } else {
          ecs.VideoControls.mutate(world, video, (cursor) => {
            videoWasPlayingWhenLost = !cursor.paused
            cursor.paused = true
            return false
          })
        }
      })
      .listen(world.events.globalId, ecs.events.REALITY_IMAGE_FOUND, () => {
        if (!animationFinished) {
          ecs.GltfModel.mutate(world, switchModel, (cursor) => {
            cursor.paused = false
            return false
          })
        } else if (videoWasPlayingWhenLost) {
          ecs.VideoControls.mutate(world, video, (cursor) => {
            cursor.paused = false
            return false
          })
        }
      })
  },
})