import React, { Component } from 'react'
import Select from 'react-select'
import { connect } from 'unistore/react'

import api from '../lib/utils/api'
import countries from '../lib/utils/country-list'
import { actions } from '../lib/store'

import NotLoggedIn from '../components/NotLoggedIn'

import '../styles/Users.scss'
import 'react-select/dist/react-select.css'

class UserEdit extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  updateUser (data) {
    const { id } = this.props

    api('put', `/api/users/${id}`, data)
      .then(res => {
        this.setState({ saved: true })
        this.props.setNotification({ type: 'info', message: '✓ Saved' })
      })
      .catch(err => {
        console.log(err)
        this.props.setNotification({ type: 'error', message: 'Could not update user' })
      })
  }

  onCountryChange (country) {
    const { currentCountry } = this.state
    if (!country || country.value === currentCountry) return
    this.setState({ currentCountry: country.value })
    this.updateUser({ country: country.value })
  }

  render () {
    const { authenticatedUser, currentCountry } = this.props

    const country = this.state.currentCountry || currentCountry

    if (!authenticatedUser.loggedIn) {
      return <NotLoggedIn message='Log in with your OSM account to edit your Scoreboard profile' />
    }

    return (
      <div className='UserEdit'>
        <header className='header--internal '>
          <div className='row'>
            <h1 className='header--xlarge'>Edit Profile</h1>
          </div>
        </header>
        <section className='section--primary'>
          <div className='row'>
            <div style={{ width: '50%' }}>
              <h4>Country</h4>
              <Select
                options={countries}
                value={country}
                onChange={(country) => this.onCountryChange(country)}
              />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

const Page = connect(['authenticatedUser', 'user'], actions)(UserEdit)

/*
* because of how unistore wraps the component, the static method wasn't
* available unless attached to the component here
*/
Page.getInitialProps = async ({ req, query }) => {
  const { id } = query
  const res = await api('get', `/api/users/${id}`)
  const { country } = res.data
  return { id, currentCountry: country }
}

export default Page