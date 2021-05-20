export default {

  selectDate: ({state, getters, commit, dispatch}, options = {}) => {

    commit('changeSelectedDates', options.date)

  }

}