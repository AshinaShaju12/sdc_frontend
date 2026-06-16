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
  // Retrieve the cached analysis data from localStorage to pass as context
  let analysisContext = null;
  try {
    const saved = localStorage.getItem('current_analysis_data');
    if (saved) {
      analysisContext = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load current analysis context for chat:", e);
  }

  const companyName = company || 'Unknown';
  const accountId = `${companyName.replace(/\s+/g, '')}_001`;

  // If there are files, use multipart/form-data via FormData; otherwise JSON.
  if (files.length > 0) {
    const formData = new FormData();
    formData.append('company_name', companyName);
    formData.append('company', companyName);
    formData.append('account_id', accountId);
    formData.append('message', message);
    formData.append('question', message); // backward compatibility
    
    if (analysisContext) {
      formData.append('analysis_context', JSON.stringify(analysisContext));
    }
    files.forEach((file) => {
      formData.append('file', file);
    });

    const response = await fetch('/api/company-analysis/deal-coach', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Chat request failed (${response.status}): ${errorText}`);
    }
    const data = await response.json();
    const payload = data?.data ?? data;
    const answer = payload?.answer || payload?.synthesized_answer;
    if (answer) return answer;
    throw new Error('No answer received from the AI service.');
  } else {
    // JSON request (no files)
    const response = await fetch('/api/company-analysis/deal-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: companyName,
        company: companyName,
        account_id: accountId,
        message: message,
        question: message, // backward compatibility
        analysis_context: analysisContext,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Chat request failed (${response.status}): ${errorText}`);
    }
    const data = await response.json();
    const payload = data?.data ?? data;
    const answer = payload?.answer || payload?.synthesized_answer;
    if (answer) return answer;
    throw new Error('No answer received from the AI service.');
  }
}
