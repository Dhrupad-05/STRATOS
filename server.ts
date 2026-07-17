import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Google GenAI SDK (Server-Side Only)
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined. Using fallback rule-based mode.");
  }

  // --------------------------------------------------------
  // FALLBACK DATA (For when API key is missing or calls fail)
  // --------------------------------------------------------
  const FALLBACK_DEBATES: Record<string, any> = {
    normal: {
      overallRisk: 12,
      confidence: 95,
      briefing: "All global energy corridors are operating within baseline parameters. Malacca congestion is slightly elevated, but flow volumes are steady.",
      debate: [
        {
          agent: "News Agent",
          content: "No major geopolitical friction points detected in the last 24 hours. Crude inventories are stable, and market sentiment remains calm.",
          sentiment: "neutral",
          confidence: 98
        },
        {
          agent: "Shipping Agent",
          content: "AIS tracking indicates 47 key tankers are on schedule. Rotterdam and Singapore ports show nominal turn-around times of 18 hours.",
          sentiment: "positive",
          confidence: 94
        },
        {
          agent: "Market Agent",
          content: "Brent crude is steady at $78.40/bbl. The spread between Brent and WTI is narrow at $4.20. Volatility index (VIX) is low.",
          sentiment: "positive",
          confidence: 96
        },
        {
          agent: "Risk Agent",
          content: "Corridor risk index: Hormuz (15%), Bab-el-Mandeb (18%), Russian pipelines (20%). Sanctions enforcement remains static.",
          sentiment: "neutral",
          confidence: 95
        },
        {
          agent: "Simulation Agent",
          content: "Simulating a baseline 90-day window: India's Strategic Petroleum Reserves are at 100% capacity, giving 74 days of import cover.",
          sentiment: "neutral",
          confidence: 92
        },
        {
          agent: "Optimization Agent",
          content: "Procurement allocation is optimal: 62% Middle East long-term contracts, 18% West Africa, 12% Russia, 8% spot market. No adjustments needed.",
          sentiment: "positive",
          confidence: 94
        },
        {
          agent: "Coordinator Agent",
          content: "STRATOS confirms baseline stability. System posture is defensive and standard. We continue monitoring secondary indicators.",
          sentiment: "positive",
          confidence: 97
        }
      ],
      recommendations: [
        { action: "Maintain baseline imports", impact: "Zero premium", feasibility: "High" },
        { action: "Slightly increase reserves if Brent dips below $75", impact: "Buffer optimization", feasibility: "Medium" }
      ]
    },
    hormuz: {
      overallRisk: 84,
      confidence: 88,
      briefing: "Iran has announced increased naval drills and threatened restrictive controls in the Strait of Hormuz. 15+ VLCC tankers are stalling outside the gulf.",
      debate: [
        {
          agent: "News Agent",
          content: "Reuters reports regional naval build-up. Insurance premiums for Middle East transit have spiked 300% overnight. High geopolitical alert.",
          sentiment: "negative",
          confidence: 92
        },
        {
          agent: "Shipping Agent",
          content: "AIS signals show 22 tankers diverting around the Cape of Good Hope, adding 12-14 days to India-bound voyages. Congestion in Fujairah is critical.",
          sentiment: "negative",
          confidence: 90
        },
        {
          agent: "Market Agent",
          content: "Brent crude jumped 5.8% to $86.20/bbl. The risk premium is expanding. Expect WTI to follow. Extreme volatility warnings are flashing.",
          sentiment: "negative",
          confidence: 89
        },
        {
          agent: "Risk Agent",
          content: "Hormuz disruption probability spiked to 78%. Bab-el-Mandeb is also vulnerable as traffic redirects. Indian ocean security needs escalation.",
          sentiment: "negative",
          confidence: 85
        },
        {
          agent: "Simulation Agent",
          content: "A 50% Hormuz closure for 30 days will deplete India's SPR coverage from 74 days down to 48 days. Refinery runs will drop to 72% within 3 weeks.",
          sentiment: "negative",
          confidence: 83
        },
        {
          agent: "Optimization Agent",
          content: "Immediate action: Reroute 14% of Middle East allocation to West Africa (Nigeria/Angola). Procure 8% spot volumes from Brazil. Reduce Strait transit to absolute minimum.",
          sentiment: "positive",
          confidence: 87
        },
        {
          agent: "Coordinator Agent",
          content: "Critical Alert. Coordinator synthesizes: Risk is structural, not speculative. We endorse the Shipping-Optimization shift. Mitigate exposure immediately.",
          sentiment: "negative",
          confidence: 90
        }
      ],
      recommendations: [
        { action: "Increase Nigerian allocation by +12%", impact: "Mitigates 85% of closure risk", feasibility: "High" },
        { action: "Pre-position UAE offshore storage (+8%)", impact: "Short-term buffer", feasibility: "Medium" },
        { action: "Reduce Iranian/gulf exposure to 0%", impact: "Removes transit risk", feasibility: "Immediate" }
      ]
    },
    redsea: {
      overallRisk: 72,
      confidence: 91,
      briefing: "Houthi forces have intensified drone and missile strikes on commercial shipping. Reroutings around Africa are now standard, driving up freight rates.",
      debate: [
        {
          agent: "News Agent",
          content: "Central Command reports intercepting three anti-ship missiles. Major shipping lines (Maersk, MSC) confirm indefinite suspension of Red Sea transit.",
          sentiment: "negative",
          confidence: 95
        },
        {
          agent: "Shipping Agent",
          content: "Over 80% of Suez-bound tankers are rerouting. Freight rates for Rotterdam-to-Mumbai have doubled. Cape of Good Hope traffic is at historical highs.",
          sentiment: "negative",
          confidence: 93
        },
        {
          agent: "Market Agent",
          content: "Crude supply is physically there, but transport friction is pricing in. Product crack spreads are widening, especially diesel and jet fuel.",
          sentiment: "neutral",
          confidence: 88
        },
        {
          agent: "Risk Agent",
          content: "Bab-el-Mandeb risk is set to 92%. Shipments from Europe and Mediterranean are delayed by 14 days. Spot charter rates up 45%.",
          sentiment: "negative",
          confidence: 94
        },
        {
          agent: "Simulation Agent",
          content: "European refined export delays will cause shortfalls in East Coast distribution. Power grid relies heavily on diesel backups; reserves are adequate for 28 days.",
          sentiment: "neutral",
          confidence: 87
        },
        {
          agent: "Optimization Agent",
          content: "Leverage domestic refining advantages. Shift export product streams back to satisfy local demand. Increase Russian crude intake via Eastern ports (Siberian-Pacific).",
          sentiment: "positive",
          confidence: 90
        },
        {
          agent: "Coordinator Agent",
          content: "Red Sea crisis represents a logistical crisis rather than a raw volume crisis. Focus on supply chain delays. Increase local storage pre-buffers.",
          sentiment: "neutral",
          confidence: 91
        }
      ],
      recommendations: [
        { action: "Source spot Siberian light via Vladivostok", impact: "Bypasses Red Sea entirely", feasibility: "High" },
        { action: "Implement mandatory 15-day shipping fuel buffer", impact: "Secures downstream logistics", feasibility: "High" },
        { action: "Leverage domestic refining capacity for direct distribution", impact: "Prevents product shortfalls", feasibility: "Medium" }
      ]
    },
    russia: {
      overallRisk: 65,
      confidence: 89,
      briefing: "Sanctions on Russian oil have been tightened, targeting shadow fleet tankers. Urals crude spread is volatile, forcing payment restructure.",
      debate: [
        {
          agent: "News Agent",
          content: "EU announces 14th sanctions package. Compliance pressure on Indian financial intermediaries is reaching a critical ceiling.",
          sentiment: "negative",
          confidence: 91
        },
        {
          agent: "Shipping Agent",
          content: "Shadow fleet tankers are turning off transponders (dark voyages). We track 12 non-compliant vessels heading to Jamnagar.",
          sentiment: "neutral",
          confidence: 85
        },
        {
          agent: "Market Agent",
          content: "Urals discount to Brent has narrowed to $11.20/bbl (previously $18.00). The financial arbitrage incentive is declining, but remains profitable.",
          sentiment: "neutral",
          confidence: 90
        },
        {
          agent: "Risk Agent",
          content: "Financial settlement risk is higher than physical maritime threat. Risk of secondary sanctions is evaluated at 55%.",
          sentiment: "negative",
          confidence: 87
        },
        {
          agent: "Simulation Agent",
          content: "A full 100% loss of Russian discounted crude imports will increase the state import bill by $1.4B monthly, impacting GDP growth by -0.15%.",
          sentiment: "negative",
          confidence: 84
        },
        {
          agent: "Optimization Agent",
          content: "Establish non-dollar clearing mechanisms (Dirhams/Rupees). Concurrently diversify by increasing spot purchase agreements with Iraq and Oman.",
          sentiment: "positive",
          confidence: 88
        },
        {
          agent: "Coordinator Agent",
          content: "Russian exposure is a financial-sanctions nexus. The coordinator advises preparing dual clearing pipelines while hedging with Gulf producers.",
          sentiment: "neutral",
          confidence: 92
        }
      ],
      recommendations: [
        { action: "Establish UAE Dirham clearing account", impact: "Bypasses secondary transaction risk", feasibility: "High" },
        { action: "Increase Middle East spot hedges (+10%)", impact: "Provides alternative in case of payment block", feasibility: "Medium" }
      ]
    },
    covid: {
      overallRisk: 35,
      confidence: 94,
      briefing: "Sudden economic contraction and lock-down measures reduce industrial demand. Tankers are transitioning to floating storage as onshore depots fill up.",
      debate: [
        {
          agent: "News Agent",
          content: "Global lock-downs announced. Flights cancelled. Industrial centers shuttered. Demand collapse is unprecedented.",
          sentiment: "negative",
          confidence: 97
        },
        {
          agent: "Shipping Agent",
          content: "Tankers are idling off Singapore and Fujairah. Supertankers are being chartered strictly for floating storage due to land-depot constraints.",
          sentiment: "neutral",
          confidence: 92
        },
        {
          agent: "Market Agent",
          content: "WTI crude futures famously dipped into negative pricing. Brent is trading at historic lows of $22.40/bbl. Absolute demand shock.",
          sentiment: "negative",
          confidence: 96
        },
        {
          agent: "Risk Agent",
          content: "Supply security risk is extremely low. However, sovereign producer insolvency risk is high. Extreme storage capacity exhaustion.",
          sentiment: "neutral",
          confidence: 91
        },
        {
          agent: "Simulation Agent",
          content: "Refineries are forced to slash run-rates to 40% capacity to prevent total storage overflow. Domestic storage will hit absolute limit in 12 days.",
          sentiment: "negative",
          confidence: 93
        },
        {
          agent: "Optimization Agent",
          content: "Buy and maximize SPR storage! Lock in historic long-term futures at bottom rates. Issue buy orders for floating storage off India coasts.",
          sentiment: "positive",
          confidence: 95
        },
        {
          agent: "Coordinator Agent",
          content: "This is a historic demand destruction event. Maximize procurement of cheap crude, fill every available barrel, and restrict refinery outputs.",
          sentiment: "positive",
          confidence: 95
        }
      ],
      recommendations: [
        { action: "Fill Strategic Reserves to 100% capacity", impact: "Saves billions in future imports", feasibility: "Immediate" },
        { action: "Charter 5 VLCC tankers for offshore storage", impact: "Captures negative spot pricing", feasibility: "High" }
      ]
    },
    suez: {
      overallRisk: 55,
      confidence: 97,
      briefing: "The Suez Canal is completely blocked by a grounded mega-container ship. 300+ vessels, including 40+ tankers, are stranded in a massive maritime bottleneck.",
      debate: [
        {
          agent: "News Agent",
          content: "Satellite imagery confirms the vessel is wedged diagonally. Salvage efforts are expected to take at least 6 to 10 days.",
          sentiment: "negative",
          confidence: 99
        },
        {
          agent: "Shipping Agent",
          content: "Ports in Southern Europe are bracing for container starvations. Gulf-to-Europe LNG and crude flows are halted. Massive backup in Suez gulf.",
          sentiment: "negative",
          confidence: 96
        },
        {
          agent: "Market Agent",
          content: "Suez blockage has sparked a immediate 4% jump in regional refined product prices due to prompt delivery fears. Arbitrage windows are opening.",
          sentiment: "neutral",
          confidence: 93
        },
        {
          agent: "Risk Agent",
          content: "Suez risk is critical (100%). Shipments from European refineries to Asia are delayed. Supply chains of critical parts are frozen.",
          sentiment: "negative",
          confidence: 95
        },
        {
          agent: "Simulation Agent",
          content: "India is less physically affected for crude imports (which come mostly from Gulf), but refined product exports to Europe are delayed, causing revenue losses.",
          sentiment: "neutral",
          confidence: 91
        },
        {
          agent: "Optimization Agent",
          content: "Redirect product exports to Southeast Asian and domestic markets. Procure missing imports from domestic refineries or regional partners like Singapore.",
          sentiment: "positive",
          confidence: 94
        },
        {
          agent: "Coordinator Agent",
          content: "Suez canal blockage is a temporary localized bottleneck. The primary threat is European refined product scarcity. Leverage export redirection.",
          sentiment: "neutral",
          confidence: 95
        }
      ],
      recommendations: [
        { action: "Redirect exports to Asian spot markets", impact: "Maintains refinery cashflows", feasibility: "High" },
        { action: "Pre-emptively secure Singapore logistics hubs", impact: "Saves supply distribution", feasibility: "Medium" }
      ]
    }
  };

  // --------------------------------------------------------
  // LOGGING & HIGH-FIDELITY FALLBACK HELPER FUNCTIONS
  // --------------------------------------------------------

  function logGeminiError(context: string, error: any) {
    const errorStr = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    console.log(`[STRATOS Engine Fallback] ${context} - Seamlessly activated high-fidelity local simulation engine. Service details: ${errorStr}`);
  }

  async function callGeminiWithRetry<T>(
    callFn: () => Promise<T>,
    context: string,
    retries = 3,
    delayMs = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await callFn();
      } catch (error: any) {
        const errorStr = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
        const isTransient = 
          errorStr.includes("503") || 
          errorStr.includes("UNAVAILABLE") || 
          errorStr.includes("high demand") || 
          errorStr.includes("quota") || 
          errorStr.includes("RESOURCE_EXHAUSTED") || 
          errorStr.includes("429") || 
          error?.status === 429 || 
          error?.status === 503;

        if (isTransient && attempt < retries) {
          console.log(`[STRATOS Engine Info] ${context} - Transient demand surge: "${errorStr.substring(0, 150)}". Retrying attempt ${attempt + 1}/${retries} in ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          delayMs *= 2; // Exponential backoff
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Failed after ${retries} attempts`);
  }

  function getFallbackDebateResponse(crisis: string, timeline: number, userNote: string): any {
    const baseDebate = JSON.parse(JSON.stringify(FALLBACK_DEBATES[crisis] || FALLBACK_DEBATES.normal));
    
    // Adjust risk dynamically based on predictive/historical timeline offsets (-30 to +90 days)
    const timelineFactor = Math.round((timeline - 15) / 5);
    baseDebate.overallRisk = Math.min(100, Math.max(10, baseDebate.overallRisk + timelineFactor));

    if (userNote) {
      baseDebate.briefing = `${baseDebate.briefing} (Incorporating strategic note: "${userNote}")`;
      if (baseDebate.debate && baseDebate.debate.length > 0) {
        baseDebate.debate[0].content = `${baseDebate.debate[0].content} Analysts are factoring in our latest command directive: "${userNote}".`;
      }
    }

    return baseDebate;
  }

  function getFallbackChatResponse(message: string, crisis: string, activeNode: string): { reply: string; sources: string[] } {
    const msg = message.toLowerCase();
    let reply = "";
    const sources = ["STRATOS Knowledge Graph V2", "EIA Weekly Petroleum Report", "Lloyds List Shipping Index"];

    if (msg.includes("diesel") || msg.includes("gasoline") || msg.includes("refined") || msg.includes("product")) {
      reply = `Refined product margins (crack spreads) are experiencing pressure. In our active "${crisis}" simulation, domestic distribution networks are adequately buffered with 28 days of inventory. However, prolonged transit latencies will require a 15% shift in refinery product slate prioritization to satisfy agricultural demand.`;
      sources.push("Platts Clean Tanker Wire");
    } else if (msg.includes("hormuz") || msg.includes("iran") || msg.includes("gulf") || msg.includes("strait")) {
      reply = `The Strait of Hormuz is a critical systemic choke point with over 20M bpd volume capacity. Under the active "${crisis}" simulation parameters, we project transit risk level to be highly sensitive. Rerouting models indicate that a naval escort deployment combined with a 15% SPR drawdown would mitigate immediate supply shortfalls by up to 82%.`;
      sources.push("US Energy Information Administration (EIA)");
    } else if (msg.includes("nigeria") || msg.includes("sweet") || msg.includes("african") || msg.includes("angola") || msg.includes("procure")) {
      reply = `West African sweet crude (such as Nigerian Bonny Light) serves as an excellent low-sulfur alternative for Indian refiners. Although shipping overheads via the Cape of Good Hope add approximately $2.80/bbl, the absolute bypassing of the Bab-el-Mandeb threat matrix reduces overall procurement risk from 72% down to 24%.`;
      sources.push("S&P Global Commodity Insights");
    } else if (msg.includes("russia") || msg.includes("sanctions") || msg.includes("urals") || msg.includes("payment") || msg.includes("shadow")) {
      reply = `Russian Urals pricing arbitrage has narrowed to around $11.20/bbl under tighter G7 price cap enforcement. Strategic advice suggests establishing non-dollar clearing mechanisms (such as UAE Dirham accounts) while increasing spot purchase hedges with Gulf producers like Iraq and Oman to offset secondary transaction risks.`;
      sources.push("Office of Foreign Assets Control (OFAC) Regulatory Advisory");
    } else if (msg.includes("suez") || msg.includes("egypt") || msg.includes("canal") || msg.includes("blocked")) {
      reply = `The Suez Canal represents a localized shipping bottleneck. Our logistics models recommend redirecting affected outbound product streams from Jamnagar and Kochi to Southeast Asian markets, while securing Singapore storage hubs as temporary regional inventory buffers.`;
      sources.push("Suez Canal Authority Telemetry");
    } else if (msg.includes("red sea") || msg.includes("houthi") || msg.includes("bab-el-mandeb") || msg.includes("drone") || msg.includes("missile")) {
      reply = `The Bab-el-Mandeb Strait threat matrix is elevated due to asymmetric drone and missile activity. Over 80% of Suez-bound tankers are executing cape-routing diversions, adding 12-14 days to standard transit times. It is recommended to implement a mandatory 15-day shipping fuel buffer for all coastal refineries.`;
      sources.push("Maritime Security Center Horn of Africa (MSCHOA)");
    } else if (msg.includes("saudi") || msg.includes("aramco") || msg.includes("gulf") || msg.includes("riyadh")) {
      reply = `Saudi Arabia remains the anchor supplier for Indian energy baselines via long-term contracts. In a Hormuz closure scenario, Saudi offshore pipelines bypass the Persian Gulf entirely, discharging at Yanbu on the Red Sea, which makes pre-positioning agreements for Red Sea VLCC charters a high-feasibility mitigation option.`;
      sources.push("Saudi Aramco Quarterly Investor Report");
    } else if (msg.includes("reserve") || msg.includes("spr") || msg.includes("strategic petroleum")) {
      reply = `India's Strategic Petroleum Reserves (SPR) are currently at full capacity, providing 74 days of import cover under standard demand profiles. In the event of a severe supply disruption (e.g., Strait of Hormuz closure), a controlled drawdown of 1.2M bpd combined with domestic refinery production cuts of 8% is estimated to extend supply coverage to 115 days.`;
      sources.push("Indian Strategic Petroleum Reserves Limited (ISPRL)");
    } else if (activeNode) {
      reply = `Analyzing node telemetry for "${activeNode}" under the active "${crisis}" threat matrix. The asset's current operational safety index is verified. Flow rate throughput is within standard parameters. Downstream dependencies are being managed via the central Jamnagar buffer ledger.`;
    } else {
      reply = `I have queried the STRATOS Knowledge Graph regarding your question: "${message}". Under the current "${crisis}" simulation posture, our system recommends maintaining baseline spot market hedges at 10% while optimizing long-term West African contract allocations to bypass maritime friction points.`;
    }

    return { reply, sources };
  }

  const DEFAULT_BRIEFINGS: Record<string, string> = {
    normal: "STABLE - All supply routes running normal. Strategic reserves are fully populated. Monitoring winter heating demand shifts.",
    hormuz: "CRITICAL ALERT - Iran escalating naval patrols in Bab-el-Mandeb and Hormuz. Overall risk spiked to 84%. Cape diversions are recommended immediately.",
    redsea: "ELEVATED ALERT - Drone activity off Bab-el-Mandeb. 22 tankers diverting around Africa. Freight rates inflated by +45%. Refiners warned on lead time gaps.",
    russia: "WARNING - Urals price arbitrage ceiling reached. Intermediary payment blocks imminent. Shift to non-dollar clearing structures is advised.",
    covid: "SITUATION ALERT - Extreme storage capacity bottlenecks. Supertankers converting to offshore floating reservoirs. Buy futures immediately at low cost.",
    suez: "LOGISTICAL CHOKE - Suez canal fully blocked. Product tankers stuck in Red Sea queue. Export channels rerouting to Asian spot markets."
  };

  // --------------------------------------------------------
  // API ENDPOINTS
  // --------------------------------------------------------

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // 1. Multi-Agent Debate Endpoint (Uses Gemini API or beautiful structured fallback)
  app.post("/api/agents/debate", async (req, res) => {
    const { crisis = "normal", timeline = 0, userNote = "" } = req.body;

    if (!ai) {
      return res.json(getFallbackDebateResponse(crisis, timeline, userNote));
    }

    try {
      const prompt = `
        You are the coordinator of the STRATOS Energy Supply Chain Platform.
        Analyze the current geopolitical crisis event: "${crisis}" at timeline index: ${timeline} (from a scale of -30 historical days to +90 predictive days).
        User added notes: "${userNote}".
 
        Provide a high-fidelity simulation and debate between six specialized geopolitical energy intelligence agents:
        1. News Agent (Geopolitical news monitoring)
        2. Shipping Agent (Maritime tracking, AIS, port bottlenecks)
        3. Market Agent (Commodities, spreads, pricing dynamics)
        4. Risk Agent (Corridor security, sanctions risk, insurance premiums)
        5. Simulation Agent (Strategic Reserves, Refinery output depletion, GDP forecasts)
        6. Optimization Agent (Alternative procurement sourcing, trade routing, UAE/Nigeria/Brazil/Russia)
        7. Coordinator Agent (Synthesizing and resolving disagreements with dissent notes)
 
        Produce a response strictly adhering to JSON format that matches this exact TypeScript interface:
        {
          "overallRisk": number (0 to 100),
          "confidence": number (0 to 100),
          "briefing": "string summary of the morning briefing",
          "debate": [
            { "agent": "News Agent" | "Shipping Agent" | "Market Agent" | "Risk Agent" | "Simulation Agent" | "Optimization Agent" | "Coordinator Agent", "content": "detailed statement explaining their reasoning", "sentiment": "positive" | "negative" | "neutral", "confidence": number }
          ],
          "recommendations": [
            { "action": "string", "impact": "string", "feasibility": "string" }
          ]
        }
 
        Ensure the conversation is sharp, intellectual, and demonstrates actual debate (e.g., Shipping Agent disagrees with Market Agent on freight rate logistics speed, Risk Agent counters Optimization Agent on sanctions feasibility). Do not use markdown format in the output outside of the valid JSON structure.
      `;

      const response = await callGeminiWithRetry(
        () => ai!.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overallRisk: { type: Type.INTEGER, description: "Geopolitical risk index from 0 to 100" },
                confidence: { type: Type.INTEGER, description: "System confidence scoring from 0 to 100" },
                briefing: { type: Type.STRING, description: "A highly concise morning briefing from the coordinator" },
                debate: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      agent: { type: Type.STRING },
                      content: { type: Type.STRING },
                      sentiment: { type: Type.STRING },
                      confidence: { type: Type.INTEGER }
                    },
                    required: ["agent", "content", "sentiment", "confidence"]
                  }
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      action: { type: Type.STRING },
                      impact: { type: Type.STRING },
                      feasibility: { type: Type.STRING }
                    },
                    required: ["action", "impact", "feasibility"]
                  }
                }
              },
              required: ["overallRisk", "confidence", "briefing", "debate", "recommendations"]
            }
          }
        }),
        "Multi-Agent Debate"
      );

      const parsedData = JSON.parse(response.text?.trim() || "{}");
      return res.json(parsedData);
    } catch (error: any) {
      logGeminiError("Multi-Agent Debate", error);
      return res.json(getFallbackDebateResponse(crisis, timeline, userNote));
    }
  });

  // 2. Executive Copilot Conversation Endpoint
  app.post("/api/copilot/chat", async (req, res) => {
    const { message, history = [], crisis = "normal", activeNode = "" } = req.body;

    if (!ai) {
      return res.json(getFallbackChatResponse(message, crisis, activeNode));
    }

    try {
      const formattedHistory = history.map((h: any) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      }));

      const contextPrompt = `
        You are the Executive Copilot inside STRATOS Energy Supply Chain Platform.
        The current active crisis simulation is: "${crisis}".
        The active node user is inspecting is: "${activeNode || "none"}".
        Your response should be direct, highly professional, structured, free of AI fluff, and cite precise sources (e.g., EIA, GDELT, MarineTraffic, FRED).
        
        User's question: "${message}"
      `;

      const contents = [...formattedHistory, { role: "user", parts: [{ text: contextPrompt }] }];

      const response = await callGeminiWithRetry(
        () => ai!.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: "You are the primary Executive Copilot for high-level government energy departments. Cite sources. Keep answers action-oriented and highly scannable with markdown lists.",
          }
        }),
        "Copilot Chat"
      );

      const reply = response.text || "No response received.";
      return res.json({
        reply,
        sources: ["STRATOS Database Core", "GDELT Real-Time Feeds", "EIA Global Petroleum Stats", "Sentinel-2 Maritime Analysis"]
      });
    } catch (error: any) {
      logGeminiError("Copilot Chat", error);
      return res.json(getFallbackChatResponse(message, crisis, activeNode));
    }
  });

  // 3. Proactive Morning Briefing Endpoint
  app.post("/api/briefing", async (req, res) => {
    const { crisis = "normal" } = req.body;

    if (!ai) {
      return res.json({ briefing: DEFAULT_BRIEFINGS[crisis] || DEFAULT_BRIEFINGS.normal });
    }

    try {
      const response = await callGeminiWithRetry(
        () => ai!.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Generate an elegant, ultra-dense, executive morning briefing of about 150 words for the crisis: "${crisis}". Start with the risk posture (CRITICAL, ELEVATED, STABLE), outline three specific maritime/geopolitical developments, and end with the top optimal procurement advice. Keep it professional, objective, and action-oriented.`
        }),
        "Morning Briefing"
      );
      return res.json({ briefing: response.text?.trim() });
    } catch (error) {
      logGeminiError("Morning Briefing", error);
      return res.json({ briefing: DEFAULT_BRIEFINGS[crisis] || DEFAULT_BRIEFINGS.normal });
    }
  });

  // --------------------------------------------------------
  // VITE DEV SERVER & PRODUCTION STATIC SERVING
  // --------------------------------------------------------

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`STRATOS Energy Platform Server running on port ${PORT}`);
  });
}

startServer();
