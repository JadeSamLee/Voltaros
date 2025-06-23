from adk import AgentOrchestrator
from agents.chaos_injector import ChaosInjectorAgent
from agents.monitor import MonitorAgent
from agents.reporter import ReporterAgent
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    orchestrator = AgentOrchestrator()
    
    # Initialize agents
    chaos_injector = ChaosInjectorAgent()
    monitor = MonitorAgent()
    reporter = ReporterAgent()
    
    # Register agents
    orchestrator.register_agent(chaos_injector, "chaos_injector")
    orchestrator.register_agent(monitor, "monitor")
    orchestrator.register_agent(reporter, "reporter")
    
    # Start orchestration
    await orchestrator.start()
    
    # Simulate a chaos experiment
    await orchestrator.send_message(
        agent_id="chaos_injector",
        message={"command": "run_experiment"}
    )
    await asyncio.sleep(5)  # Wait for metrics
    await orchestrator.send_message(
        agent_id="monitor",
        message={"command": "collect_metrics"}
    )
    await asyncio.sleep(5)  # Wait for report
    await orchestrator.send_message(
        agent_id="reporter",
        message={"command": "generate_report"}
    )

if __name__ == "__main__":
    asyncio.run(main())