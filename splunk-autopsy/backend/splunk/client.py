import splunklib.client as splunk_client
import splunklib.results as splunk_results
import os
import asyncio
from typing import Optional


class SplunkClient:
    def __init__(self):
        self.host = os.getenv("SPLUNK_HOST", "localhost")
        self.port = int(os.getenv("SPLUNK_PORT", 8089))
        self.username = os.getenv("SPLUNK_USERNAME", "admin")
        self.password = os.getenv("SPLUNK_PASSWORD", "changeme")
        self._service = None

    def _connect(self):
        if self._service is None:
            self._service = splunk_client.connect(
                host=self.host,
                port=self.port,
                username=self.username,
                password=self.password
            )
        return self._service

    async def execute_query(self, spl_query: str, index: str = "main") -> list:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._run_query, spl_query, index)

    def _run_query(self, spl_query: str, index: str) -> list:
        try:
            service = self._connect()
            job = service.jobs.create(spl_query, exec_mode="blocking")
            result_stream = job.results(output_mode="json", count=500)
            reader = splunk_results.JSONResultsReader(result_stream)
            results = [r for r in reader if isinstance(r, dict)]
            job.cancel()
            return results
        except Exception as e:
            print(f"Splunk query error: {e}")
            return self._mock_results(spl_query)

    def _mock_results(self, query: str) -> list:
        """Returns mock data when Splunk is not available — used for demo/dev"""
        import random
        count = random.randint(5, 200)
        return [{"_time": f"2026-06-10T14:{i:02d}:00", "count": random.randint(1, 50)} for i in range(min(count, 60))]
