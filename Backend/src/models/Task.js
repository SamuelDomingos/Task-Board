const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    icon: { type: String, required: true },
    status: {
      type: String,
      enum: ["em-processo", "completo", "incompleto"], // Status permitidos
    },
    isGoal: { type: Boolean, default: false }, // Indica se é uma meta
    deadline: { type: Date, required: function () { return this.isGoal; } }, // Prazo, obrigatório se for meta
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
