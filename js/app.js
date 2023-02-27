class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorielimit();
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
    this._displayNewMeal(meal);
    this._totalCalories += meal.calories;
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._displayNewWorkout(workout);
    this._totalCalories -= workout.calories;
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this._meals[index];
      this._meals.splice(index, 1);
      this._totalCalories -= meal.calories;
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this._workouts[index];
      this._workouts.splice(index, 1);
      this._totalCalories += workout.calories;
      this._render();
    }
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
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

class Storage {
  static getCalorielimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    document
      .querySelector("#meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));

    document
      .querySelector("#workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));

    document
      .querySelector("#meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));

    document
      .querySelector("#workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));

    document
      .querySelector("#filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));

    document
      .querySelector("#filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));

    document
      .querySelector("#reset")
      .addEventListener("click", this._reset.bind(this));

    document
      .querySelector("#limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();
    const name = document.querySelector(`#${type}-name`);
    const calories = document.querySelector(`#${type}-calories`);

    // Validate Input
    if (name.value === "" || calories.value === "") {
      alert("Please Fill All Fields!");
      return;
    }

    if (type === "meal") {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    name.value = "";
    calories.value = "";

    const collapseItem = document.querySelector(`#collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true,
    });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      const id = e.target.closest(".card").getAttribute("data-id");
      type === "meal"
        ? this._tracker.removeMeal(id)
        : this._tracker.removeWorkout(id);

      const item = e.target.closest(".card");
      item.remove();
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  _setLimit(e) {
    e.preventDefault();
    const limit = document.querySelector("#limit");
    if (limit.value === "") {
      alert("Please add a limit");
      return;
    }

    this._tracker.setLimit(+limit.value);
    limit.value = "";

    const modalEl = document.querySelector("#limit-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

  _reset() {
    this._tracker.reset();
    document.querySelector("#meal-items").innerHTML = "";
    document.querySelector("#workout-items").innerHTML = "";
    document.querySelector("#filter-meals").value = "";
    document.querySelector("#filter-workouts").value = "";
  }
}

const app = new App();
