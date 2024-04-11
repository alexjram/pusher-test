interface Coordinate {
    latitude: number
    longitude: number
    color ?: string
    label ?: string
    slope ?: number
}

interface CoordWithAngle {
    latitude: number
    longitude: number
    angle: number
    slope: number
}