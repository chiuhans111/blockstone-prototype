<template>
  <div>
    <div ref="canvasContainer"></div>
    <p>超低面數的石頭</p>
  </div>
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { toRaw } from 'vue'

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      scene: null,
      renderer: null,
      camera: null,
      controls: null
    }
  },
  mounted() {
    // Create a scene, renderer, and camera
    const scene = new THREE.Scene()
    this.scene = scene
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setClearColor(0x000000, 0)
    renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer = renderer
    const canvas_width = 500
    const canvas_height = 500

    renderer.setSize(canvas_width, canvas_height)
    this.$refs.canvasContainer.appendChild(renderer.domElement)

    // Create a perspective camera
    const camera = new THREE.PerspectiveCamera(
      75, // field of view
      canvas_width / canvas_height, // aspect ratio
      0.1, // near clipping plane
      1000 // far clipping plane
    )
    camera.position.z = 5

    // Create a directional light with soft shadows
    // const light = new THREE.DirectionalLight(0xffffff, 0)
    // light.position.set(0, 0, 1)
    // light.castShadow = true
    // light.shadow.mapSize.width = 1024
    // light.shadow.mapSize.height = 1024
    // light.shadow.camera.near = 0.1
    // light.shadow.camera.far = 100
    // scene.add(light)


    // Create an ambient light with a specific color and intensity
    const ambientLight = new THREE.AmbientLight(0xffffff, 1) // color: white, intensity: 0.5
    scene.add(ambientLight)

    // Create a GLTFLoader instance
    const loader = new GLTFLoader()


    const controls = new OrbitControls(camera, renderer.domElement)
    this.controls = controls


    // Load the glb model
    loader.load(
      require('@/assets/blockstudio_rock.glb').default, // or use the imported model variable if you used the import statement
      (gltf) => {
        // Add the loaded glTF scene to your Three.js scene
        scene.add(gltf.scene)

        gltf.scene.traverse((child) => {
          if (child.isMesh) {

            child.position.set(0, 0, 0)
            const material = new THREE.MeshStandardMaterial({
              map: child.material.map,
              normalMap: child.material.normalMap,
              normalMapType: THREE.ObjectSpaceNormalMap,
              roughness: 0.6, // Set roughness property to control the reflection roughness
              metalness: 0,
            })
            child.material = material

            // Set materials for child objects
            console.log(child.material)

            // child.material.map.wrapS = THREE.MirroredRepeatWrapping;
            // child.material.map.wrapT = THREE.MirroredRepeatWrapping;
            // child.material.map.magFilter = THREE.NearestFilter;
            // child.material.map.minFilter = THREE.NearestFilter;
          }
        })



        // Create OrbitControls for rotating the model with the mouse

        controls.target = gltf.scene.position
        controls.update()

        console.log("load done")
      },
      (progress) => {
        // Progress callback, e.g., to show loading progress
        console.log('Loading progress:', progress)
      },
      (error) => {
        // Error callback, e.g., to handle loading errors
        console.error('Error loading glb model:', error)
      }
    )

    // Set up shadow properties for the renderer
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Render the scene with the loaded model
    renderer.render(scene, camera)
    this.camera = camera
    this.scene = scene


    this.animate()

  }, methods: {
    animate() {
      requestAnimationFrame(this.animate)
      // Update controls (if needed)
      // Replace with your desired controls, e.g. TrackballControls, OrbitControls, etc.
      this.controls.update()
      this.renderer.render(toRaw(this.scene), toRaw(this.camera))
    }
  }
}
</script>

<style>
canvas {
  display: block;

}

body {
  background-color: #fff;
}
</style>
