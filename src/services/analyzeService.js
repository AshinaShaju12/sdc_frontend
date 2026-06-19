export async function analyzeCompany(companyName, file) {
  const formData = new FormData();
  formData.append('company_name', companyName);
  formData.append('company', companyName); // for backward compatibility
  formData.append('account_id', `${companyName.replace(/\s+/g, '')}_001`);
  
  // Deriving website url
  const cleanDomain = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  formData.append('website_url', `https://www.${cleanDomain}.com`);
  
  formData.append('question', 'Create full company analysis dashboard');
  formData.append('documents', JSON.stringify([]));

  if (file) {
    formData.append('file', file);
  }

  // Point to the correct backend endpoint
  const response = await fetch('/api/company-analysis', {
    method: 'POST',
    body: formData, // fetch will automatically set the correct Content-Type for FormData
  });

  if (!response.ok) {
    throw new Error('Failed to analyze company');
  }

  const jsonResult = await response.json();
  const mapped = mapAnalysisData(jsonResult);
  if (mapped) {
    saveToLocalStorageHistory(mapped);
  }
  return mapped;
}

function saveToLocalStorageHistory(mappedData) {
  try {
    const companyName = mappedData.company_name;
    if (!companyName) return;

    // Save full data
    localStorage.setItem(`analysis_data_${companyName.toLowerCase()}`, JSON.stringify(mappedData));

    // Save metadata to history list
    const historyJson = localStorage.getItem('search_history');
    let historyArray = historyJson ? JSON.parse(historyJson) : [];
    
    // Remove if already exists to prevent duplicates
    historyArray = historyArray.filter(item => item.name.toLowerCase() !== companyName.toLowerCase());

    // Add new to the beginning
    historyArray.unshift({
      id: `${companyName.replace(/\s+/g, '')}_${Date.now()}`,
      name: companyName,
      industry: mappedData.raw?.intelligence_overview?.industry_position || "Industrial",
      date: new Date().toISOString(),
      score: mappedData.strategic_fit_score || 0,
      status: "Analyzed"
    });

    localStorage.setItem('search_history', JSON.stringify(historyArray));
  } catch (error) {
    console.error("Failed to save to localStorage history:", error);
  }
}

function mapAnalysisData(backendRes) {
  const data = backendRes?.data || backendRes;
  if (!data) return null;

  // 1. strategic_fit_score
  const strategic_fit_score = data.strategic_fit?.score || 0;

  // 2. intelligence_overview formatted as a single string
  let intelligence_overview = "";
  if (data.intelligence_overview) {
    const io = data.intelligence_overview;
    if (io.company_overview) intelligence_overview += `${io.company_overview}\n\n`;
    if (io.industry_position) intelligence_overview += `**Industry Position:** ${io.industry_position}\n\n`;
    if (io.business_model) intelligence_overview += `**Business Model:** ${io.business_model}\n\n`;
    if (io.strategic_goals?.length) {
      intelligence_overview += `**Strategic Goals:**\n${io.strategic_goals.map(g => `• ${g}`).join('\n')}\n\n`;
    }
    if (io.sustainability_commitments?.length) {
      intelligence_overview += `**Sustainability Commitments:**\n${io.sustainability_commitments.map(s => `• ${s}`).join('\n')}\n\n`;
    }
    intelligence_overview = intelligence_overview.trim();
  }

  // 3. ai_needs_prediction (list of strings)
  let ai_needs_prediction = [];
  if (data.ai_needs_prediction?.length) {
    ai_needs_prediction = data.ai_needs_prediction.map(item => typeof item === 'string' ? item : (item.need || ""));
  } else {
    // Generate default requirements if empty
    ai_needs_prediction = (data.solution_mapping || []).map(sm => sm.requirement)
      .concat(["Sustainability Tracking & Auditing", "Energy Efficiency Optimization"]);
    ai_needs_prediction = [...new Set(ai_needs_prediction)];
  }

  // 4. solution_mapping (fields renamed/mapped)
  const solution_mapping = (data.solution_mapping || []).map(sm => ({
    requirement: sm.requirement || "General Requirement",
    solution: sm.novachem_solution || "GrowthlensAI Custom Solution",
    match_percentage: sm.match_percent !== undefined ? sm.match_percent : (sm.match || 70),
    deal_value: sm.deal_value || "TBD"
  }));

  // 5. executive_qbr and meeting_preparation
  const executive_qbr = {
    key_business_priorities: data.meeting_prep?.business_priorities || ["Sustainability compliance", "Risk reduction"],
    growth_initiatives: data.intelligence_overview?.expansion_initiatives || ["Market expansion", "Product portfolio scaling"],
    risk_factors: data.meeting_prep?.potential_objections || ["Supply chain cost challenges", "Carbon tax compliance"],
    buying_signals: (data.strategic_fit?.evidence || []).map(e => e.finding)
  };

  const meeting_preparation = {
    suggested_discussion_points: data.meeting_prep?.key_discussion_topics || data.meeting_prep?.executive_talking_points || [],
    potential_objections: data.meeting_prep?.potential_objections || [],
    relevant_case_studies: (data.strategic_fit?.evidence || [])
      .filter(e => e.source === 'product_rag' || e.source === 'website')
      .map(e => e.finding),
    stakeholders_to_target: ["Procurement Director", "Sustainability Lead", "Head of Operations"]
  };

  // 6. deal_coach
  const deal_coach = {
    recommended_pitch_strategy: data.meeting_prep?.qbr_summary || "Focus on sustainability and ESG compliance.",
    cross_sell_opportunities: (data.solution_mapping || []).slice(0, 2).map(sm => `Cross-sell ${sm.novachem_solution} for ${sm.requirement}`),
    upsell_opportunities: (data.solution_mapping || []).slice(2).map(sm => `Upsell premium maintenance & analytics for ${sm.novachem_solution}`)
  };

  // Fallbacks if empty
  if (deal_coach.cross_sell_opportunities.length === 0) {
    deal_coach.cross_sell_opportunities = ["Cross-sell EcoShield Bio-Coatings for paint production lines", "Introduce VOCapture Elite for emission compliance"];
  }
  if (deal_coach.upsell_opportunities.length === 0) {
    deal_coach.upsell_opportunities = ["Upsell premium support and automation on existing water recovery platforms"];
  }

  return {
    company: data.company_name || data.company || "the analyzed company",
    company_name: data.company_name || data.company || "the analyzed company",
    strategic_fit_score,
    intelligence_overview,
    ai_needs_prediction,
    solution_mapping,
    executive_qbr,
    meeting_preparation,
    deal_coach,
    raw: data // Keep raw data just in case
  };
}
