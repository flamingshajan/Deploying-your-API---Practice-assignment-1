import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const __dirname = path.resolve();
const filePath = path.join(__dirname, "data", "recipes.json");

// ------------------------------
// Helper Function
// ------------------------------
const readRecipes = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeRecipes = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// ------------------------------
// Task 1: POST /api/recipes
// ------------------------------
app.post("/api/recipes", (req, res) => {
  const { title, ingredients, instructions, cookTime, difficulty } = req.body;

  // Validation
  if (!title || !ingredients || !instructions) {
    return res
      .status(400)
      .json({ error: "title, ingredients, instructions are required" });
  }

  const recipes = readRecipes();

  const newRecipe = {
    id: Date.now(),
    title,
    ingredients,
    instructions,
    cookTime: cookTime || 0,
    difficulty: difficulty || "medium",
  };

  recipes.push(newRecipe);
  writeRecipes(recipes);

  res.status(201).json(newRecipe);
});

// ------------------------------
// Task 2: GET /api/recipes
// ------------------------------
app.get("/api/recipes", (req, res) => {
  try {
    const recipes = readRecipes();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Unable to read recipes file" });
  }
});

// ------------------------------
// PORT (important for Render)
// ------------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
