exports.config = {
  namespace: 'ionicpwaelements',
  generateDistribution: true,
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
