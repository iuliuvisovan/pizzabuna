import './App.css';
import React from 'react';
import { useState } from 'react';
import VariableBox from './VariableBox';

const DAYS_IN_A_MONTH = 30;
const PRICE_PER_KWH = 0.8;
const SAUCE_SELL_PRICE = 5;
const SAUCE_COST_PRICE = 1;
const EURO_VALUE = 4.98;
const INCOME_TAX_PERCENTAGE = 0.01;
const SAUCE_FREQUENCY = 0.5;
const OVEN_CONSUMPTION_KW = 8.4;
const PIZZA_BOX_COST_PRICE = 1;
const SALARY_TAX_TO_GROSS_MULTIPLIER = 1.67;
const MONTHLY_RENT_PRICE_EURO = 1000;
const MONTHLY_MARKETING_COST = 1000;
const OVEN_DAILY_RUNNING_HOURS = 12;
const TAZZ_COST_PERCENTAGE = 0.25;
const MONTHLY_MISC_SOFTWARE_PRICES = 700;
const MONTHLY_ACCOUNTANT_COST = 500;
const MONTHLY_MAINTENANCE_COST = 1000;

function App() {
  const [pizzasSoldPerDay, setPizzasSoldPerDay] = useState(80);
  const [averagePizzaSellPrice, setAveragePizzaSellPrice] = useState(38);
  const [averagePizzaCreatePrice, setAveragePizzaCreatePrice] = useState(10);
  const [salaryOne, setSalaryOne] = useState(4000);
  const [salaryTwo, setSalaryTwo] = useState(4000);
  const [shareOne, setShareOne] = useState(0.2);
  const [shareTwo, setShareTwo] = useState(0.2);
  const [shareThree, setShareThree] = useState(0.6);

  const moneyFromPizza = averagePizzaSellPrice * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const moneyFromSauces = SAUCE_SELL_PRICE * (pizzasSoldPerDay * SAUCE_FREQUENCY) * DAYS_IN_A_MONTH;

  const pizzaCostPerMonth = averagePizzaCreatePrice * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const sauceCostPerMonth = SAUCE_COST_PRICE * SAUCE_FREQUENCY * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const pizzaBoxesCostPerMonth = PIZZA_BOX_COST_PRICE * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const ovenCostPerMonth = OVEN_CONSUMPTION_KW * PRICE_PER_KWH * OVEN_DAILY_RUNNING_HOURS * DAYS_IN_A_MONTH;
  const monthlyIncome = moneyFromPizza + moneyFromSauces;
  const monthlySalaryCost = salaryOne + salaryTwo;
  const monthlySalaryTax = salaryOne * SALARY_TAX_TO_GROSS_MULTIPLIER * 0.4 + salaryTwo * SALARY_TAX_TO_GROSS_MULTIPLIER * 0.4;
  const monthlyCosts =
    pizzaCostPerMonth +
    sauceCostPerMonth +
    pizzaBoxesCostPerMonth +
    ovenCostPerMonth +
    TAZZ_COST_PERCENTAGE * monthlyIncome +
    INCOME_TAX_PERCENTAGE * monthlyIncome +
    monthlySalaryCost +
    monthlySalaryTax +
    MONTHLY_RENT_PRICE_EURO * EURO_VALUE +
    MONTHLY_MARKETING_COST +
    MONTHLY_ACCOUNTANT_COST +
    MONTHLY_MISC_SOFTWARE_PRICES +
    MONTHLY_MAINTENANCE_COST;

  const monthlyProfit = monthlyIncome - monthlyCosts;

  return (
    <div className="App">
      <h1 className="App-header">🍕 Pizza Bună SRL</h1>
      <div className="section" style={{ paddingTop: 120 }}>
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
        <strong style={{ marginTop: 40 }}>📋 Presets</strong>
        <button
          onClick={() => {
            setSalaryOne(4000);
            setSalaryTwo(4000);
            setShareOne(0.2);
            setShareTwo(0.2);
            setShareThree(0.6);
          }}
        >
          4000 RON + 20%
        </button>
        <button
          onClick={() => {
            setSalaryOne(3200);
            setSalaryTwo(3200);
            setShareOne(0.25);
            setShareTwo(0.25);
            setShareThree(0.5);
          }}
        >
          3200 RON + 25%
        </button>
        <button
          onClick={() => {
            setSalaryOne(2363);
            setSalaryTwo(2363);
            setShareOne(0.3);
            setShareTwo(0.3);
            setShareThree(0.4);
          }}
        >
          2363 RON (minim pe economie) + 30%
        </button>
      </div>
      <div className="section">
        <h2>💹 ⬆️ Recurring Monthly Income</h2>
        <div>
          <VariableBox green variable="Per Month" value={Math.round(monthlyIncome)} />
          <VariableBox green variable="Per Month" value={Math.round(monthlyIncome / EURO_VALUE)} bold unit="€" />
        </div>
        <h3>🍕 From Selling Pizza: </h3>
        <div>
          <VariableBox green variable="Average Sell Price" value={averagePizzaSellPrice + ' RON'} />
          *
          <VariableBox green variable="Sold Per Day" value={`${pizzasSoldPerDay} pizzas`} />=
          <VariableBox green variable="Per Day" value={moneyFromPizza / 30} />
          =
          <VariableBox green variable="Per Month" value={ronAndEuro(moneyFromPizza)} />
        </div>
        <h3>🍅 From Selling Sauce: </h3>
        <div>
          <VariableBox green variable="Sell Price" value={SAUCE_SELL_PRICE} /> *
          <VariableBox green variable="Sold Per Day" value={pizzasSoldPerDay * SAUCE_FREQUENCY} unit="sauces" /> =
          <VariableBox green variable="Per Day" value={moneyFromSauces / 30} /> =
          <VariableBox green variable="Per Month" value={ronAndEuro(moneyFromSauces)} />
        </div>
      </div>
      <div className="section">
        <h2>💸🔻 Recurring Monthly Costs</h2>
        <div>
          <VariableBox variable="Per Month" value={Math.round(monthlyCosts)} />
          <VariableBox variable="Per Month" value={Math.round(monthlyCosts / EURO_VALUE)} bold unit="€" />
        </div>
        <div
          className="section"
          style={{ height: '87vh', overflowY: 'scroll', paddingBottom: 100, marginTop: 24, paddinRight: 32, marginRight: -32 }}
        >
          <h3>🫓🧀🌿 Pizza Ingredients Cost: </h3>
          <div>
            <VariableBox variable="Pizza Production Cost" value={averagePizzaCreatePrice} />
            *
            <VariableBox variable="Per Day" value={pizzasSoldPerDay} unit="pizzas" />
            =
            <VariableBox variable="Per Day" value={pizzaCostPerMonth / 30} />
            =
            <VariableBox variable="Per Month" value={pizzaCostPerMonth} />
          </div>
          <h3>🥫 Buying Sauce: </h3>
          <div>
            <VariableBox variable="Sauce Buy Price" value={SAUCE_COST_PRICE} />
            *
            <VariableBox variable="Sauce Frequency" value={SAUCE_FREQUENCY} unit="per pizza" />*
            <VariableBox variable="Per Day" value={pizzasSoldPerDay} unit="pizzas" />=
            <VariableBox variable="Per Day" value={sauceCostPerMonth / 30} /> =
            <VariableBox variable="Per Month" value={sauceCostPerMonth} />
          </div>
          <h3>📦 Buying Pizza Boxes: </h3>
          <div>
            <VariableBox variable="Pizza Box Price" value={PIZZA_BOX_COST_PRICE} />
            *
            <VariableBox variable="Per Day" value={pizzasSoldPerDay} unit="pizzas" />
            =
            <VariableBox variable="Per Day" value={pizzaBoxesCostPerMonth / 30} />
            =
            <VariableBox variable="Per Month" value={pizzaBoxesCostPerMonth} />
          </div>
          <h3>⚡ Electric Oven Running: </h3>
          <div>
            <VariableBox variable="Consumption" value={`${OVEN_CONSUMPTION_KW} kW/h`} />*
            <VariableBox variable="Price per kWH" value={PRICE_PER_KWH} />*
            <VariableBox variable="Hours / day" value={OVEN_DAILY_RUNNING_HOURS} />
            =
            <VariableBox variable="Per Month" value={ovenCostPerMonth} />
          </div>
          <h3>⚡ Tazz Tax (25%): </h3>
          <div>
            <VariableBox variable="Total Income" value={monthlyIncome} /> *
            <VariableBox variable="Tax Percentage" value="25%" unit="" /> =
            <VariableBox variable="Per Month" value={ronAndEuro(monthlyIncome * TAZZ_COST_PERCENTAGE)} />
          </div>
          <h3>🏦 Income Tax (1%): </h3>
          <div>
            <VariableBox variable="Total Income" value={monthlyIncome} /> *
            <VariableBox variable="Tax Percentage" value="1%" unit="" /> =
            <VariableBox variable="Per Month" value={ronAndEuro(monthlyIncome * INCOME_TAX_PERCENTAGE)} />
          </div>
          <h3>💸 Salaries:</h3>
          <div>
            <VariableBox variable="Salary One NET" value={salaryTwo} /> +
            <VariableBox variable="Salary Two NET" value={salaryTwo} /> =
            <VariableBox variable="Per Month" value={monthlySalaryCost} />
          </div>
          <h3>🏛️ Salary Taxes (~40% of Gross): </h3>
          <div>
            <VariableBox variable="Salary One Tax" value={salaryOne * 1.67 * 0.4} /> +
            <VariableBox variable="Salary One Tax" value={salaryTwo * 1.67 * 0.4} /> =
            <VariableBox variable="Salary Tax Per Month" value={monthlySalaryTax} />
          </div>
          <h3>🏠 Chirie: </h3>
          <VariableBox variable="Per Month" value={ronAndEuro(MONTHLY_RENT_PRICE_EURO * EURO_VALUE)} />
          <h3>📣 Marketing: </h3>
          <VariableBox variable="Per Month" value={MONTHLY_MARKETING_COST} />
          <h3>🧾 Contabilitate: </h3>
          <VariableBox variable="Per Month" value={MONTHLY_ACCOUNTANT_COST} />
          <h3>💻 Software & Banking: </h3>
          <VariableBox variable="Per Month" value={MONTHLY_MISC_SOFTWARE_PRICES} />
          <h3>🔧 Maintenance: </h3>
          <VariableBox variable="Per Month" value={MONTHLY_MAINTENANCE_COST} />
        </div>
      </div>

      <div className="section">
        <h2>🤑 Recurring Monthly Profit</h2>
        <h3>Monthly Income - Monthly Costs: </h3>
        <div>
          <VariableBox green variable="Monthly Income" value={ronAndEuro(monthlyIncome)} /> -
          <VariableBox variable="Monthly Costs" value={ronAndEuro(monthlyCosts)} />
          =
          <VariableBox blue variable="Monthly Profit" value={ronAndEuro(monthlyProfit)} bold />
        </div>
        <h2>
          💰🤝 Profit Splitting ({shareOne * 100} - {shareTwo * 100} - {shareThree * 100}%):
        </h2>
        <div>
          <VariableBox blue variable={`👨‍🍳 1st (${shareOne * 100}%)`} value={ronAndEuro(minZero(monthlyProfit * shareOne))} /> /
          <VariableBox blue variable={`👨‍🍳 2nd (${shareTwo * 100}%)`} value={ronAndEuro(minZero(monthlyProfit * shareTwo))} /> /
          <VariableBox blue variable={`👨‍💻 3rd (${shareThree * 100}%)`} value={ronAndEuro(minZero(monthlyProfit * shareThree))} />
        </div>
        <h2>Total Income Per Person (Salary + Shares)</h2>
        <h3>👨‍🍳 Person 1</h3>
        <div>
          <VariableBox blue variable={`Salary One`} value={ronAndEuro(salaryOne)} /> +
          <VariableBox blue variable={`${shareOne * 100}% of profits`} value={ronAndEuro(minZero(monthlyProfit * shareOne))} /> =
          <VariableBox gold blue variable={`Total Monthly Income`} value={ronAndEuro(salaryOne + minZero(monthlyProfit * shareOne))} bold />
        </div>
        <h3>👨‍🍳 Person 2</h3>
        <div>
          <VariableBox blue variable={`Salary Two`} value={ronAndEuro(salaryTwo)} /> +
          <VariableBox blue variable={`${shareTwo * 100}% of profits`} value={ronAndEuro(minZero(monthlyProfit * shareTwo))} /> =
          <VariableBox gold blue variable={`Total Monthly Income`} value={ronAndEuro(salaryTwo + minZero(monthlyProfit * shareTwo))} bold />
        </div>
        <h3>👨‍💻 Person 3</h3>
        <div>
          <VariableBox blue variable={`${shareThree * 100}% of profits`} value={ronAndEuro(minZero(monthlyProfit * shareThree))} /> =
          <VariableBox gold blue variable={`Total Monthly Income`} value={ronAndEuro(minZero(monthlyProfit * shareThree))} bold />
        </div>
        <h2>Total Monthly Taxes:</h2>
        <div>
          <VariableBox gray variable="Income Tax" value={ronAndEuro(monthlyIncome * 0.1)} /> +
          <VariableBox gray variable="Salary One Tax " value={ronAndEuro(salaryOne * 1.67 * 0.4)} /> +
          <VariableBox gray variable="Salary Two Tax" value={ronAndEuro(salaryTwo * 1.67 * 0.4)} /> =
          <VariableBox
            gray
            variable="Tax Per Month"
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
  return `${roundedPrice.toLocaleString('ro-RO')} RON (${Math.round(priceInRon / EURO_VALUE).toLocaleString('ro-RO')} €)`;
}

export default App;
