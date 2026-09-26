import { useMemo } from 'react'
import * as THREE from 'three'

// A classic folded-paper dart, built as real faceted geometry (proper 3D
// mesh with volume and lit surfaces) rather than a flat SVG/sprite icon.
// No reliably free/licensed paper-airplane .glb could be sourced within
// this project's network access (GitHub-hosted assets only) -- this is
// hand-authored instead, same approach already used for the event icons
// in EventIcons.jsx.
//
// Axis convention -- chosen deliberately for the overlay camera this flies
// in front of, which looks straight down -Z at the screen:
//   X = nose-to-tail (the direction of travel, left/right across screen)
//   Y = wingtip-to-wingtip (up/down on screen -- this is what makes the
//       dart shape actually readable face-on to the camera)
//   Z = fold thickness (tiny -- just enough for the crease/fin to catch
//       light; deliberately NOT the axis that carries the silhouette)
// Flying it is then just rotation.y of 0 (nose at +X) or Math.PI (nose at
// -X, a clean mirror-flip since the shape is symmetric) -- no arbitrary
// angles, and the flat face always stays pointed at the camera instead of
// ever going edge-on.
function buildGeometry() {
  const nose = [1.05, 0, 0.02]
  const spineBack = [-0.85, 0, -0.05]
  const spineTop = [-0.55, 0, 0.22]
  const wingTipTop = [-0.5, 1.0, -0.06]
  const wingBackTop = [-0.85, 0.22, -0.06]
  const wingTipBottom = [-0.5, -1.0, -0.06]
  const wingBackBottom = [-0.85, -0.22, -0.06]
  const tailTop = [-0.85, 0.1, 0.1]
  const tailBottom = [-0.85, -0.1, 0.1]

  // prettier-ignore
  const verts = [
    // "top" wing (upper half, +Y), two tris for a slight fold
    ...nose, ...wingBackTop, ...wingTipTop,
    ...nose, ...spineBack, ...wingBackTop,
    // "bottom" wing (lower half, -Y)
    ...nose, ...wingTipBottom, ...wingBackBottom,
    ...nose, ...wingBackBottom, ...spineBack,
    // centre fin -- a small crease raised in +Z so it reads as folded
    // paper rather than a perfectly flat cutout
    ...spineTop, ...spineBack, ...tailTop,
    ...spineTop, ...tailBottom, ...spineBack,
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
      {/* DoubleSide: cheap insurance on a ~6-triangle mesh so no face
          goes invisible from a viewing angle winding order didn't expect. */}
      <meshStandardMaterial color="#F2ECDD" roughness={0.82} metalness={0.02} side={THREE.DoubleSide} />
    </mesh>
  )
}
