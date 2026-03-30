import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (apiKey && apiKey !== 'ta_cle_api_ici') {
  genAI = new GoogleGenerativeAI(apiKey);
}

// Fonction utilitaire pour générer la réponse
export async function generateChatResponse(history, userMessage, dashboardData) {
  if (!genAI) {
    return "Erreur : La clé d'API Gemini n'est pas configurée. Veuillez l'ajouter dans le fichier .env et redémarrer le serveur.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Création d'un prompt système dictant le comportement de l'IA
    const systemInstruction = `Tu es l'assistant IA officiel du tableau de bord "Parkshare". 
Tu aides l'équipe commerciale à identifier les meilleures zones immobilières pour la prospection de parkings collaboratifs.
Sois concis, professionnel mais enthousiaste. Ne retourne pas de Markdown complexe, des textes courts et aérés suffisent.
Voici les données actuelles des zones (format JSON) dont l'équipe dispose sur le dashboard, sers-t'en pour répondre de manière experte :
${JSON.stringify(dashboardData, null, 2)}`;

    // Initialisation d'une session de chat avec le contexte système + historique
    const chat = model.startChat({
        history: [
            { role: "user", parts: [{ text: systemInstruction }] },
            { role: "model", parts: [{ text: "Bien compris, je suis prêt à assister l'équipe commerciale de Parkshare avec ces données." }] },
            ...history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }))
        ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Erreur Gemini API:", error);
    return "Désolé, je rencontre des difficultés techniques avec mon cerveau d'IA en ce moment. Réessayez plus tard !";
  }
}
