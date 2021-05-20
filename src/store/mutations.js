export default {

  setState: (state, options) => {

    state[options.name] = options.value

  },

  changeSelectedDates: (state, selectedDate) => {

    if (state.selectedDates.find(d => d == selectedDate)) state.selectedDates = state.selectedDates.filter(d => d != selectedDate)

    else state.selectedDates.push(selectedDate)

  },

}