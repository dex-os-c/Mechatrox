import { useMemo } from 'react'
import * as THREE from 'three'

// A classic folded-paper dart, built as real faceted geometry (proper 3D
// mesh with volume and lit surfaces) rather than a flat SVG/sprite icon.
// No reliably free/licensed paper-airplane .glb could be sourced within
// this project's network access (GitHub-hosted assets only) -- this is
// hand-authored instead, same approach already used for the event icons
// in EventIcons.jsx.
//
// Layout (nose points toward +Z, plane sits flat-ish in XZ, wings crease
// upward from the centre spine so it actually reads as *folded* paper
// rather than a flat triangle):
//
//        nose (0,0, 1.05)
//         /|\
//        / | \
//   wingL  |  wingR
//   tip     |    tip
//      \    |    /
//       backL/backR   <- trailing edge of each wing
//         \  |  /
//        spineBack ---- tailL/tailR (small raised centre fin)
function buildGeometry() {
  const nose = [0, 0, 1.05]
  const spineBack = [0, -0.05, -0.85]
  const spineTop = [0, 0.22, -0.55]
  const wingLtip = [-1.0, -0.06, -0.5]
  const wingLback = [-0.22, -0.06, -0.85]
  const wingRtip = [1.0, -0.06, -0.5]
  const wingRback = [0.22, -0.06, -0.85]
  const tailL = [-0.1, 0.1, -0.85]
  const tailR = [0.1, 0.1, -0.85]

  // prettier-ignore
  const verts = [
    // left wing, top+bottom (thin double-sided fold)
    ...nose, ...wingLback, ...wingLtip,
    ...nose, ...spineBack, ...wingLback,
    // right wing
    ...nose, ...wingRtip, ...wingRback,
    ...nose, ...wingRback, ...spineBack,
    // centre fin (small raised crease down the spine, gives it a folded
    // silhouette from the side instead of reading as perfectly flat)
    ...spineTop, ...spineBack, ...tailL,
    ...spineTop, ...tailR, ...spineBack,
  ]

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.computeVertexNormals()
  return geo
}

export default function PaperPlaneModel() {
  const geometry = useMemo(() => buildGeometry(), [])
  return (
    <mesh geometry={geometry}>
      {/* DoubleSide: this hand-wound geometry doesn't need perfectly
          consistent winding to guarantee every face stays visible from
          both sides -- cheap insurance on a ~6-triangle mesh. */}
      <meshStandardMaterial color="#F2ECDD" roughness={0.82} metalness={0.02} side={THREE.DoubleSide} />
    </mesh>
  )
}
