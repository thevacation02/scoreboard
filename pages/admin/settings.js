import React, { Component } from 'react'
import { connect } from 'unistore/react'

import Router from '../../lib/router'
import { actions } from '../../lib/store'
import { isAdmin } from '../../lib/utils/roles'
import NotLoggedIn from '../../components/NotLoggedIn'
import AdminHeader from '../../components/admin/AdminHeader'
import { LoadingState } from '../../components/common/LoadingState'
import { useForm } from 'react-hook-form'

function OSMesaSettings (props) {
  const { register, handleSubmit } = useForm()
  const onSubmit = props.handleSubmit

  return (
    <form className='form' onSubmit={handleSubmit(onSubmit)}>
      <div className='form__input-unit'>
        <label className='form__label' htmlFor='setting-osmesa-db'>OSMesa DB Connection String</label>
        <input type='text' name='osmesa-db' defaultValue={props.settings['osmesa-db']} ref={register} />
      </div>
      <div className='form__input-unit'>
        <label className='form__label' htmlFor='setting-osmesa-s3-bucket'>OSMesa Tile S3 Bucket</label>
        <input type='text' name='osmesa-s3-bucket' defaultValue={props.settings['osmesa-s3-bucket']} ref={register} />
      </div>
      <div className='form__input-unit'>
        <label className='form__label' htmlFor='setting-osmesa-s3-prefix'>OSMesa Tile S3 Prefix</label>
        <input type='text' name='osmesa-s3-prefix' defaultValue={props.settings['osmesa-s3-prefix']} ref={register} />
      </div>
      <div className='form__input-unit'>
        <label className='form__label' htmlFor='setting-osmesa-s3-key'>OSMesa S3 AWS key</label>
        <input type='text' name='osmesa-s3-key' defaultValue={props.settings['osmesa-s3-key']} ref={register} />
      </div>
      <div className='form__input-unit'>
        <label className='form__label' htmlFor='setting-osmesa-s3-secret'>OSMesa S3 AWS secret</label>
        <input type='text' name='osmesa-s3-secret' defaultValue={props.settings['osmesa-s3-secret']} ref={register} />
      </div>

      <input type='submit' className='button' value='submit' />
    </form>
  )
}

export class AdminSettings extends Component {
  constructor () {
    super()

    this.state = {
      loading: true,
      settings: {
        'osmesa-db': '',
        'osmesa-s3-prefix': '',
        'osmesa-s3-key': '',
        'osmesa-s3-secret': ''
      }
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount () {
    try {
      await this.props.getAuthenticatedUser()
      await this.props.getSettings()
      this.setState({ loading: false })
    } catch (err) {
      console.error(err)
      this.setState({ loading: false })
    }
  }

  async handleSubmit (data) {
    try {
      await this.props.updateSettings(data)
    } catch (e) {
      console.error(e)
    }
  }

  componentDidUpdate () {
    const { settings } = this.props
    if (settings && this.state.loading) {
      this.setState({
        loading: false,
        settings
      })
    }
  }

  render () {
    const { authenticatedUser } = this.props

    if (this.state.loading) {
      return (
        <div>
          <AdminHeader />
          <LoadingState />
        </div>
      )
    }

    if (!authenticatedUser.loggedIn) {
      return <NotLoggedIn />
    }

    if (!isAdmin(authenticatedUser.account.roles)) {
      return Router.push('/')
    }

    return (
      <div className='admin'>
        <AdminHeader />
        <section>
          <div className='row widget-container'>
            <div className='widget-25'>
              <h2 className='header--large'>Settings</h2>
            </div>
            <div className='widget-75'>
              <div>
                <h1 className='header--xlarge'>OSMesa Settings</h1>
                <p>Scoreboard statistics are powered by <a href='https://github.com/azavea/osmesa'>OSMesa</a>. Only change these settings if you are operating Scoreboard with a custom instance of OSMesa.</p>
              </div>
              <div>
                <OSMesaSettings handleSubmit={this.handleSubmit} settings={this.state.settings} />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default connect(['authenticatedUser', 'settings', 'error', 'admin'], actions)(AdminSettings)
