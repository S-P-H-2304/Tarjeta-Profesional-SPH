const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/TarjetaTrackingProfe.json'),
      require('../image-targets/TarjetaProfesionalSPH.json')

    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)