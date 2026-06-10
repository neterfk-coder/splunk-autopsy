import networkx as nx
from typing import Any


class CausalScorer:
    def build_chain(self, hypotheses: list, results: list) -> list:
        G = nx.DiGraph()
        causal_chain = []

        for i, (hypothesis, result) in enumerate(zip(hypotheses, results)):
            if isinstance(result, Exception):
                continue

            score = self._score(result)
            hypothesis["confidence"] = score
            hypothesis["result_summary"] = self._summarize(result)

            if score > 0.3:
                causal_chain.append({
                    "id": hypothesis["id"],
                    "description": hypothesis["description"],
                    "business_metric": hypothesis["business_metric"],
                    "confidence": round(score, 2),
                    "result_summary": hypothesis["result_summary"],
                    "type": "cause" if score > 0.7 else "contributing_factor"
                })

        causal_chain.sort(key=lambda x: x["confidence"], reverse=True)

        if causal_chain:
            causal_chain[0]["type"] = "root_cause"

        return causal_chain

    def extract_timeline(self, causal_chain: list) -> list:
        timeline = []
        for i, node in enumerate(causal_chain):
            timeline.append({
                "order": i + 1,
                "event": node["description"],
                "impact": node["business_metric"],
                "confidence": node["confidence"],
                "type": node["type"]
            })
        return timeline

    def _score(self, result: Any) -> float:
        if result is None:
            return 0.0
        if isinstance(result, list) and len(result) > 0:
            count = len(result)
            if count > 100:
                return 0.9
            elif count > 50:
                return 0.7
            elif count > 10:
                return 0.5
            elif count > 0:
                return 0.3
        return 0.1

    def _summarize(self, result: Any) -> str:
        if isinstance(result, list):
            return f"{len(result)} events detected"
        return "No significant activity detected"
