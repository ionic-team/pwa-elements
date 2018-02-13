exports.config = {
  namespace: 'ionicpwaelements',
  generateDistribution: true,
  // Depend on these ionic controls
  bundles: [
    { components: ['ion-icon', 'ion-action-sheet-controller', 'ion-action-sheet',
                   'ion-modal-controller', 'ion-modal', 'ion-animation-controller'] },
    { components: ['ion-pwa-camera-modal', 'ion-pwa-camera', 'ion-pwa-action-sheet'] }
  ],
  collections: [
    { 
      name: '@ionic/core'
    }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**',
  ssl: true
}
