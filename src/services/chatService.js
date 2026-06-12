/**
 * Sends a chat message (question) to the AI Deal Coach backend.
 * Supports optional file uploads which are forwarded to the /api/question endpoint.
 *
 * @param {string} company - The company name being analyzed.
 * @param {string} message - The user's question.
 * @param {File[]} [files] - Optional array of File objects to upload.
 * @returns {Promise<string>} - The AI's synthesized answer.
 */
export async function sendChatMessage(company, message, files = []) {
  // If there are files, use multipart/form-data via FormData; otherwise JSON.
  if (files.length > 0) {
    const formData = new FormData();
    formData.append('company', company || 'Unknown');
    formData.append('question', message);
    files.forEach((file) => {
      formData.append('file', file);
    });
    const response = await fetch('/api/question', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Chat request failed (${response.status}): ${errorText}`);
    }
    const data = await response.json();
    // The endpoint returns an envelope with synthesized_answer.
    const payload = data?.data ?? data;
    const answer = payload?.synthesized_answer;
    if (answer) return answer;
    if (payload?.synthesis_error) {
      throw new Error(`AI synthesis error: ${payload.synthesis_error}`);
    }
    throw new Error('No answer received from the AI service.');
  } else {
    // JSON request (no files)
    const response = await fetch('/api/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: company || 'Unknown',
        question: message,
        documents: [],
      }),
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Chat request failed (${response.status}): ${errorText}`);
    }
    const data = await response.json();
    const payload = data?.data ?? data;
    const answer = payload?.synthesized_answer;
    if (answer) return answer;
    if (payload?.synthesis_error) {
      throw new Error(`AI synthesis error: ${payload.synthesis_error}`);
    }
    throw new Error('No answer received from the AI service.');
  }
}
