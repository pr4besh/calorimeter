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

export { Meal, Workout };
