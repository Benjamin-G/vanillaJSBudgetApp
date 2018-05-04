// BUDGET CONTROLLER
const budgetController = ( _ => {

  const createIncome = (id, description, value) => ({
    id,
    description,
    value
  })

  const createExpense =  (id, description, value) => ({
    id,
    description,
    value,
    calcPercent: totalInc => {
      if(totalInc > 0){
        return Math.round((value / totalInc * 100))
      } else {
        return -1
      }
    } 
  })

  const calcTotal = type => {
    data.totals[type] = data.allItems[type].reduce((acc, ele) => acc + ele.value, 0)
  }
  
  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  }

  return {
    addItem: ({type, desc, value}) => {
      //Create new Id
      const notFirst = data.allItems[type].length !== 0
      const id = notFirst ? data.allItems[type].slice(-1)[0].id + 1 : 0

      //Create new Item
      //const newItem = createBudgetItem(id,desc,value)
      const newItem = type === 'inc' ? createIncome(id,desc,value) : createExpense(id,desc,value)

      //Store previous state
      const prevState = data.allItems[type]

      //Return previous state and new item to data structure 
      data.allItems[type] = [...prevState, newItem ]
    
      return newItem
    },

    deleteItem: (type, id) => {
      //store previous state
      const prevState = data.allItems[type]
      //update data structure 
      data.allItems[type] = prevState.filter(x => x.id !== parseInt(id))
    },

    calcBudget: _ => {
      // calc total income and expenses
      calcTotal('exp')
      calcTotal('inc')

      // calc budget
      data.budget = data.totals.inc - data.totals.exp

      // calc percent
      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
      }else { data.percentage = -1 }
    },

    //New Method return an array of percentages
    calcPercentages: _ => data.allItems.exp.map(x => x.calcPercent(data.totals.inc)),

    getBudget: _ => ({
      budget: data.budget,
      totalInc: data.totals.inc,
      totalExp: data.totals.exp,
      percentage: data.percentage,
    }),

    testing: _ => {
      console.log(data)
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
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage'
  }

  const formatNumber = (num, type) => {
    const numArr = Math.abs(num).toFixed(2).split('.')

    let int = numArr[0]
    const dec = numArr[1]

    const length = int.length

    if(length > 3) {
      int = int.substr(0, length - 3)+','+int.substr(length-3,length)
    }

    return (type === 'inc' ? '+' : '-') + ' ' + int + '.' + dec
  }

  return {
    getinput: _ => {
      const type = document.querySelector(DOMstrings.inputType).value // inc or exp
      const desc = document.querySelector(DOMstrings.inputDescription).value
      const value = parseFloat(document.querySelector(DOMstrings.inputValue).value)
  
      return { type, desc, value }
    },

    addListItem: (obj, type) => {
      // Is this an income or expense
      const isIncome = type === 'inc'

      //set HTML depending on income or expense
      const idHTML = isIncome ? `inc-${obj.id}` : `exp-${obj.id}`
      //const valueHTML = isIncome ? `+ ${obj.value}` : `- ${obj.value}`
      const valueHTML = formatNumber(obj.value, type)
      const descHTML = obj.description

      //set element to insert html
      const element = isIncome ? DOMstrings.incomeContainer : DOMstrings.expenseContainer

      const html = `<div class="item clearfix" id="${idHTML}">
                      <div class="item__description">${descHTML}</div>
                        <div class="right clearfix">
                          <div class="item__value">${valueHTML}</div>
                          ${!isIncome ? `<div class="item__percentage"></div>` : ''}
                          <div class="item__delete">
                          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                      </div>
                    </div>`

      //Insert into DOM                    
      document.querySelector(element).insertAdjacentHTML('beforeend', html)
    },

    deleteListItem: id => {
      const el = document.getElementById(id)
      //Delete child from parent
      el.parentNode.removeChild(el)
    },

    clearFields: _ => {
      // Select the fields
      const fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`)

      //Convert list to array
      const fieldsArr = Array.prototype.slice.call(fields)

      // Set all fields to empty strings
      fieldsArr.forEach(element => element.value = '' )

      // Reset focus
      fieldsArr[0].focus()
    },

    displayBudget: ({budget, totalInc, totalExp, percentage}) => {
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(budget, (totalInc > totalExp ? 'inc' : 'exp'))
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(totalInc, 'inc') 
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(totalExp, 'exp')
      document.querySelector(DOMstrings.percentageLabel).textContent = percentage > 0 ? percentage + '%' : '---'
    },

    displayPercentages: percentages => {
      const fields = document.querySelectorAll(DOMstrings.expensesPercLabel)

      // for each function for node lists
      const nodeListForEach = (list, callback) => {
        for(let i =0; i < list.length; i++){
          callback(list[i], i)
        }
      }
      
      nodeListForEach(fields, (current, index) => {
        if(percentages[index] > 0){
          current.textContent = percentages[index] + '%'
        }else{
          current.textContent = '---'
        }
      })
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

    //Event delegation, this is the container all delete buttons have in common
    document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem)
  }

  const updateBudget = _ => {
    // calc budget
    budgetCtrl.calcBudget()
    // return budget
    const budget = budgetCtrl.getBudget()
    // display
    UICtrl.displayBudget({...budget})
  }

  const updatePercentages = _ => {
    const percentages = budgetCtrl.calcPercentages()

    UICtrl.displayPercentages(percentages)
  }

  const ctrlAddItem = _ => {
    // get input 
    const input = UICtrl.getinput()

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      // add item to budget
      const newItem = budgetCtrl.addItem({...input})
      
      // add item to ui
      UICtrl.addListItem(newItem, input.type)
  
      // clear fields
      UICtrl.clearFields()
  
      // calc and update budget 
      updateBudget()

      // calc and update percentages
      updatePercentages()
    }
  }

  const ctrlDeleteItem = e => {
    const itemID = e.target.parentNode.parentNode.parentNode.parentNode.id
    if(itemID) {
      //Store fields
      const splitID = itemID.split('-')
      const type = splitID[0]
      const id = splitID[1]

      //Delete from data structure
      budgetCtrl.deleteItem(type, id)

      //Remove item of UI
      UICtrl.deleteListItem(itemID)

      //Update Budget
      updateBudget()

      // calc and update percentages
      updatePercentages()
    }
  }

  return {
    init: _ => {
      console.log('Application has started')
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      })
      setupEventListeners()
    }
  }
})(budgetController, UIController)

controller.init()