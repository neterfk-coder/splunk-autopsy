import anthropic
import json


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
        self.client = anthropic.Anthropic()

    async def generate(self, question: str, causal_chain: list, timeline: list) -> dict:
        if not causal_chain:
            return self._empty_report(question)

        message = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=[
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
            ]
        )

        raw = message.content[0].text.strip()
        try:
            report = json.loads(raw)
        except json.JSONDecodeError:
            report = self._empty_report(question)

        return report

    def _empty_report(self, question: str) -> dict:
        return {
            "executive_summary": "Investigation complete. No significant anomalies detected in the specified time range.",
            "root_cause": "No clear root cause identified",
            "estimated_impact": "Unknown",
            "timeline_narrative": "The investigation did not surface significant correlated events.",
            "contributing_factors": [],
            "corrective_actions": [],
            "prevention": "Continue monitoring key business metrics with automated alerting."
        }
