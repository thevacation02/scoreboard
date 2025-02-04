import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { connect } from 'unistore/react'
import { merge } from 'ramda'

import { distanceInWordsToNow } from 'date-fns'
import Router from '../lib/router'

import { actions } from '../lib/store'
import CampaignTable from '../components/campaign/CampaignTable'
import ReactMarkdown from 'react-markdown'
import { formatUpdateDescription } from '../lib/utils/format'
import ScoreboardPanel from '../components/ScoreboardPanel'
import Blurb from '../components/campaign/CampaignBlurb'

const CampaignMap = dynamic(
  () => import('../components/charts/LeafletCampaignMap'),
  {
    ssr: false
  }
)

const TABLE_TITLES = {
  'osmesa': 'Mapping metrics',
  'maproulette': 'Challenge Leaderboard',
  'maproulette-challenge': 'Challenge Task Progress'
}

export class Campaign extends Component {
  componentDidMount () {
    this.props.getCampaign(this.props.id)
  }

  addFavoriteCampaign () {
    const { authenticatedUser } = this.props
    const { account } = authenticatedUser
    if (!account) {
      Router.push('/auth/openstreetmap')
      return
    }
    const campaignId = this.props.campaign.meta.id

    this.props.addFavoriteCampign({
      user_id: account.uid,
      campaign_id: campaignId
    })
  }

  getFavoriteByCampaignId (id) {
    const { authenticatedUser } = this.props
    const { favorites } = authenticatedUser.account

    return favorites.find(item => {
      return item.campaign_id === id
    })
  }

  removeFavoriteCampaign () {
    const campaignId = this.props.campaign.meta.id
    const { id } = this.getFavoriteByCampaignId(campaignId)
    this.props.removeFavoriteCampaign(id)
  }

  renderFavoriteButton () {
    const { authenticatedUser, campaign } = this.props
    const campaignId = campaign.meta.id

    if (!authenticatedUser || !authenticatedUser.loggedIn) {
      return (
        <button className='button' onClick={() => this.addFavoriteCampaign()}>
          Log in to favorite
        </button>
      )
    }

    const alreadyFavorited = !!this.getFavoriteByCampaignId(campaignId)

    if (alreadyFavorited) {
      return (
        <button
          className='button'
          onClick={() => this.removeFavoriteCampaign()}
        >
          Remove favorite
        </button>
      )
    }

    return (
      <button className='button' onClick={() => this.addFavoriteCampaign()}>
        Add favorite
      </button>
    )
  }

  render () {
    const { meta, lastUpdate, creationDate, refreshDate, tables } = this.props.campaign
    const panelContent = this.props.campaign.panelContent || []
    const orderedTables = tables && tables.sort((a, b) => { return a.statsType === 'osmesa' ? -1 : b.statsType === 'osmesa' ? 1 : 0 })

    return (
      <div className='Campaigns'>
        <header className='header--internal--green header--page'>
          <div className='row widget-container'>
            <div className='widget-66' style={{ 'pointerEvents': 'none' }}>
              <h1 className='header--xlarge margin-top-sm'>{meta.name}</h1>
              <ul className='list--two-column'>
                <li>
                  <span className='list-label'>Tasking Manager:</span>
                  <strong>{meta.tm_name}</strong>
                </li>
                <li>
                  <span className='list-label'>Project Number:</span>
                  <strong>#{meta.tm_id}</strong>
                </li>
                <li>
                  <span className='list-label'>Last Updated</span>
                  <strong>{distanceInWordsToNow(lastUpdate)} ago</strong>
                </li>
                <li>
                  <span className='list-label'>Created</span>
                  <strong>{distanceInWordsToNow(creationDate)} ago</strong>
                </li>
              </ul>
              <ul>
                <li className='list--inline refresh'>
                  <span className='list-label'>Last refreshed</span>
                  <span>{formatUpdateDescription(refreshDate)}</span>
                </li>
              </ul>
            </div>
            <div className='widget-33 page-actions'>
              {this.renderFavoriteButton()}
              <a className='button' href={meta.url}>Contribute</a>
            </div>
          </div>
        </header>
        <ScoreboardPanel title='' facets={panelContent} />

        <section>
          <div className='row widget-container'>
            <div className='widget-50'>
              <div className='text-body'><ReactMarkdown source={meta.description} /></div>
            </div>
            <div className='widget-50'>
              <div className='map-lg'>
                <CampaignMap feature={JSON.parse(meta.geometry)} interactive />
              </div>
            </div>
            <div className='widget-33 page-actions'>
              <a className='button button--secondary' href={meta.url}>Contribute</a>
            </div>
          </div>
        </section>
        <section className='section--tertiary'>

          {
            orderedTables && orderedTables.map(data => (
              <div className='row' key={data.statsType}>
                {
                  (data.success)
                    ? <div>
                      {data.statsType === 'osmesa' && <Blurb {...merge({ users: [], editCounts: 0 }, data)} />}
                      <h2>{TABLE_TITLES[data.statsType]}</h2>
                      <CampaignTable
                        data={data.data}
                        type={data.statsType}
                        name={meta.name}
                        schema={data.schema}
                        sortable={data.sortable === undefined ? true : data.sortable}
                      />
                    </div>
                    : <p>There was an error retrieving stats for this campaign.</p>
                }
              </div>))
          }

        </section>
      </div>
    )
  }
}

const Page = connect(
  ['authenticatedUser', 'campaign'],
  actions
)(Campaign)

export default Page

Page.getInitialProps = ({ query }) => {
  if (query) {
    const { id } = query
    return {
      id
    }
  } else {
    return {}
  }
}
