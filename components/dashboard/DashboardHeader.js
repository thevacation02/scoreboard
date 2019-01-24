import React from 'react'
import Link from '../Link'
import { distanceInWordsToNow, parse, compareDesc } from 'date-fns'
import { head } from 'ramda'

/**
 * Given the edit times for a user return the difference between now()
 * and the last edit of that user in words (e.g 3 days ago.);
 *
 * @param {Array[Date]} edit_times
 */
function getLastEdit (edit_times) {
  if (edit_times.length === 0) {
    return `N/A`
  }

  const days = edit_times.map(time => parse(time.day))
  const lastEdit = head(days.sort(compareDesc))
  return `${distanceInWordsToNow(lastEdit)} ago`
}

function DashboardHeader (props) {
  const { loggedIn, id, edit_times, country, name, profileImage } = props

  return (
    <header className='header--internal--green header--page'>
      <div className='row'>
        <div className='header--content--wrapper'>
          {
            profileImage
              ? <div>
                {<img className='profile--thumb' style={{ float: 'left' }} src={profileImage} alt='Profile pic' />}
              </div>
              : <div />
          }
          <div>
            <h1 className='header--xlarge header--with-description'>{name}</h1>
            <ul className='list--two-column clearfix'>
              <li>
                <span className='list-label'>Last Edit:</span>
                <span>{getLastEdit(edit_times)}</span>
              </li>
              <li>
                <span className='list-label'>Country:</span>
                <span>{country}</span>
              </li>
            </ul>
            {
              loggedIn
                ? <Link href={`/users/${id}`}><a className='link--large'>View Public Profile</a></Link>
                : <div />
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader