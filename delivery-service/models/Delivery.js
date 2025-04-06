const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  commande_id: {
    type: String,
    required: true,
  },
  transporteur_id: {
    type: String,
    required: true,
  },
  statut: {
    type: String,
    enum: ["En attente", "En cours", "Livrée"],
    default: "En attente",
  },
  adresse_livraison: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Delivery", deliverySchema);
