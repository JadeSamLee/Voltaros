from adk import Agent, GCPTool
from google.cloud import bigquery, storage
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ReporterAgent(Agent):
    def __init__(self):
        super().__init__()
        self.gcp_tool = GCPTool()
        self.bq_client = bigquery.Client()
        self.storage_client = storage.Client()

    async def handle_message(self, message):
        logger.info(f"Reporter received message: {message}")
        try:
            # Query BigQuery for metrics
            query = """
                SELECT * FROM `glichu_dataset.metrics`
                ORDER BY timestamp DESC LIMIT 10
            """
            query_job = self.bq_client.query(query)
            results = [dict(row) for row in query_job]
            
            # Store report in Cloud Storage
            bucket = self.storage_client.bucket("glichu-reports")
            blob = bucket.blob("latest_report.json")
            blob.upload_from_string(json.dumps(results))
            
            # Generate Looker Studio URL (placeholder)
            report_url = "https://lookerstudio.google.com/reporting/glichu"
            
            return {"status": "report_generated", "report_url": report_url}
        except Exception as e:
            logger.error(f"Error in Reporter: {e}")
            return {"status": "error", "message": str(e)}