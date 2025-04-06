require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/fastdelivery-auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/auth/register", async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est deja utilise" });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const user = new User({
      nom,
      email,
      mot_de_passe: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "Utilisateur cree avec succes" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!validPassword) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "votre_secret_jwt",
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/auth/profil", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "votre_secret_jwt"
    );
    const user = await User.findById(decoded.userId).select("-mot_de_passe");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
