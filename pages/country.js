import React, { Component } from 'react'
import { actions } from '../lib/store'
import { connect } from 'unistore/react'
import dynamic from 'next/dynamic'
import ScoreboardPanel from '../components/ScoreboardPanel'
import { formatDecimal, formatUpdateDescription } from '../lib/utils/format'
import Blurb from '../components/charts/CountryBlurb'
import CountryUserTable from '../components/country/CountryUserTable'

const CountryMap = dynamic(() => import('../components/charts/LeafletCountryMap'), {
  ssr: false
})

export class Country extends Component {
  componentDidMount () {
    this.props.getCountry(this.props.code)
  }

  render () {
    if (!this.props.country) return <div />
    const { name, edit_count, users, numParticipants, records, refreshDate } = this.props.country
    records.numParticipants = numParticipants
    if (!name) return <div />
    return (
      <div className='Country'>
        <header className='header--internal--green header--page'>
          <div className='row'>
            <div className='section-sub--left section-width-fifty-plus'>
              <h1 className='header--xlarge header--with-description-lg'>{name}</h1>
            </div>
            <div className='section-sub--right'>
              <ul>
                <li className='list--inline refresh'>
                  <span className='list-label'>Last refreshed: </span>
                  <span>{formatUpdateDescription(refreshDate)}</span>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <ScoreboardPanel title='' facets={[
          { label: 'Participants', value: formatDecimal(numParticipants) },
          { label: 'Edits', value: formatDecimal(edit_count) }
        ]} />
        <section className='section--tertiary'>
          <div className='row'>
            <Blurb {...records} />
          </div>
        </section>
        <section>
          <div className='row widget-container'>
            <div className='widget-50'>
              <h3 className='header--medium'>Top 15 Participants</h3>
              <CountryUserTable users={users} />
            </div>
            <div className='widget-50'>
              <div className='map-lg'>
                <CountryMap geography={this.props.country.geography} centroid={this.props.country.center} interactive />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

const connectedCountry = connect(['country'], actions)(Country)

export default connectedCountry

connectedCountry.getInitialProps = function ({ query }) {
  if (query) {
    const { code } = query
    return {
      code
    }
  } else {
    return {}
  }
}
