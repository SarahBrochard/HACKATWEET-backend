function checkBody(body, keys) {
  for (const field of keys) {
    if (!body[field] || body[field].trim() === '') {
      return false;  // Retourner immédiatement si un champ est invalide
    }
  }

  return true;  // Tous les champs sont valides
}

module.exports = { checkBody };