
const degrees_to_radians = (deg: number) => (deg * Math.PI) / 180.0;

export default class MarkersCalculator {
    readonly R = 6371e3

    calculateDistancePoints(coor: Coordinate|CoordWithAngle, meters: number, angle: number) {
        let metersRad = meters / this.R
        let coorRad:Coordinate = {
            latitude: degrees_to_radians(coor.latitude),
            longitude: degrees_to_radians(coor.longitude)
        }

        let newLat = Math.asin(Math.sin(coorRad.latitude) * Math.cos(metersRad) + Math.cos(coorRad.latitude) * Math.sin(metersRad) * Math.cos(angle))
        let newLng = coorRad.longitude + Math.atan2(Math.sin(angle) * Math.sin(metersRad) * Math.cos(coorRad.latitude), Math.cos(metersRad) - Math.sin(coorRad.latitude) * Math.sin(newLat))
        let newCoor:Coordinate = {
            latitude: newLat * 180 / Math.PI,
            longitude: newLng * 180 / Math.PI
        }

        return newCoor
    }

    createCorridor(coords: Coordinate[], width: number) {
        const coordinatesWithAngle: CoordWithAngle[] = coords.map((coor, index) => {
            let angle = 0
            if (index < coords.length -1) {
                const next = coords[index + 1]
                angle = Math.atan2(next.longitude - coor.longitude, next.latitude - coor.latitude)

            } else {
                const prev = coords[index - 1]
                angle = Math.atan2(coor.longitude - prev.longitude, coor.latitude - prev.latitude)
            }
            return {
                latitude: coor.latitude,
                longitude: coor.longitude,
                angle: angle
            }
        });
        
        const topCoordBrute: Coordinate[] = []
        const bottomCoordBrute: Coordinate[] = []
        const topIntercept: Coordinate[] = []
        const bottomIntercept: Coordinate[] = []

        coordinatesWithAngle.forEach((coor, index) => {
            //if (index === coordinatesWithAngle.length -1) return;

            let coordTop = this.calculateDistancePoints(coor, width / 2, coor.angle - Math.PI/2)
            let coordBottom = this.calculateDistancePoints(coor, width/2, coor.angle + Math.PI/2)
            topCoordBrute.push(coordTop)
            bottomCoordBrute.push(coordBottom)

            if (index === 0 || index === coordinatesWithAngle.length -1) {
                topIntercept.push(coordTop);
                bottomIntercept.push(coordBottom)
                return
            }

            const prevTop = topIntercept[index -1]
            const prevBottom = bottomIntercept[index -1]
            const prevAngle = coordinatesWithAngle[index -1].angle

            topIntercept.push(this.findIntersection(prevTop.latitude, prevTop.longitude, prevAngle, coordTop.latitude, coordTop.longitude, coor.angle))
            bottomIntercept.push(this.findIntersection(prevBottom.latitude, prevBottom.longitude, prevAngle, coordBottom.latitude, coordBottom.longitude, coor.angle))
        })

        return {
            top: topCoordBrute,
            bottom: bottomCoordBrute,
            topIntercept: topIntercept,
            bottomIntercept
        }
    }

    findIntersection(lat1: number, lng1: number, angle1: number, lat2: number, lng2: number, angle2: number): Coordinate {
        if (angle1 === Math.PI) {
            return {
                latitude: lat2,
                longitude: lng1
            }
        }
        if (angle2 === Math.PI) {
            return {
                latitude: lat1,
                longitude: lng2
            }
        }

        let slope1 = Math.tan(angle1)
        let slope2 = Math.tan(angle2)

        let yIntercept1 = lat1 - (slope1 * lng1)
        let yIntercept2 = lat2 - (slope2 * lng2)

        if (slope1 === slope2 && yIntercept1 === yIntercept2) {
            return {
                latitude: lat2,
                longitude: lng2
            }
        }

        const lngR = (yIntercept2 - yIntercept1) / (slope1 - slope2)
        const latR = (slope1 * lngR) + yIntercept1

        return {
            latitude: latR,
            longitude: lngR
        }
    }
}