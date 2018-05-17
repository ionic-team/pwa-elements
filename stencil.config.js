const sass = require('@stencil/sass');

exports.config = {
  namespace: 'ionicpwaelements',
  generateDistribution: true,
  // Depend on these ionic controls
  bundles: [
    { components: ['ion-icon', 'ion-action-sheet-controller', 'ion-action-sheet',
                   'ion-modal-controller', 'ion-modal', 'ion-animation-controller',
                   'ion-toast-controller', 'ion-toast'] },
    { components: ['ion-pwa-camera-modal', 'ion-pwa-camera', 'ion-pwa-action-sheet'] }
  ],
  collections: [
    { 
      name: '@ionic/core'
    }
  ],
  plugins: [
    sass()
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**',
  ssl: true
}
