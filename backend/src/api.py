from fastapi import FastAPI
from adk import AgentOrchestrator
import asyncio

app = FastAPI(title="Voltaros Chaos Engineering API")

# Initialize orchestrator
orchestrator = AgentOrchestrator()

@app.on_event("startup")
async def startup_event():
    # Start orchestrator
    await orchestrator.start()

@app.post("/trigger-experiment")
async def trigger_experiment():
    try:
        # Trigger chaos experiment
        response = await orchestrator.send_message(
            agent_id="chaos_injector",
            message={"command": "run_experiment"}
        )
        return {"status": "success", "response": response}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/collect-metrics")
async def collect_metrics():
    try:
        # Collect metrics
        response = await orchestrator.send_message(
            agent_id="monitor",
            message={"command": "collect_metrics"}
        )
        return {"status": "success", "response": response}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/generate-report")
async def generate_report():
    try:
        # Generate report
        response = await orchestrator.send_message(
            agent_id="reporter",
            message={"command": "generate_report"}
        )
        return {"status": "success", "response": response}
    except Exception as e:
        return {"status": "error", "message": str(e)}