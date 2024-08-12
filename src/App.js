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

function App() {
  const [pizzasSoldPerDay, setPizzasSoldPerDay] = useState(100);
  const [averagePizzaSellPrice, setAveragePizzaSellPrice] = useState(40);
  const [averagePizzaCreatePrice, setAveragePizzaCreatePrice] = useState(10);
  const [ovenDailyRunningHours, setOvenDailyRunningHours] = useState(12);
  const [monthlyRentPriceEuro, setMonthlyRentPriceEuro] = useState(1000);
  const [salaryOne, setSalaryOne] = useState(5000);
  const [salaryTwo, setSalaryTwo] = useState(5000);

  const moneyFromPizza = averagePizzaSellPrice * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const moneyFromSauces = PRICE_PER_SAUCE * SAUCE_FREQUENCY * pizzasSoldPerDay * DAYS_IN_A_MONTH;

  const pizzaCostPerMonth = averagePizzaCreatePrice * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const sauceCostPerMonth = SAUCE_COST_PRICE * SAUCE_FREQUENCY * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const pizzaBoxesCostPerMonth = PIZZA_BOX_COST_PRICE * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const ovenCostPerMonth = Math.round(OVEN_CONSUMPTION_KW * PRICE_PER_KWH * ovenDailyRunningHours * DAYS_IN_A_MONTH);
  const monthlyIncome = moneyFromPizza + moneyFromSauces;
  const monthlyCosts =
    pizzaCostPerMonth +
    sauceCostPerMonth +
    pizzaBoxesCostPerMonth +
    ovenCostPerMonth +
    salaryOne +
    salaryTwo +
    monthlyRentPriceEuro * EURO_VALUE +
    TAX_VALUE_PERCENTAGE * monthlyIncome;

  const monthlyProfit = monthlyIncome - monthlyCosts;

  return (
    <div className="App">
      <h1 className="App-header">Pizza Buna SRL</h1>
      <div>
        <h4>Pizzas Sold Per Day:</h4>
        <input value={pizzasSoldPerDay} onChange={(e) => setPizzasSoldPerDay(e.target.value)} />
      </div>
      <div>
        <h4>Average Pizza Sell Price (RON):</h4>
        <input value={averagePizzaSellPrice} onChange={(e) => setAveragePizzaSellPrice(e.target.value)} />
      </div>
      <div>
        <h4>Average Pizza Cost Price (RON):</h4>
        <input value={averagePizzaCreatePrice} onChange={(e) => setAveragePizzaCreatePrice(e.target.value)} />
      </div>
      <div>
        <h4>Oven Daily Running Hours:</h4>
        <input value={ovenDailyRunningHours} onChange={(e) => setOvenDailyRunningHours(e.target.value)} />
      </div>
      <div>
        <h4>Monthly Rent Price (€):</h4>
        <input value={monthlyRentPriceEuro} onChange={(e) => setMonthlyRentPriceEuro(e.target.value)} />
      </div>
      <div>
        <h4>1st Salary (RON NET):</h4>
        <input value={salaryOne} onChange={(e) => setSalaryOne(e.target.value)} />
      </div>
      <div>
        <h4>2nd Salary (RON NET):</h4>
        <input value={salaryTwo} onChange={(e) => setSalaryTwo(e.target.value)} />
      </div>
      <h2>Recurring Monthly Income</h2>
      <div>
        <VariableBox green variable="RON / month" value={Math.round(monthlyIncome)} />
        <VariableBox green variable="€ / month" value={Math.round(monthlyIncome / EURO_VALUE)} bold />
      </div>
      <h3>From Pizza: </h3>
      <div>
        <VariableBox green variable="Average Pizza Sell Price" value={averagePizzaSellPrice + ' RON'} />
        *
        <VariableBox green variable="Pizzas Sold Per Day" value={pizzasSoldPerDay} />=
        <VariableBox green variable="RON / day" value={moneyFromPizza / 30} />
        =
        <VariableBox green variable="RON / month" value={moneyFromPizza} />=
        <VariableBox green variable="€ / month" value={Math.round(moneyFromPizza / EURO_VALUE)} />
      </div>
      <h3>From Sauce: </h3>
      <div>
        <VariableBox green variable="Sauce frequency" value={SAUCE_FREQUENCY} />*
        <VariableBox green variable="pizzasPerDay" value={pizzasSoldPerDay} />*
        <VariableBox green variable="sauceSellPrice" value={PRICE_PER_SAUCE} />=
        <VariableBox green variable="RON / day" value={moneyFromSauces / 30} />
        <VariableBox green variable="RON / month" value={moneyFromSauces} />
        <VariableBox green variable="€ / month" value={Math.round(moneyFromSauces / EURO_VALUE)} />
      </div>

      <h2>Recurring Monthly Costs</h2>
      <div>
        <VariableBox variable="RON / month" value={Math.round(monthlyCosts)} />
        <VariableBox variable="€ / month" value={Math.round(monthlyCosts / EURO_VALUE).toLocaleString()} bold />
      </div>
      <h3>Costs to Make Pizza: </h3>
      <div>
        <VariableBox variable="averagePizzaCreatePrice" value={averagePizzaCreatePrice} />
        *
        <VariableBox variable="pizzasPerDay" value={pizzasSoldPerDay} />
        =
        <VariableBox variable="RON / day" value={pizzaCostPerMonth / 30} />
        <VariableBox variable="RON / month" value={pizzaCostPerMonth} />
      </div>
      <h3>Buying Sauces: </h3>
      <div>
        <VariableBox variable="SAUCE_COST_PRICE" value={SAUCE_COST_PRICE} />
        *
        <VariableBox variable="sauceFrequency" value={SAUCE_FREQUENCY} />*
        <VariableBox variable="pizzasPerDay" value={pizzasSoldPerDay} />=
        <VariableBox variable="RON / day" value={sauceCostPerMonth / 30} /> =
        <VariableBox variable="RON / month" value={sauceCostPerMonth} />
      </div>
      <h3>Buying Pizza Boxes: </h3>
      <div>
        <VariableBox variable="PIZZA_BOX_COST_PRICE" value={PIZZA_BOX_COST_PRICE} />
        *
        <VariableBox variable="pizzasPerDay" value={pizzasSoldPerDay} />
        =
        <VariableBox variable="RON / day" value={pizzaBoxesCostPerMonth / 30} />
        =
        <VariableBox variable="RON / month" value={pizzaBoxesCostPerMonth} />
      </div>
      <h3>Electric Oven Running: </h3>
      <div>
        <VariableBox variable="OVEN_CONSUMPTION_KW" value={OVEN_CONSUMPTION_KW} />*
        <VariableBox variable="PRICE_PER_KWH" value={PRICE_PER_KWH} />*
        <VariableBox variable="ovenDailyRunningHours" value={ovenDailyRunningHours} />
        =
        <VariableBox variable="RON / day" value={Math.round(ovenCostPerMonth / 30)} />
        <VariableBox variable="RON / month" value={ovenCostPerMonth} />
      </div>
      <h3>Rent: </h3>
      <VariableBox variable="€ / Month" value={monthlyRentPriceEuro} />

      <h3>Tax (1% of Monthly Income): </h3>
      <VariableBox variable="€ / Month" value={Math.round((monthlyIncome * 0.1) / EURO_VALUE).toLocaleString()} />

      <h3>1st Salary:</h3>
      <VariableBox variable="Gross RON / Month" value={salaryOne * 1.67} />

      <h3>2nd Salary: </h3>
      <VariableBox variable="Gross RON / Month" value={salaryTwo * 1.67} />

      <h2>Monthly Profit</h2>
      <h3>Monthly Income - Monthly Costs: </h3>
      <div>
        <VariableBox green variable="Monthly Income (€)" value={Math.round(monthlyIncome / EURO_VALUE)} /> -
        <VariableBox variable="Monthly Costs (€)" value={Math.round(monthlyCosts / EURO_VALUE).toLocaleString()} />
        =
        <VariableBox blue variable="RON / month" value={monthlyProfit.toLocaleString()} />
        =
        <VariableBox blue variable="€ / month" value={Math.round(monthlyProfit / EURO_VALUE).toLocaleString()} bold />
      </div>
    </div>
  );
}

export default App;
