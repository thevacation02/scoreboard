import React, { Component } from 'react'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'
import bbox from '@turf/bbox'

class LeafletCountryMap extends Component {
  render () {
    const bounds = bbox(this.props.geography)

    return (
      <Map bounds={[[bounds[1], bounds[0]], [bounds[3], bounds[2]]]} >
        <TileLayer url='https://api.mapbox.com/styles/v1/devseed/cjqpb3z440t302smfnewsl6vb/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJnUi1mbkVvIn0.018aLhX0Mb0tdtaT2QNe2Q' />
        <GeoJSON data={this.props.geography} style={() => {
          return {
            color: '#4FCA9C',
            weight: 1,
            fillColor: '#4FCA9C',
            fillOpacity: 0.7
          }
        }} />
      </Map>
    )
  }
}

export default LeafletCountryMap
