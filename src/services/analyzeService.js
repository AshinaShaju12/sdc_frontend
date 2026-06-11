export async function analyzeCompany(companyName, file) {
  const formData = new FormData();
  formData.append('company', companyName);
  
  if (file) {
    formData.append('file', file);
  }

  // Use the standard fetch but point to proxy API route
  const response = await fetch('/api/analyze-company', {
    method: 'POST',
    body: formData, // fetch will automatically set the correct Content-Type for FormData
  });

  if (!response.ok) {
    throw new Error('Failed to analyze company');
  }

  return response.json();
}
