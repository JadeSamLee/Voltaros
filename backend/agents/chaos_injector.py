from adk import Agent, OpenAPITool
from google.cloud import storage
from chaoslib import run_experiment
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChaosInjectorAgent(Agent):
    def __init__(self):
        super().__init__()
        self.storage_client = storage.Client()
        self.chaos_tool = OpenAPITool(api_spec="tools/chaos_toolkit.yaml")

    async def handle_message(self, message):
        logger.info(f"ChaosInjector received message: {message}")
        try:
            # Retrieve experiment config from Cloud Storage
            bucket = self.storage_client.bucket("glichu-experiments")
            blob = bucket.get_blob("experiment.json")
            experiment = json.loads(blob.download_as_string())
            
            # Run chaos experiment
            result = run_experiment(experiment)
            
            # Log to BigQuery
            self.gcp_tool.log_to_bigquery(
                table_id="glichu_dataset.chaos_logs",
                data={"experiment_result": str(result)}
            )
            
            return {"status": "experiment_run", "result": result}
        except Exception as e:
            logger.error(f"Error in ChaosInjector: {e}")
            return {"status": "error", "message": str(e)}