/**
 * REST clients for all AI engines. No SDKs — just fetch().
 * Each function returns: { model, provider, responseText, tokensUsed, latencyMs, citations? }
 */

export async function callOpenAI(prompt, opts = {}) {
  const start = Date.now();
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: opts.model ?? "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: opts.maxTokens ?? 1024,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${data?.error?.message ?? "unknown"}`);
  return {
    model: "chatgpt",
    provider: "openai",
    responseText: data.choices?.[0]?.message?.content ?? "",
    tokensUsed:   data.usage?.total_tokens ?? 0,
    latencyMs:    Date.now() - start,
  };
}

export async function callClaude(prompt, opts = {}) {
  const start = Date.now();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type":     "application/json",
      "x-api-key":         process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: opts.model ?? "claude-haiku-4-5-20251001",
      max_tokens: opts.maxTokens ?? 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${data?.error?.message ?? "unknown"}`);
  return {
    model: "claude",
    provider: "anthropic",
    responseText: data.content?.[0]?.text ?? "",
    tokensUsed:   (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
    latencyMs:    Date.now() - start,
  };
}

export async function callGemini(prompt, opts = {}) {
  const start = Date.now();
  const model = opts.model ?? "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${data?.error?.message ?? "unknown"}`);
  return {
    model: "gemini",
    provider: "google",
    responseText: data.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
    tokensUsed:   data.usageMetadata?.totalTokenCount ?? 0,
    latencyMs:    Date.now() - start,
  };
}

export async function callPerplexity(prompt, opts = {}) {
  const start = Date.now();
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    },
    body: JSON.stringify({
      model: opts.model ?? "llama-3.1-sonar-small-128k-online",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Perplexity ${res.status}: ${data?.error?.message ?? "unknown"}`);
  const citations = (data.citations ?? []).map((url) => {
    try {
      const u = new URL(url);
      return { citedUrl: url, citedDomain: u.hostname, isBrandDomain: false, authorityScore: 0 };
    } catch { return { citedUrl: url, citedDomain: "", isBrandDomain: false, authorityScore: 0 }; }
  });
  return {
    model: "perplexity",
    provider: "perplexity",
    responseText: data.choices?.[0]?.message?.content ?? "",
    tokensUsed:   data.usage?.total_tokens ?? 0,
    latencyMs:    Date.now() - start,
    citations,
  };
}

/**
 * Google AI Overviews via DataForSEO SERP API.
 * Returns the AI Overview block when present for a query.
 */
export async function callGoogleAIOverview(prompt, opts = {}) {
  const start = Date.now();
  const login = process.env.DATAFORSEO_LOGIN;
  const pass  = process.env.DATAFORSEO_PASSWORD;
  if (!login || !pass) throw new Error("DataForSEO credentials missing");

  const auth = Buffer.from(`${login}:${pass}`).toString("base64");
  const res = await fetch("https://api.dataforseo.com/v3/serp/google/organic/live/advanced", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify([{
      keyword:       prompt,
      language_code: opts.lang     ?? "en",
      location_code: opts.location ?? 2840, // United States
      device:        "desktop",
    }]),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`DataForSEO ${res.status}`);

  const items = data.tasks?.[0]?.result?.[0]?.items ?? [];
  const ai = items.find((i) => i.type === "ai_overview");
  const text = ai?.text ?? ai?.markdown ?? items
    .filter((i) => i.type === "organic")
    .slice(0, 3)
    .map((i) => `${i.title}\n${i.description}`)
    .join("\n\n");
  const refs = ai?.references ?? [];
  const citations = refs.map((r) => ({
    citedUrl:       r.url,
    citedDomain:    r.domain,
    isBrandDomain:  false,
    authorityScore: 0,
  }));

  return {
    model: "google_ai_overview",
    provider: "google",
    responseText: text ?? "",
    tokensUsed:   0,
    latencyMs:    Date.now() - start,
    citations,
  };
}

/** Return the list of caller functions whose env vars are set. */
export function availableCallers() {
  const callers = [];
  if (process.env.OPENAI_API_KEY)                                       callers.push(callOpenAI);
  if (process.env.ANTHROPIC_API_KEY)                                    callers.push(callClaude);
  if (process.env.GEMINI_API_KEY)                                       callers.push(callGemini);
  if (process.env.PERPLEXITY_API_KEY)                                   callers.push(callPerplexity);
  if (process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD)  callers.push(callGoogleAIOverview);
  return callers;
}
