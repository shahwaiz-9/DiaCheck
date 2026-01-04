export const constructPrompt = (valuesPayload: any) => {
  const prompt = `
You are a medical assistant AI. Analyze the current health metrics of a woman based on the provided dataset values and the known outcome (0 = non-diabetic, 1 = diabetic).  

1. Explain the current state of the user by referencing each relevant value. For example, if glucose is high, indicate that the user's glucose level is elevated. Use the actual values to provide context. Keep it concise, informative, and non-technical so that anyone can understand.  

2. Provide health recommendations based on the values. Suggest seeing a doctor if any metric is concerning, or recommend natural lifestyle changes if values are within safe ranges. Use simple, everyday language.  

3. Return the response strictly in JSON format with exactly two fields:
{
  "CurrentState": "brief paragraph describing the user's current health state based on the values in easy-to-understand language",
  "Recomendation": "brief paragraph with actionable recommendations or next steps in simple terms"
}

4. The response must be in brief paragraph form, maximum 200 words.  
5. Do not include any text outside the JSON. Only return the JSON object.  

Dataset values to analyze:
${JSON.stringify(valuesPayload, null, 2)}
`;

  return prompt;
};
