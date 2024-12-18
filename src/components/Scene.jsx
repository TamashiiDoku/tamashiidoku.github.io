import { Canvas } from '@react-three/fiber'
import { useGLTF, PointerLockControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function CollisionBox({ position, size = [2, 5, 2], onCollide }) {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current) {
      const boundingBox = new THREE.Box3().setFromObject(meshRef.current)
      
      const collidables = []
      meshRef.current.parent.traverse((object) => {
        if (object.userData.collidable) {
          collidables.push(object)
        }
      })
      
      collidables.forEach(object => {
        const objectBox = new THREE.Box3().setFromObject(object)
        if (boundingBox.intersectsBox(objectBox)) {
          if (onCollide) {
            onCollide({
              type: 'object',
              object: object,
              position: object.position.clone()
            })
          }
        }
      })
    }
  })

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      visible={false}
      userData={{ collidable: true }}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial wireframe opacity={0} transparent />
    </mesh>
  )
}

function Skybox() {
  const { scene } = useGLTF(process.env.PUBLIC_URL + '/skybox/quarry.glb')
  return <primitive object={scene} scale={[1550, 1550, 1550]} />
}

function Model() {
  const modelRef = useRef()
  const { scene } = useGLTF(process.env.PUBLIC_URL + '/models/reimu.glb')
  
  useEffect(() => {
    if (scene) {
      scene.traverse((object) => {
        object.userData.collidable = true
      })
    }
  }, [scene])

  if (!scene) return null

  return (
    <group>
      <primitive 
        ref={modelRef}
        object={scene}
        scale={5}
        position={[50, 0, 50]}
      />
      <CollisionBox 
        position={[50, 0, 50]}
        size={[3, 6, 3]}
      />
    </group>
  )
}

function FPSControls() {
  const walkSpeed = 0.01
  const sprintSpeed = 0.03
  const keys = useRef({})
  const BOUNDARY_SIZE = 220
  const coordsRef = useRef(null)
  
  const GRAVITY = 0.98
  const JUMP_FORCE = 0.1
  const velocity = useRef(0)
  const isGrounded = useRef(true)

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.code] = true
      // Show coordinates when Z is pressed
      if (e.code === 'KeyZ' && coordsRef.current) {
        coordsRef.current.style.display = 'block'
      }
    }
    
    const handleKeyUp = (e) => {
      keys.current[e.code] = false
      // Hide coordinates when Z is released
      if (e.code === 'KeyZ' && coordsRef.current) {
        coordsRef.current.style.display = 'none'
      }
    }

    // Create coordinate display element
    const coordsDisplay = document.createElement('div')
    coordsDisplay.style.position = 'fixed'
    coordsDisplay.style.top = '10px'
    coordsDisplay.style.left = '10px'
    coordsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    coordsDisplay.style.color = 'white'
    coordsDisplay.style.padding = '10px'
    coordsDisplay.style.fontFamily = 'monospace'
    coordsDisplay.style.fontSize = '14px'
    coordsDisplay.style.zIndex = '1000'
    coordsDisplay.style.display = 'none' // Hidden by default
    document.body.appendChild(coordsDisplay)
    coordsRef.current = coordsDisplay

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      coordsDisplay.remove()
    }
  }, [])

  useFrame((state) => {
    const { camera, scene } = state
    
    if (!camera || !scene) return

    // Update coordinates display
    if (coordsRef.current) {
      coordsRef.current.textContent = `X: ${camera.position.x.toFixed(2)} Y: ${camera.position.y.toFixed(2)} Z: ${camera.position.z.toFixed(2)}`
    }

    const previousPosition = camera.position.clone()
    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3()
    const sideVector = new THREE.Vector3()
    const speed = keys.current['ShiftLeft'] ? sprintSpeed : walkSpeed

    if (keys.current['Space'] && isGrounded.current) {
      velocity.current = JUMP_FORCE
      isGrounded.current = false
    }

    velocity.current -= GRAVITY * 0.016
    camera.position.y += velocity.current

    if (camera.position.y <= -40) {
      camera.position.y = -40
      velocity.current = 0
      isGrounded.current = true
    }

    frontVector.setFromMatrixColumn(camera.matrix, 0)
    frontVector.crossVectors(camera.up, frontVector)
    sideVector.setFromMatrixColumn(camera.matrix, 0)

    direction.x = Number(keys.current['KeyD']) - Number(keys.current['KeyA'])
    direction.z = Number(keys.current['KeyS']) - Number(keys.current['KeyW'])
    direction.normalize()

    if (keys.current['KeyW']) camera.position.add(frontVector.multiplyScalar(speed))
    if (keys.current['KeyS']) camera.position.add(frontVector.multiplyScalar(-speed))
    if (keys.current['KeyA']) camera.position.add(sideVector.multiplyScalar(-speed))
    if (keys.current['KeyD']) camera.position.add(sideVector.multiplyScalar(speed))

    if (Math.abs(camera.position.x) > BOUNDARY_SIZE || 
        Math.abs(camera.position.z) > BOUNDARY_SIZE) {
      camera.position.copy(previousPosition)
    }

    const cameraBox = new THREE.Box3().setFromCenterAndSize(
      camera.position,
      new THREE.Vector3(0.05, 0.1, 0.05)
    )

    let hasCollision = false
    scene.traverse((object) => {
      if (object.userData.collidable) {
        const objectBox = new THREE.Box3().setFromObject(object)
        if (cameraBox.intersectsBox(objectBox)) {
          hasCollision = true
        }
      }
    })

    if (hasCollision) {
      camera.position.copy(previousPosition)
    }
  })

  return null
}

export default function Scene() {
  useEffect(() => {
    return () => {
      document.exitPointerLock();
    };
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#111'
    }}>
      <Canvas shadows camera={{ 
        position: [147, -40, 73],
        fov: 100
      }}>
        <group>
          <Skybox />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff9f00" />
          <Model />
          <PointerLockControls />
          <FPSControls />
        </group>
      </Canvas>
    </div>
  )
}

useGLTF.preload(process.env.PUBLIC_URL + '/models/reimu.glb')
useGLTF.preload(process.env.PUBLIC_URL + '/skybox/quarry.glb') 