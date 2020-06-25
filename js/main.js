'use strict';

const start = document.getElementById('start'); 
const cancel = document.getElementById('cancel');                                
let btnPlus = document.getElementsByTagName('button');  
let incomePlus = btnPlus[0];
let expensesPlus = btnPlus[1];
let depositCheck = document.querySelector('#deposit-check');                        //Чекбокс 
let additionalIncomeItem = document.querySelectorAll('.additional_income-item');     // Ввода возможных доходов
let salaryAmount = document.querySelector('.salary-amount');                        //Месячный доход*
// let incomeInput = document.querySelector('.income-title');                        //Дополнительный доход- наименование
// let amountInput = document.querySelector('.income-amount');                      //Дополнительный доход- сумма
let additionalInputncome1 = document.querySelectorAll('.additional_income-item')[0]; //Возможный доход
let additionalInputncome2 = document.querySelectorAll('.additional_income-item')[1]; //Возможный доход
let expensesTitle = document.querySelector('.expenses-title'); 
let expensesItems = document.querySelectorAll('.expenses-items');                   // Обязательные расходы
//let expensesAmount = document.querySelector('.expenses-amount');                  // Обязательные расходы - сумма
let additionalExpensesItem = document.querySelector('.additional_expenses-item');   //Возможные расходы 
let targetAmount = document.querySelector('.target-amount');                        // Цель
let periodSelect = document.querySelector('.period-select');                        // Период расчета
let periodAmount = document.querySelector('.period-amount');
let resultTotal = document.querySelector('.result-total');                          // Доход за месяц
let budgetMonthValue = document.querySelector('.budget_month-value');
let budgetDayValue = document.querySelector('.budget_day-value');                   // Дневной бюджет
let expensesMonthValue = document.querySelector('.expenses_month-value');           //Расход за месяц
let additionalIncomeValue = document.querySelector('.additional_income-value');     //Возможные доходы
let additionalExpensesValue = document.querySelector('.additional_expenses-value'); //Возможные расходы 
let incomePeriodValue = document.querySelector('.income_period-value');             // Накопления за период 
let targetMonthValue = document.querySelector('.target_month-value');               //Срок достижения цели в месяцах
let incomeItems = document.querySelectorAll('.income-items');



    //LESSON 1-8

let isText = function(str) {
    let pattern = new RegExp('[^а-яё\S]', 'gi');
    return str.match(pattern);
}

let isString = function(s){
    return (typeof s) === 'string' && s !== '';
}

const AppData = function() {
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];    // дополнительные доходы
    this.expenses = {};     // дополнительные расходы
    this.addExpenses = [];  // возможные расходы
    this.deposit = false; 
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
};

AppData.prototype.start = function() {
    if(salaryAmount.value === '') {
        start.setAttribute('disable', true);
        return;
    } else {
        start.setAttribute('disable', false);
    }

    let allInput = document.querySelectorAll('.data input[type = text]');
    
    allInput.forEach(function(item){
        item.setAttribute('disabled','true');
    });

    expensesPlus.setAttribute('disabled','true');
        incomePlus.setAttribute('disabled','true');
        start.style.display = 'none';
        cancel.style.display = 'block';
        this.budget = +salaryAmount.value;
        this.getExpenses();
        this.getIncome();
        this.getExpensesMonth();
        this.getAddExpenses();
        this.getAddIncome();
        this.getBudget();
        this.showResult();
};

AppData.prototype.reset = function() {

    let dataAllInput = document.querySelectorAll('.data input[type = text]');
        
    let resultInputAll = document.querySelectorAll('.result input[type = text]');
        
    dataAllInput.forEach(function(elem){
        elem.value = '';
        elem.removeAttribute('disabled');
        periodSelect.value = '0';
        periodAmount.innerHTML = periodSelect.value;
     });
     resultInputAll.forEach(function(elem){
            elem.value = '';
     });


     for(let i = 0; i < incomeItems.length; i++){
         if(i>0) {
            incomeItems[i].parentNode.removeChild(incomeItems[i]);
            incomePlus.style.display = 'block';
        }
    }


    for(let i = 0; i < expensesItems.length; i++){
         if(i>0) {
            expensesItems[i].parentNode.removeChild(expensesItems[i]);
            expensesPlus.style.display = 'block';
         }
     }
    start.style.display = 'block';
    cancel.style.display = 'none'; 
    expensesPlus.removeAttribute('disabled');
    incomePlus.removeAttribute('disabled');
    depositCheck.checked = false;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {}; 
    this.addExpenses = [];
    this.deposit = false; 
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
        
};

AppData.prototype.showResult = function(){ 
    const _this = this;
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    targetAmount.value = this.getTargetMonth();
    incomePeriodValue.value = _this.calsSaveMoney();
    periodSelect.addEventListener('input', function() {
        incomePeriodValue.value = _this.calsSaveMoney();
      });
};
AppData.prototype.addExpensesBlock = function() {

     let cloneExpensesItem = expensesItems[0].cloneNode(true);
     expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
     expensesItems = document.querySelectorAll('.expenses-items');
     if(expensesItems.length === 3) {
        expensesPlus.style.display = 'none';
     }
};

AppData.prototype.getExpenses = function() {
    const _this = this;
    expensesItems.forEach(function(item){
          let itemExpenses = item.querySelector('.expenses-title').value;
         let cashExpenses = item.querySelector('.expenses-amount').value;
          if(itemExpenses !== '' && cashExpenses !== ''){
           _this.expenses[itemExpenses] = cashExpenses;
       }
     });
};

AppData.prototype.addIncomeBlock = function(){
     let cloneIncomeItem = incomeItems[0].cloneNode(true);
     incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
    incomeItems = document.querySelectorAll('.income-items');
    if(incomeItems.length === 3){
          incomePlus.style.display = 'none';
    }
};
AppData.prototype.getIncome = function(){
    const _this = this;
    incomeItems.forEach(function(item){
           let itemIncome = item.querySelector('.income-title').value;
          let cashIncome = item.querySelector('.income-amount').value;
         if(itemIncome !=='' &&  cashIncome !== ''){
             _this.income[itemIncome] = cashIncome;
        }
         for(let key in _this.income){
             _this.incomeMonth += +_this.income[key];
         }
     });
        
}; 
    
AppData.prototype.getAddExpenses = function(){
    const _this = this;
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item){
      item = item.trim();
      if (item !== ''){
        _this.addExpenses.push(item);
      }
     });
};

AppData.prototype.getAddIncome = function(){
    const _this = this;
    additionalIncomeItem.forEach(function(item){
    let itemValue = item.value.trim();
    if (itemValue !== ''){
      _this.addIncome.push(itemValue);
    }
    });
};
      //Сумма расходов
AppData.prototype.getExpensesMonth = function() {
    for (let key in this.expenses) {
        this.expensesMonth += +this.expenses[key];
    }
    //console.log('Расходы за месяц ' + this.expensesMonth + ' рублей');
};

      // Бюджет в месяц и день
AppData.prototype.getBudget = function() {
    this.budgetMonth =  this.budget + +this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
};

    // Достижение цели
AppData.prototype.getTargetMonth = function() {
    return (Math.ceil(targetAmount.value / this.budgetMonth));
};

     // Уровень дохода
AppData.prototype.getStatusIncome = function() {
    if (this.budgetDay > 1200) {
    console.log('У вас высокий уровень дохода');
    } else if (600 < this.budgetDay){ 
    console.log('У вас средний уровень дохода');
    } else if (0 < this.budgetDay) {
        console.log('У вас средний уровень дохода');
    } else if (0 > this.budgetDay) {
        console.log('Что то пошло не так');
    }
};
        
     // Deposit in bank
AppData.prototype.etInfoDeposit = function() {
    if (this.deposit) {
        do {
            this.percentDeposit = prompt('Какой годовой процент?', '10'); 
        } 
        while(!isText(this.percentDeposit));
        do {
            this.moneyDeposit = prompt('Какая сумма заложена?', 10000);
        }
        while(!isText(this.moneyDeposit));
    }
};
AppData.prototype.updatePeriod = function(){
    document.querySelector('.period-amount').textContent = periodSelect.value;
};


AppData.prototype.calsSaveMoney = function() {
    return this.budgetMonth * periodSelect.value;
};

AppData.prototype.eventListener = function() {
    start.addEventListener('click', appData.start.bind(appData));
    cancel.addEventListener('click', appData.reset.bind(appData));
    incomePlus.addEventListener('click', appData.addIncomeBlock);
    expensesPlus.addEventListener('click', appData.addExpensesBlock);
    periodSelect.addEventListener('input', appData.updatePeriod);
}

const appData = new AppData();

appData.eventListener();
console.log(appData);

