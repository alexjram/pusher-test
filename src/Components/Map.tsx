import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import MarkersCalculator from "../Service/MarkersCalculator";
import 'leaflet/dist/leaflet.css'
import { Polygon, Polyline} from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

const coordinates = [
    {latitude: 0, longitude: 0},
    {latitude: 0.1, longitude: 0.1},
    {latitude: 0.1, longitude: 0.2},
    {latitude: 0, longitude: 0.3},
    {latitude: -0.2, longitude: 0.4},
    {latitude: -0.2, longitude: 0.5},
    {latitude: 0, longitude: 0.5}
];

export default function Map() {
    const calculator = new MarkersCalculator()
    let {top, bottom, topIntercept, bottomIntercept} = calculator.createCorridor(coordinates, 5000)
    let topLine: LatLngExpression[] = top.map(t => [t.latitude, t.longitude])
    let origLine:LatLngExpression[] = coordinates.map(o => [o.latitude, o.longitude])
    let bottomLine: LatLngExpression[] = bottom.map(b => [b.latitude, b.longitude])

    let poly: LatLngExpression[] = [
        ...topIntercept.map<LatLngExpression>(t => [t.latitude, t.longitude]),
        ...bottomIntercept.map<LatLngExpression>(b => [b.latitude, b.longitude]).reverse()
    ]
    console.log(topIntercept)
    console.log(bottomIntercept)

    return (
        <MapContainer style={{width: 700, height: 700}} center={[0, 0]} zoom={10} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/*top.map((c, index) => (<Marker key={'t-'+index} position={[c.latitude, c.longitude]} title="top"><Popup>Top</Popup></Marker>))*/}
            {/*coordinates.map((c, index) => (<Marker key={'o-'+index} position={[c.latitude, c.longitude]} title="original" ><Popup>Original</Popup></Marker>))*/}
            {/*bottom.map((c, index) => (<Marker key={'b-'+index} position={[c.latitude, c.longitude]} title="bottom" ><Popup>bottom</Popup></Marker>))*/}
            <Polyline  positions={topLine} pathOptions={{color: 'red'}} />
            <Polyline positions={origLine} pathOptions={{color: 'blue'}} />
            <Polyline positions={bottomLine} pathOptions={{color: 'yellow'}} />
            <Polygon positions={poly} pathOptions={{color: 'green'}} />
        </MapContainer>
    )
}