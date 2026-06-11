from groq import Groq
import json
import os


SYSTEM_PROMPT = """You are a senior business analyst writing an executive post-mortem report.
Given a causal chain of technical events and their business impact, write a structured Autopsy Report.

Return ONLY valid JSON. No markdown, no backticks, no explanation.

The JSON must have exactly these fields:
{
  "executive_summary": "2-3 sentence summary for a CEO",
  "root_cause": "The single most likely root cause",
  "estimated_impact": "Dollar amount or percentage impact estimate",
  "timeline_narrative": "A paragraph describing what happened chronologically",
  "contributing_factors": ["factor 1", "factor 2"],
  "corrective_actions": [
    {"action": "what to do", "priority": "high|medium|low", "owner": "Engineering|Product|DevOps"}
  ],
  "prevention": "How to prevent this from happening again"
}"""


class ReportGenerator:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    async def generate(self, question: str, causal_chain: list, timeline: list) -> dict:
        if not causal_chain:
            return self._empty_report()

        message = self.client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"""
Original business question: {question}

Causal chain identified:
{json.dumps(causal_chain, indent=2)}

Timeline:
{json.dumps(timeline, indent=2)}

Write the Autopsy Report.
"""
                }
            ],
            max_tokens=1000
        )

        raw = message.choices[0].message.content.strip()
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return self._empty_report()

    def _empty_report(self) -> dict:
        return {
            "executive_summary": "Investigation complete. No significant anomalies detected.",
            "root_cause": "No clear root cause identified",
            "estimated_impact": "Unknown",
            "timeline_narrative": "The investigation did not surface significant correlated events.",
            "contributing_factors": [],
            "corrective_actions": [],
            "prevention": "Continue monitoring key business metrics with automated alerting."
        }