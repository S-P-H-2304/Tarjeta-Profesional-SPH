import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'video',

  schema: {
    button: ecs.eid,
    video: ecs.eid,
  },

  stateMachine: ({world, eid, schemaAttribute}) => {
    const {button, video} = schemaAttribute.get(eid)

    ecs.defineState('default')
      .initial()
      .listen(button, ecs.input.UI_CLICK, () => {
        ecs.VideoControls.mutate(world, video, (controls) => {
          controls.paused = !controls.paused
          return false
        })
      })
  },
})