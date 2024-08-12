import './App.css';
import React from 'react';
import { useState } from 'react';
import VariableBox from './VariableBox';

const DAYS_IN_A_MONTH = 30;
const PRICE_PER_KWH = 0.8;
const PRICE_PER_SAUCE = 5;
const EURO_VALUE = 4.98;
const TAX_VALUE_PERCENTAGE = 0.1;
const SAUCE_FREQUENCY = 0.5;
const SAUCE_COST_PRICE = 1;
const OVEN_CONSUMPTION_KW = 8.4;
const PIZZA_BOX_COST_PRICE = 8.4;
const SALARY_TAX_TO_GROSS_MULTIPLIER = 1.67;
const MONTHLY_RENT_PRICE_EURO = 1000;
const OVEN_DAILY_RUNNING_HOURS = 12;

function App() {
  const [pizzasSoldPerDay, setPizzasSoldPerDay] = useState(120);
  const [averagePizzaSellPrice, setAveragePizzaSellPrice] = useState(42);
  const [averagePizzaCreatePrice, setAveragePizzaCreatePrice] = useState(10);
  const [salaryOne, setSalaryOne] = useState(5000);
  const [salaryTwo, setSalaryTwo] = useState(5000);
  const [shareOne, setShareOne] = useState(0.25);
  const [shareTwo, setShareTwo] = useState(0.25);
  const [shareThree, setShareThree] = useState(0.5);

  const moneyFromPizza = averagePizzaSellPrice * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const moneyFromSauces = PRICE_PER_SAUCE * (pizzasSoldPerDay * SAUCE_FREQUENCY) * DAYS_IN_A_MONTH;

  const pizzaCostPerMonth = averagePizzaCreatePrice * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const sauceCostPerMonth = SAUCE_COST_PRICE * SAUCE_FREQUENCY * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const pizzaBoxesCostPerMonth = PIZZA_BOX_COST_PRICE * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const ovenCostPerMonth = Math.round(OVEN_CONSUMPTION_KW * PRICE_PER_KWH * OVEN_DAILY_RUNNING_HOURS * DAYS_IN_A_MONTH);
  const monthlyIncome = moneyFromPizza + moneyFromSauces;
  const monthlyCosts =
    pizzaCostPerMonth +
    sauceCostPerMonth +
    pizzaBoxesCostPerMonth +
    ovenCostPerMonth +
    salaryOne * SALARY_TAX_TO_GROSS_MULTIPLIER +
    salaryTwo * SALARY_TAX_TO_GROSS_MULTIPLIER +
    MONTHLY_RENT_PRICE_EURO * EURO_VALUE +
    TAX_VALUE_PERCENTAGE * monthlyIncome;

  const monthlyProfit = monthlyIncome - monthlyCosts;

  return (
    <div className="App">
      <h1 className="App-header">Pizza Bună SRL</h1>
      <div className="section" style={{ paddingTop: 150 }}>
        <div>
          <h4>Pizzas Sold Per Day:</h4>
          <input value={pizzasSoldPerDay} onChange={(e) => setPizzasSoldPerDay(+e.target.value)} />
        </div>
        <div>
          <h4>Average Pizza Sell Price (RON):</h4>
          <input value={averagePizzaSellPrice} onChange={(e) => setAveragePizzaSellPrice(+e.target.value)} />
        </div>
        <div>
          <h4> Pizza Production Price (RON):</h4>
          <input value={averagePizzaCreatePrice} onChange={(e) => setAveragePizzaCreatePrice(+e.target.value)} />
        </div>
        <div>
          <h4>1st Salary (RON NET):</h4>
          <input value={salaryOne} onChange={(e) => setSalaryOne(+e.target.value)} />
        </div>
        <div>
          <h4>2nd Salary (RON NET):</h4>
          <input value={salaryTwo} onChange={(e) => setSalaryTwo(+e.target.value)} />
        </div>
      </div>
      <div className="section">
        <h2>💹⬆️ Recurring Monthly Income</h2>
        <div>
          <VariableBox green variable="RON / month" value={Math.round(monthlyIncome)} />
          <VariableBox green variable="€ / month" value={Math.round(monthlyIncome / EURO_VALUE)} bold />
        </div>
        <h3>🍕 From Selling Pizza: </h3>
        <div>
          <VariableBox green variable="Average 🍕 Sell Price" value={averagePizzaSellPrice + ' RON'} />
          *
          <VariableBox green variable="Sold Per Day" value={`${pizzasSoldPerDay} pizzas`} />=
          <VariableBox green variable="RON / day" value={moneyFromPizza / 30} />
          =
          <VariableBox green variable="Per month" value={ronAndEuro(moneyFromPizza)} />
        </div>
        <h3>🍅 From Selling Sauce: </h3>
        <div>
          <VariableBox green variable="🍅 Sell Price" value={`${PRICE_PER_SAUCE} RON`} /> *
          <VariableBox green variable="Sold Per Day" value={`${pizzasSoldPerDay * SAUCE_FREQUENCY} `} /> =
          <VariableBox green variable="RON / day" value={moneyFromSauces / 30} /> =
          <VariableBox green variable="Per month" value={ronAndEuro(moneyFromSauces)} />
        </div>
      </div>
      <div className="section">
        <h2>💸🔻 Recurring Monthly Costs</h2>
        <div>
          <VariableBox variable="RON / month" value={Math.round(monthlyCosts)} />
          <VariableBox variable="€ / month" value={Math.round(monthlyCosts / EURO_VALUE).toLocaleString()} bold />
        </div>
        <h3>🫓🧀🌿 Pizza Ingredients Cost: </h3>
        <div>
          <VariableBox variable="Pizza Prod. Cost" value={averagePizzaCreatePrice} />
          *
          <VariableBox variable="Pizzas Per Day" value={pizzasSoldPerDay} />
          =
          <VariableBox variable="RON / day" value={pizzaCostPerMonth / 30} />
          =
          <VariableBox variable="RON / month" value={pizzaCostPerMonth} />
        </div>
        <h3>🥫 Buying Sauce: </h3>
        <div>
          <VariableBox variable="Sauce Price" value={SAUCE_COST_PRICE} />
          *
          <VariableBox variable="Sauce Freq." value={SAUCE_FREQUENCY} />*
          <VariableBox variable="Pizzas Per Day" value={pizzasSoldPerDay} />=
          <VariableBox variable="RON / day" value={sauceCostPerMonth / 30} /> =
          <VariableBox variable="RON / month" value={sauceCostPerMonth} />
        </div>
        <h3>📦 Buying Pizza Boxes: </h3>
        <div>
          <VariableBox variable="Pizza Box Price" value={PIZZA_BOX_COST_PRICE} />
          *
          <VariableBox variable="pizzasPerDay" value={pizzasSoldPerDay} />
          =
          <VariableBox variable="RON / day" value={pizzaBoxesCostPerMonth / 30} />
          =
          <VariableBox variable="RON / month" value={pizzaBoxesCostPerMonth} />
        </div>
        <h3>⚡ Electric Oven Running: </h3>
        <div>
          <VariableBox variable="Consumption" value={`${OVEN_CONSUMPTION_KW} kW/h`} />*
          <VariableBox variable="Price per kWH" value={`${OVEN_CONSUMPTION_KW} RON`} />*
          <VariableBox variable="Hours / day" value={OVEN_DAILY_RUNNING_HOURS} />
          =
          <VariableBox variable="Per month" value={`${ovenCostPerMonth} RON`} />
        </div>
        <h3>🏠 Rent: </h3>
        <VariableBox variable="Per Month" value={ronAndEuro(MONTHLY_RENT_PRICE_EURO * EURO_VALUE)} />
        <h3>🏦 Income Tax (1%): </h3>
        <VariableBox variable="Per Month" value={ronAndEuro(monthlyIncome * 0.1)} />
        <h3>💸 1st Salary:</h3>
        <div>
          <VariableBox variable="Tax RON / Month" value={salaryOne * 1.67 * 0.4} />+
          <VariableBox variable="NET RON / Month" value={salaryOne} /> =
          <VariableBox variable="Gross RON / Month" value={salaryOne * 1.67} />
        </div>
        <h3>💸 2nd Salary: </h3>
        <div>
          <VariableBox variable="Tax RON / Month" value={salaryTwo * 1.67 * 0.4} /> +
          <VariableBox variable="NET RON / Month" value={salaryTwo} /> =
          <VariableBox variable="Gross RON / Month" value={salaryTwo * 1.67} />
        </div>
      </div>

      <div className="section">
        <h2>🤑 Recurring Monthly Profit</h2>
        <h3>Monthly Income - Monthly Costs: </h3>
        <div>
          <VariableBox green variable="Monthly Income" value={ronAndEuro(monthlyCosts)} /> -
          <VariableBox variable="Monthly Costs" value={ronAndEuro(monthlyCosts)} />
          =
          <VariableBox blue variable="Monthly Profit" value={ronAndEuro(monthlyProfit)} bold />
        </div>
        <h2>
          💰🤝 Profit Splitting ({shareOne * 100} - {shareTwo * 100} - {shareThree * 100}%):
        </h2>
        <div>
          <VariableBox blue variable={`1st (${shareOne * 100}%)`} value={ronAndEuro(minZero(monthlyProfit * shareOne))} /> /
          <VariableBox blue variable={`2nd (${shareTwo * 100}%)`} value={ronAndEuro(minZero(monthlyProfit * shareTwo))} /> /
          <VariableBox blue variable={`3rd (${shareThree * 100}%)`} value={ronAndEuro(minZero(monthlyProfit * shareThree))} />
        </div>
        <h2>Total Income Per Person (Salary + Shares)</h2>
        <h3>Person 1</h3>
        <div>
          <VariableBox blue variable={`Salary One`} value={ronAndEuro(salaryOne)} /> +
          <VariableBox blue variable={`25% of profits`} value={ronAndEuro(minZero(monthlyProfit * shareOne))} /> =
          <VariableBox blue variable={`Total Monthly Income`} value={ronAndEuro(salaryOne + minZero(monthlyProfit * shareOne))} bold />
        </div>
        <h3>Person 2</h3>
        <div>
          <VariableBox blue variable={`Salary Two`} value={ronAndEuro(salaryTwo)} /> +
          <VariableBox blue variable={`25% of profits`} value={ronAndEuro(minZero(monthlyProfit * shareTwo))} /> =
          <VariableBox blue variable={`Total Monthly Income`} value={ronAndEuro(salaryTwo + minZero(monthlyProfit * shareTwo))} bold />
        </div>
        <h3>Person 3</h3>
        <div>
          <VariableBox blue variable={`50% of profits`} value={ronAndEuro(minZero(monthlyProfit * shareThree))} /> =
          <VariableBox blue variable={`Total Monthly Income`} value={ronAndEuro(minZero(monthlyProfit * shareThree))} bold />
        </div>
        <h2>Total Monthly Taxes:</h2>
        <div>
          <VariableBox variable="Income Tax" value={ronAndEuro(monthlyIncome * 0.1)} /> +
          <VariableBox variable="Salary One Tax " value={ronAndEuro(salaryOne * 1.67 * 0.4)} /> +
          <VariableBox variable="Salary Two Tax" value={ronAndEuro(salaryTwo * 1.67 * 0.4)} /> =
          <VariableBox
            variable="Tax RON / Month"
            value={ronAndEuro(monthlyIncome * 0.1 + salaryOne * 1.67 * 0.4 + salaryTwo * 1.67 * 0.4)}
            bold
          />
        </div>
      </div>
    </div>
  );
}

function minZero(value) {
  return Math.max(0, value);
}

function ronAndEuro(priceInRon) {
  const roundedPrice = Math.round(priceInRon);
  return `${roundedPrice.toLocaleString()} RON (${Math.round(priceInRon / EURO_VALUE).toLocaleString()} €)`;
}

export default App;
