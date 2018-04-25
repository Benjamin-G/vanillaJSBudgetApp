// BUDGET CONTROLLER
const budgetController = ( _ => {

  const createExpense = (id, description, value) => ({
    id,
    description,
    value
  })

  const createIncome = (id, description, value) => ({
    id,
    description,
    value
  })
  
  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

  return {
    addItem: ({type, des, val}) => {
      //Create new Id
      const notFirst = data.allItems[type].length !== 0
      const id = notFirst ? data.allItems[type].slice(-1)[0].id + 1 : 0

      //Create new Item
      const newItem = type === 'exp' ? createExpense(id, des, val) : createIncome(id, des, val)

      //Store previous state
      const prevState = data.allItems[type]

      //Return previous state and new item to data structure 
      data.allItems[type] = [...prevState, newItem ]
      
      console.log(data) //Checking data structure

      return newItem
    }
  }
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

  const setupEventListeners = _ => {
    const DOMstrings = UICtrl.DOMstrings

    document.querySelector(DOMstrings.inputBtn).addEventListener('click', ctrlAddItem)

    document.addEventListener('keypress', e => {
      if(e.keyCode === 13 || e.which === 13) { ctrlAddItem() }
    })
  }

  const ctrlAddItem = _ => {
    // get input 
    const input = UICtrl.getinput()

    // add item to budget
    const newItem = budgetController.addItem({...input})

    // add item to ui

    // calc budget

    // display
  }
  return {
    init: _ => {
      console.log('Application has started')
      setupEventListeners()
    }
  }
})(budgetController, UIController)

controller.init()