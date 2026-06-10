import anthropic
import json
import os


SYSTEM_PROMPT = """You are a business forensics expert. Given a business question about a failure or anomaly, 
generate a list of investigative hypotheses. Each hypothesis must include:
- A plain English description of the potential cause
- A specific SPL (Splunk Search Processing Language) query to test it
- The business metric it affects

Return ONLY a valid JSON array. No explanation, no markdown, no backticks.

Example output:
[
  {
    "id": "h1",
    "description": "Payment gateway timeouts caused checkout failures",
    "spl_query": "index=main sourcetype=payment_logs status=timeout | timechart count by endpoint",
    "business_metric": "checkout_conversion_rate",
    "confidence": 0.0
  }
]"""


class HypothesisGenerator:
    def __init__(self):
        self.client = anthropic.Anthropic()

    async def generate(self, question: str, time_range: str) -> list:
        message = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"Business question: {question}\nTime range: {time_range}\n\nGenerate 4-6 investigative hypotheses with SPL queries."
                }
            ]
        )

        raw = message.content[0].text.strip()
        try:
            hypotheses = json.loads(raw)
        except json.JSONDecodeError:
            hypotheses = self._fallback_hypotheses(question)

        return hypotheses

    def _fallback_hypotheses(self, question: str) -> list:
        return [
            {
                "id": "h1",
                "description": "API error rate spike during the affected period",
                "spl_query": "index=main sourcetype=api_logs level=ERROR | timechart count",
                "business_metric": "error_rate",
                "confidence": 0.0
            },
            {
                "id": "h2",
                "description": "Payment processing failures",
                "spl_query": "index=main sourcetype=payment_logs status!=success | timechart count by status",
                "business_metric": "payment_success_rate",
                "confidence": 0.0
            },
            {
                "id": "h3",
                "description": "Checkout abandonment spike",
                "spl_query": "index=main sourcetype=web_logs event=checkout_abandoned | timechart count",
                "business_metric": "checkout_abandonment_rate",
                "confidence": 0.0
            }
        ]
