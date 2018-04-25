// BUDGET CONTROLLER
const budgetController = ( _ => {

  //Some code

})()


// UI CONTROLLER
const UIController = ( _ => {
  
  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getinput: _ => {
      const type = document.querySelector(DOMstrings.inputType).value // inc or exp
      const desc = document.querySelector(DOMstrings.inputDescription).value
      const value = document.querySelector(DOMstrings.inputValue).value
  
      return { type, desc, value }
    },
    DOMstrings: {...DOMstrings}
  }
})()


// GLOBAL APP CONTROLLER
const controller = ((budgetCtrl, UICtrl) => {

  const ctrlAddItem = _ => {
    // get input 
    const input = UICtrl.getinput()

    console.log(input)
    console.log(UICtrl.DOMstrings)
    // add item to budget

    // add item to ui

    // calc budget

    // display

  }

  document.querySelector(UICtrl.DOMstrings.inputBtn).addEventListener('click', ctrlAddItem)

  document.addEventListener('keypress', e => {
    if(e.keyCode === 13 || e.which === 13) { ctrlAddItem }
  })


})(budgetController, UIController)