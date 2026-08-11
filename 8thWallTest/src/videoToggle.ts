import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'video',
  schema: {
    button: ecs.eid,
    video: ecs.eid,
    icon: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {button, video, icon} = schemaAttribute.get(eid)

    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        ecs.Ui.mutate(world, icon, (cursor) => {
          cursor.opacity = 0
          return false
        })
      })
      .listen(button, ecs.input.UI_CLICK, () => {
        let isPaused = false

        ecs.VideoControls.mutate(world, video, (controls) => {
          controls.paused = !controls.paused
          isPaused = controls.paused
          return false
        })

        ecs.Ui.mutate(world, icon, (cursor) => {
          cursor.opacity = isPaused ? 1 : 0
          return false
        })
      })
  },
})