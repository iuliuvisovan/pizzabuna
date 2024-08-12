import "./App.css";
import React from "react";
import { useState } from "react";
import VariableBox from "./VariableBox/VariableBox";

const DAYS_IN_A_MONTH = 30;
const PRICE_PER_KWH = 0.8;
const PRICE_PER_SAUCE = 5;
const EURO_VALUE = 4.98;
const TAX_VALUE_PERCENTAGE = 0.1;

function App() {
  const [pizzasSoldPerDay, setPizzasSoldPerDay] = useState(100);
  const [averagePizzaSellPrice, setAveragePizzaSellPrice] = useState(40);
  const [averagePizzaCreatePrice, setAveragePizzaCreatePrice] = useState(10);
  const [sauceFrequency, setSauceFrequency] = useState(0.5);
  const [buyingSaucePrice, setBuyingSaucePrice] = useState(1);
  const [buyingPizzaBoxPrice, setBuyingPizzaBoxPrice] = useState(1);
  const [ovenConsumption, setOvenConsumption] = useState(8.4);
  const [ovenDailyRunningHours, setOvenDailyRunningHours] = useState(12);
  const [monthlyRentPriceEuro, setMonthlyRentPriceEuro] = useState(1000);
  const [salaryOne, setSalaryOne] = useState(5000);
  const [salaryTwo, setSalaryTwo] = useState(5000);

  const moneyFromPizza =
    averagePizzaSellPrice * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const moneyFromSauces =
    PRICE_PER_SAUCE * sauceFrequency * pizzasSoldPerDay * DAYS_IN_A_MONTH;

  const pizzaCostPerMonth =
    averagePizzaCreatePrice * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const sauceCostPerMonth =
    buyingSaucePrice * sauceFrequency * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const pizzaBoxesCostPerMonth =
    buyingPizzaBoxPrice * pizzasSoldPerDay * DAYS_IN_A_MONTH;
  const ovenCostPerMonth = Math.round(
    ovenConsumption * PRICE_PER_KWH * ovenDailyRunningHours * DAYS_IN_A_MONTH
  );
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

  return (
    <div className="App">
      <h1 className="App-header">Pizza Buna SRL</h1>
      <h2>Variables</h2>
      <div>
        <label>Pizzas Sold Per Day:</label>
        <input
          value={pizzasSoldPerDay}
          onChange={(e) => setPizzasSoldPerDay(e.target.value)}
        />
      </div>
      <div>
        <label>Average Pizza Sell Price:</label>
        <input
          value={averagePizzaSellPrice}
          onChange={(e) => setAveragePizzaSellPrice(e.target.value)}
        />
        <span>RON</span>
      </div>
      <div>
        <label>Average Pizza Create Price:</label>
        <input
          value={averagePizzaCreatePrice}
          onChange={(e) => setAveragePizzaCreatePrice(e.target.value)}
        />
        <span>RON</span>
      </div>
      <div>
        <label>Sauce Frequency:</label>
        <input
          value={sauceFrequency}
          onChange={(e) => setSauceFrequency(e.target.value)}
        />
        <span>sauces for each pizza</span>
      </div>
      <div>
        <label>Buying Sauce Price:</label>
        <input
          value={buyingSaucePrice}
          onChange={(e) => setBuyingSaucePrice(e.target.value)}
        />
        <span>RON</span>
      </div>
      <div>
        <label>Buying Pizza Box Price:</label>
        <input
          value={buyingPizzaBoxPrice}
          onChange={(e) => setBuyingPizzaBoxPrice(e.target.value)}
        />
        <span>RON</span>
      </div>
      <div>
        <label>Oven Consumption:</label>
        <input
          value={ovenConsumption}
          onChange={(e) => setOvenConsumption(e.target.value)}
        />
        <span>kW</span>
      </div>
      <div>
        <label>Oven Daily Running Hours:</label>
        <input
          value={ovenDailyRunningHours}
          onChange={(e) => setOvenDailyRunningHours(e.target.value)}
        />
        <span>hours</span>
      </div>
      <div>
        <label>Monthly Rent Price:</label>
        <input
          value={monthlyRentPriceEuro}
          onChange={(e) => setMonthlyRentPriceEuro(e.target.value)}
        />
        <span>€</span>
      </div>
      <div>
        <label>Salariu 1:</label>
        <input
          value={salaryOne}
          onChange={(e) => setSalaryOne(e.target.value)}
        />
        <span>RON</span>
      </div>
      <div>
        <label>Salariu 2:</label>
        <input
          value={salaryTwo}
          onChange={(e) => setSalaryTwo(e.target.value)}
        />
        <span>RON</span>
      </div>
      <h2>Recurring Monthly Income</h2>
      <div>
        <label>From Selling Pizza: </label>
        <p>
          <VariableBox
            variable="averagePizzaSellPrice"
            value={averagePizzaSellPrice}
          />
          *
          <VariableBox variable="pizzasPerDay" value={pizzasSoldPerDay} />=
          <VariableBox variable="RON per day" value={moneyFromPizza / 30} />
          =
          <VariableBox variable="RON / month" value={moneyFromPizza} />
        </p>
      </div>
      <div>
        <label>Sauces sold per day: </label>
        <p>
          <VariableBox variable="Sauce frequency" value={sauceFrequency} />*
          <VariableBox variable="pizzasPerDay" value={pizzasSoldPerDay} />*
          <VariableBox variable="sauceSellPrice" value={PRICE_PER_SAUCE} />=
          <VariableBox variable="RON per day" value={moneyFromSauces / 30} />
          <VariableBox variable="RON / month" value={moneyFromSauces} />
        </p>
      </div>
      <h2>Recurring Monthly Costs</h2>
      <div>
        <label>Costs to Make Pizza: </label>
        <p>
          <VariableBox
            variable="averagePizzaCreatePrice"
            value={averagePizzaCreatePrice}
          />
          *
          <VariableBox variable="pizzasPerDay" value={pizzasSoldPerDay} />
          =
          <VariableBox variable="RON per day" value={pizzaCostPerMonth / 30} />
          <VariableBox variable="RON / month" value={pizzaCostPerMonth} />
        </p>
      </div>
      <div>
        <label>Buying Sauces: </label>
        <p>
          <VariableBox variable="buyingSaucePrice" value={buyingSaucePrice} />
          *
          <VariableBox variable="sauceFrequency" value={sauceFrequency} />*
          <VariableBox variable="pizzasPerDay" value={pizzasSoldPerDay} />=
          <VariableBox variable="RON per day" value={sauceCostPerMonth / 30} />"
          " =
          <VariableBox variable="RON / month" value={sauceCostPerMonth} />
        </p>
      </div>
      <div>
        <label>Buying Pizza Boxes: </label>
        <p>
          <VariableBox
            variable="buyingPizzaBoxPrice"
            value={buyingPizzaBoxPrice}
          />
          *
          <VariableBox variable="pizzasPerDay" value={pizzasSoldPerDay} />
          =
          <VariableBox
            variable="RON per day"
            value={pizzaBoxesCostPerMonth / 30}
          />
          =
          <VariableBox variable="RON / month" value={pizzaBoxesCostPerMonth} />
        </p>
      </div>
      <div>
        <label>Electric Oven Running: </label>
        <p>
          <VariableBox variable="ovenConsumption" value={ovenConsumption} />*
          <VariableBox variable="PRICE_PER_KWH" value={PRICE_PER_KWH} />*
          <VariableBox
            variable="ovenDailyRunningHours"
            value={ovenDailyRunningHours}
          />
          =
          <VariableBox
            variable="RON per day"
            value={Math.round(ovenCostPerMonth / 30)}
          />
          <VariableBox variable="RON / month" value={ovenCostPerMonth} />
        </p>
      </div>
      <div>
        <label>Rent: </label>
        <span>{monthlyRentPriceEuro}</span>
      </div>
      <div>
        <label>Tax: </label>
        <span>{monthlyIncome}</span>
        <span> * 1%</span>
      </div>
      <div>
        <label>Salariu 1:</label>
        <span>{salaryOne}</span>
      </div>
      <div>
        <label>Salariu 2: </label>
        <span>{salaryTwo}</span>
      </div>
      <h2>Total</h2>
      <div>
        <label>Monthly Income: </label>
        <span>
          {monthlyIncome.toLocaleString()} RON ={" "}
          {Math.round(monthlyIncome / EURO_VALUE).toLocaleString()} €
        </span>
      </div>
      <div>
        <label>Monthly Costs: </label>
        <span>
          {monthlyCosts.toLocaleString()} RON ={" "}
          {Math.round(monthlyCosts / EURO_VALUE).toLocaleString()} €
        </span>
      </div>
      <div>
        <label>Profit: </label>
        <span>{(monthlyIncome - monthlyCosts).toLocaleString()} RON = </span>
        <strong>
          {Math.round(
            (monthlyIncome - monthlyCosts) / EURO_VALUE
          ).toLocaleString()}{" "}
          €
        </strong>
      </div>
    </div>
  );
}

export default App;
