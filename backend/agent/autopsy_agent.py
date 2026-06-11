import asyncio
import uuid

from splunk.client import SplunkClient
from agent.hypothesis_generator import HypothesisGenerator
from agent.causal_scorer import CausalScorer
from agent.report_generator import ReportGenerator


class AutopsyAgent:
    def __init__(self):
        self.splunk = SplunkClient()
        self.hypothesis_gen = HypothesisGenerator()
        self.causal_scorer = CausalScorer()
        self.report_gen = ReportGenerator()

    async def run(self, question: str, time_range: str, index: str) -> dict:
        investigation_id = str(uuid.uuid4())[:8]

        # Step 1: Generate hypotheses from the business question
        hypotheses = await self.hypothesis_gen.generate(question, time_range)

        # Step 2: Execute SPL queries in parallel for each hypothesis
        query_tasks = [
            self.splunk.execute_query(h["spl_query"], index)
            for h in hypotheses
        ]
        results = await asyncio.gather(*query_tasks, return_exceptions=True)

        # Step 3: Score causal relationships
        causal_chain = self.causal_scorer.build_chain(hypotheses, results)

        # Step 4: Build timeline
        timeline = self.causal_scorer.extract_timeline(causal_chain)

        # Step 5: Generate the Autopsy Report
        report = await self.report_gen.generate(
            question=question,
            causal_chain=causal_chain,
            timeline=timeline
        )

        return {
            "investigation_id": investigation_id,
            "status": "complete",
            "causal_chain": causal_chain,
            "timeline": timeline,
            "report": report,
            "queries_executed": len([r for r in results if not isinstance(r, Exception)])
        }