import api, { createApiUrl } from '../../utils/api'

function updateCampaigns (store, storeData) {
  store.setState({ campaigns: { ...storeData, apiStatus: 'LOADING' } })
  let { searchText: q, page, compl_min, compl_max } = storeData

  api('get', createApiUrl('/api/campaigns', { q, page, compl_min, compl_max }))
    .then(res => {
      store.setState({ campaigns: { ...storeData, apiStatus: 'SUCCESS', records: res.data } })
    })
    .catch(err => {
      console.log(err)
      store.setState({ campaigns: { ...storeData, apiStatus: 'ERROR' } })
      store.setState({ notification: { type: 'error', message: err.message } })
    })
}

export default store => ({
  handleCampaignsSearch (state, value) {
    const { campaigns } = state
    campaigns.page = 1
    campaigns.searchText = value
    updateCampaigns(store, campaigns)
  },

  handleCampaignsPageChange (state, page) {
    const { campaigns } = state
    campaigns.page = page
    updateCampaigns(store, campaigns)
  },

  handleCampaignsFilterChange (state, completeness) {
    const { campaigns } = state
    const { min: compl_min, max: compl_max } = completeness
    campaigns.page = 1
    campaigns.compl_min = compl_min
    campaigns.compl_max = compl_max
    updateCampaigns(store, campaigns)
  }
})