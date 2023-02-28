import Storage from "./Storage";

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorielimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();

    document.querySelector("#limit").value = this._calorieLimit;
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.setMeals(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.setWorkouts(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    this._meals.forEach((meal, index) => {
      if (meal.id === id) {
        this._totalCalories -= meal.calories;
        this._meals.splice(index, 1);
      }
    });
    Storage.updateTotalCalories(this._totalCalories);
    Storage.removeMeal(id);
    this._render();
  }

  removeWorkout(id) {
    this._workouts.forEach((workout, idx) => {
      if (workout.id === id) {
        this._totalCalories += workout.calories;
        this._workouts.splice(idx, 1);
      }
    });
    Storage.updateTotalCalories(this._totalCalories);
    Storage.removeWorkout(id);
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
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

  _displayNewMeal(meal) {
    const mealsEl = document.querySelector("#meal-items");
    const mealEl = document.createElement("div");
    mealEl.classList.add("card", "my-2");
    mealEl.setAttribute("data-id", meal.id);
    mealEl.innerHTML = `
          <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${meal.name}</h4>
                  <div
                     class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                      ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
              </div>
        </div>
      `;

    mealsEl.appendChild(mealEl);
  }

  _displayNewWorkout(workout) {
    const workoutsEl = document.querySelector("#workout-items");
    const workoutEl = document.createElement("div");
    workoutEl.classList.add("card", "my-2");
    workoutEl.setAttribute("data-id", workout.id);
    workoutEl.innerHTML = `
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${workout.name}</h4>
                    <div
                      class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                      ${workout.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              </div>`;
    workoutsEl.appendChild(workoutEl);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();
  }
}

export default CalorieTracker;
