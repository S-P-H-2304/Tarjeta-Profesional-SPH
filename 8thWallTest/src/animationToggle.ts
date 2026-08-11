import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'avatarAnimationToggle',
  schema: {
    avatar: ecs.eid,
    animationDefault: ecs.string,
    animationAlt: ecs.string,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {avatar, animationDefault, animationAlt} = schemaAttribute.get(eid)

    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        ecs.GltfModel.mutate(world, avatar, (cursor) => {
          cursor.animationClip = animationDefault
          return false
        })
      })
      .listen(avatar, ecs.input.SCREEN_TOUCH_START, () => {
        ecs.GltfModel.mutate(world, avatar, (cursor) => {
          cursor.animationClip = cursor.animationClip === animationDefault
            ? animationAlt
            : animationDefault
          return false
        })
      })
  },
})