const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  produits: [
    {
      produit_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      quantite: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  client_id: {
    type: String,
    required: true,
  },
  prix_total: {
    type: Number,
    required: true,
  },
  statut: {
    type: String,
    enum: ["En attente", "Confirmée", "Expédiée"],
    default: "En attente",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
