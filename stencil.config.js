exports.config = {
  namespace: 'mycomponent',
  generateDistribution: true,
  bundles: [
    { components: ['ion-camera'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
