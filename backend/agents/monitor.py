from adk import Agent, GCPTool
from google.cloud import monitoring_v3, bigquery
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MonitorAgent(Agent):
    def __init__(self):
        super().__init__()
        self.gcp_tool = GCPTool()
        self.bq_client = bigquery.Client()

    async def handle_message(self, message):
        logger.info(f"Monitor received message: {message}")
        try:
            # Fetch metrics from Cloud Monitoring
            client = monitoring_v3.MetricServiceClient()
            project_name = f"projects/{self.gcp_tool.project_id}"
            query = client.list_time_series(
                request={
                    "name": project_name,
                    "filter": 'metric.type = "compute.googleapis.com/instance/cpu/usage_time"',
                    "interval": monitoring_v3.TimeInterval(),
                }
            )
            metrics = [{"value": point.value.double_value} for point in query]
            
            # Store in BigQuery
            table = self.bq_client.get_table("glichu_dataset.metrics")
            errors = self.bq_client.insert_rows_json(table, metrics)
            if errors:
                logger.error(f"BigQuery insert errors: {errors}")
                return {"status": "error", "message": str(errors)}
            
            return {"status": "metrics_stored", "data": metrics}
        except Exception as e:
            logger.error(f"Error in Monitor: {e}")
            return {"status": "error", "message": str(e)}