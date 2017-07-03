export default function GoalPost(initial) {
    this.value = initial;
    this.valueBecome = initial;
    this.changing = false;
}

GoalPost.prototype.useIncrement = function (increment) {
    if (this.value > this.valueBecome) {
        this.value -= increment;
        if (this.value <= this.valueBecome) {
            this.value = this.valueBecome;
            this.changing = false;
        }
    } else {
        this.value += increment;
        if (this.value >= this.valueBecome) {
            this.value = this.valueBecome;
            this.changing = false;
        }
    }
};

GoalPost.prototype.setGoal = function (goal) {
    if (this.value === goal) {
        return;
    }

    this.valueBecome = goal;
    this.changing = true;
};
