class CalorieTracker {
  constructor() {
    this._calorieLimit = 2500;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._render();
  }

  // !Private Methods
  _displayCaloriesTotal() {
    const totalCaloriesPerItem = document.querySelector("#calories-total");
    totalCaloriesPerItem.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const calorieLimitPerItem = document.querySelector("#calories-limit");
    calorieLimitPerItem.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.querySelector("#calories-consumed");
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesConsumedEl.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.querySelector("#calories-burned");
    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurnedEl.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.querySelector("#calories-remaining");
    caloriesRemainingEl.innerHTML = this._calorieLimit - this._totalCalories;
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = "M-" + crypto.randomUUID();
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = "W-" + crypto.randomUUID();
    this.name = name;
    this.calories = calories;
  }
}

const tracker = new CalorieTracker();

const breakfast = new Meal("Breakfast", 300);
tracker.addMeal(breakfast);

const lunch = new Meal("lunch", 800);
tracker.addMeal(lunch);

const run = new Workout("Joggind", 200);
tracker.addWorkout(run);

const cycle = new Workout("cycling", 400);
tracker.addWorkout(cycle);

console.log(tracker._meals);
console.log(tracker._workouts);
