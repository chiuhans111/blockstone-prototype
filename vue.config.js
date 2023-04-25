const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    // Add file-loader rule for glb and gltf files
    config.module
      .rule('glb')
      .test(/\.(glb|gltf)$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        outputPath: 'assets/models/', // Specify the output directory for the models
      });
  },
})
