<template>
  <div class="root">
    <div class="canvas-container" ref="canvasContainer"></div>
    <p v-if="overlay">
      It is glad to see you as one of us. we are an explorer that focus on Digital Design. New possibilities are creating in collision and thrust, we are independent yet support each other like a plate.
    </p>


    <div class="grid">
      <div class="col">
        <button @click="this.load(require('@/assets/blockstone_A.glb').default)">A</button>
        <button @click="this.load(require('@/assets/blockstone_B.glb').default)">B</button>
        <button @click="this.load(require('@/assets/blockstone_C.glb').default)">C</button>
        <button @click="this.load(require('@/assets/blockstone_D.glb').default)">D</button>
      </div>
      <div class="col">
        <div class="btn" @click="overlay = !overlay"></div>
      </div>
      <div class="col"></div>
      <div class="col"></div>
    </div>
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
      controls: null,
      overlay: true,
      gltfScene: null
    }
  },
  mounted() {
    this.setup()
    this.animate()
    addEventListener("resize", this.resize)
  }, methods: {
    setup() {

      // Scene
      const scene = new THREE.Scene()
      this.scene = scene

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.outputEncoding = THREE.sRGBEncoding
      this.renderer = renderer

      // Canvas
      const canvas_width = innerWidth
      const canvas_height = innerHeight
      renderer.setSize(canvas_width, canvas_height)
      this.$refs.canvasContainer.appendChild(renderer.domElement)

      // Camera
      const camera = new THREE.PerspectiveCamera(
        40, // field of view
        canvas_width / canvas_height, // aspect ratio
        0.1, // near clipping plane
        1000 // far clipping plane
      )
      camera.position.z = 3

      // Create an ambient light with a specific color and intensity
      const ambientLight = new THREE.AmbientLight(0xffffff, 1) // color: white, intensity: 0.5
      scene.add(ambientLight)



      const controls = new OrbitControls(camera, renderer.domElement)
      this.controls = controls


      this.load(require('@/assets/blockstone_A.glb').default)


      // Set up shadow properties for the renderer
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      // Render the scene with the loaded model
      renderer.render(scene, camera)
      this.camera = camera
      this.scene = scene


    },
    animate() {
      requestAnimationFrame(this.animate)
      // Update controls (if needed)
      // Replace with your desired controls, e.g. TrackballControls, OrbitControls, etc.
      this.controls.update()
      this.renderer.render(toRaw(this.scene), toRaw(this.camera))
    },

    resize() {
      const canvas_width = window.innerWidth
      const canvas_height = window.innerHeight
      this.renderer.setSize(canvas_width, canvas_height)
      this.camera.aspect = canvas_width / canvas_height
      this.camera.updateProjectionMatrix()
    },

    load(model) {
      // Create a GLTFLoader instance
      const loader = new GLTFLoader()

      if (this.gltfScene !== null) this.scene.remove(this.gltfScene)
      // Load the glb model
      loader.load(model, (gltf) => {
        // Add the loaded glTF scene to your Three.js scene
        this.scene.add(gltf.scene)
        this.gltfScene = gltf.scene

        gltf.scene.traverse((child) => {
          if (child.isMesh) {

            child.position.set(0, 0, 0)

            console.log(child.material)

            // Texture Filter
            child.material.map.magFilter = THREE.LinearFilter
            child.material.map.minFilter = THREE.NearestFilter
          }
        })


        // Create OrbitControls for rotating the model with the mouse
        // controls.target = gltf.scene.position
        // controls.update()

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
    }
  }
}
</script>

<style lang="scss">
.root {
  display: relative;
}

.canvas-container {
  position: fixed;
  left: 0;
  top: 0;

  canvas {
    display: block;
  }
}

.btn {
  width: 64px;
  height: 64px;
  background-color: blue;
  cursor: pointer;
}


p {
  display: block;
  position: absolute;
  top: 35vh;

  margin: auto;
  padding: 20px;
  padding-left: 100px;

  font-family: Arial;
  font-weight: 400;
  font-size: 40px;

  color: white;
  mix-blend-mode: difference;

  max-width: 950px;

  @media (max-width: 1200px) {
    font-size: 24px;
    padding-left: 40px;
  }
}

.grid {
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  pointer-events: none;

  .btn, button{
    pointer-events: all;
  }

  .col {
    border-right: solid 1px rgba(128, 128, 128, 0.2);
    width: 25%;
  }
}


body {
  background-color: white;
  margin: 0;
}
</style>
