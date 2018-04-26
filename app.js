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
    addItem: ({type, desc, value}) => {
      //Create new Id
      const notFirst = data.allItems[type].length !== 0
      const id = notFirst ? data.allItems[type].slice(-1)[0].id + 1 : 0

      //Create new Item
      const newItem = type === 'exp' ? createExpense(id, desc, value) : createIncome(id, desc, value)

      //Store previous state
      const prevState = data.allItems[type]

      //Return previous state and new item to data structure 
      data.allItems[type] = [...prevState, newItem ]
    
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
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
  }

  return {
    getinput: _ => {
      const type = document.querySelector(DOMstrings.inputType).value // inc or exp
      const desc = document.querySelector(DOMstrings.inputDescription).value
      const value = document.querySelector(DOMstrings.inputValue).value
  
      return { type, desc, value }
    },

    addListItem: (obj, type) => {
      const isIncome = type === 'inc'

      //set HTML depending on income or expense
      const idHTML = isIncome ? `income-${obj.id}` : `expense-${obj.id}`
      const valueHTML = isIncome ? `+ ${obj.value}` : `- ${obj.value}`
      const descHTML = obj.description

      //set element to insert html
      const element = isIncome ? DOMstrings.incomeContainer : DOMstrings.expenseContainer

      const html = `<div class="item clearfix" id="${idHTML}">
                      <div class="item__description">${descHTML}</div>
                        <div class="right clearfix">
                          <div class="item__value">${valueHTML}</div>
                          ${isIncome ? `<div class="item__percentage">21%</div>` : ''}
                          <div class="item__delete">
                          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                      </div>
                    </div>`
      //Insert into DOM                    
      document.querySelector(element).insertAdjacentHTML('beforeend', html)
    },

    DOMstrings: {...DOMstrings},
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
    const newItem = budgetCtrl.addItem({...input})
    
    // add item to ui
    UICtrl.addListItem(newItem, input.type)

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