"""
Generates synthetic e-commerce event data and loads it into Splunk.
Run: python load_sample_data.py
"""

import json
import random
import argparse
from datetime import datetime, timedelta


def generate_events(days: int = 7) -> list:
    events = []
    base_time = datetime.now() - timedelta(days=days)

    # Tuesday anomaly window (day 2, 14:00-18:00)
    anomaly_start = base_time + timedelta(days=2, hours=14)
    anomaly_end = base_time + timedelta(days=2, hours=18)

    for hour_offset in range(days * 24):
        current_time = base_time + timedelta(hours=hour_offset)
        in_anomaly = anomaly_start <= current_time <= anomaly_end

        # Normal traffic
        normal_requests = random.randint(800, 1200)
        error_rate = 0.45 if in_anomaly else 0.02
        payment_failure_rate = 0.38 if in_anomaly else 0.03
        timeout_rate = 0.31 if in_anomaly else 0.01

        for _ in range(normal_requests):
            events.append({
                "_time": current_time.isoformat(),
                "sourcetype": "web_logs",
                "event": "page_view",
                "status": 200,
                "endpoint": random.choice(["/checkout", "/product", "/cart", "/home"])
            })

        # API errors
        error_count = int(normal_requests * error_rate)
        for _ in range(error_count):
            events.append({
                "_time": current_time.isoformat(),
                "sourcetype": "api_logs",
                "level": "ERROR",
                "endpoint": "/api/checkout",
                "error": "timeout" if random.random() < timeout_rate else "500_internal",
                "response_time_ms": random.randint(5000, 30000) if in_anomaly else random.randint(100, 500)
            })

        # Payment events
        payment_count = int(normal_requests * 0.15)
        for _ in range(payment_count):
            failed = random.random() < payment_failure_rate
            events.append({
                "_time": current_time.isoformat(),
                "sourcetype": "payment_logs",
                "status": "failed" if failed else "success",
                "amount": round(random.uniform(20, 500), 2),
                "error": "gateway_timeout" if failed and in_anomaly else ("card_declined" if failed else None)
            })

        # Checkout abandonment
        if in_anomaly:
            for _ in range(random.randint(50, 150)):
                events.append({
                    "_time": current_time.isoformat(),
                    "sourcetype": "web_logs",
                    "event": "checkout_abandoned",
                    "step": random.choice(["payment", "shipping", "review"]),
                    "session_duration_s": random.randint(30, 300)
                })

    return events


def save_to_file(events: list, filename: str = "sample_ecommerce_events.json"):
    with open(filename, "w") as f:
        json.dump(events, f, indent=2)
    print(f"Generated {len(events)} events → {filename}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--days", type=int, default=7)
    parser.add_argument("--output", type=str, default="sample_ecommerce_events.json")
    args = parser.parse_args()

    events = generate_events(days=args.days)
    save_to_file(events, args.output)
    print("Sample data ready. Load into Splunk via: Settings > Add Data > Upload")
