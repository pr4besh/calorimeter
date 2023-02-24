class CalorieTracker {
  constructor() {
    this._calorieLimit = 3000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();
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
    const progressEl = document.querySelector("#calorie-progress");
    const caloriesRem = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = caloriesRem;

    if (caloriesRem <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add(
        "bg-danger"
      );
      progressEl.classList.remove("bg-success");
      progressEl.classList.add("bg-danger");
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light");
      progressEl.classList.add("bg-success");
      progressEl.classList.remove("bg-danger");
    }
  }

  _displayCalorieProgress() {
    const progressEl = document.querySelector("#calorie-progress");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressEl.style.width = `${width}%`;
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();
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

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    document
      .querySelector("#meal-form")
      .addEventListener("submit", this._newMeal.bind(this));

    document
      .querySelector("#workout-form")
      .addEventListener("submit", this._newWorkout.bind(this));
  }

  _newMeal(e) {
    e.preventDefault();
    const name = document.querySelector("#meal-name");
    const calories = document.querySelector("#meal-calories");

    // Validate Input
    if (name.value === "" || calories.value === "") {
      alert("Please Fill All Fields!");
      return;
    }

    const meal = new Meal(name.value, +calories.value);
    this._tracker.addMeal(meal);

    name.value = "";
    calories.value = "";

    const collapseMeal = document.querySelector("#collapse-meal");
    const bsCollapse = new bootstrap.Collapse(collapseMeal, {
      toggle: true,
    });
  }

  _newWorkout(e) {
    e.preventDefault();

    const name = document.querySelector("#workout-name");
    const calories = document.querySelector("#workout-calories");

    // Validate Input
    if (name.value === "" || calories.value === "") {
      alert("Please Fill All Fields!");
      return;
    }

    const workout = new Meal(name.value, +calories.value);
    this._tracker.addWorkout(workout);

    name.value = "";
    calories.value = "";

    const collapseWorkout = document.querySelector("#collapse-workout");
    const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
      toggle: true,
    });
  }
}

const app = new App();
