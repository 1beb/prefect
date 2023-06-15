---
description: Learn the basics of Prefect deployments and workers
tags:
    - tutorial
    - deployment
    - work pool
    - worker
search:
  boost: 2
---
### Why Deploy

The most common reason to use a tool like Prefect, is scheduling and orchestration. You want your workflows running in some production infrastructure in a consistent and predictable way. Up to this point, we’ve demonstrated running Prefect flows as scripts, but this means *you* have been the one triggering flow runs. In order to schedule flow runs or trigger them based on events you’ll need to understand Prefect’s concept of a flow Deployment.

### Deployment Definition

Deploying your flows is, in essence, the act of informing the Prefect API of:

1. Where to run your flows 
2. How to run your flows
3. When to run your flows 

This information is encapsulated and sent to Prefect as a “[Deployment](https://docs.prefect.io/2.10.13/concepts/deployments/?h=deployment#deployments-overview)” which becomes the server side object containing the crucial metadata needed for Prefect’s orchestration api to execute your flow as desired. Deployments elevate workflows from functions that you call manually to API-managed entities.

In doing so, flow scripts get these additional features:

- flows triggered by scheduling
- remote execution of flows triggered from the UI
- flow triggered by automations or events

**Attributes of a deployment include (but are not limited to):** 

- Flow entrypoint = path to your flow function would start the flow
- Workpool = points to the infra you want your flow to run in
- Schedule = optional schedule for this deployment

In order to run **your flows** on **************************************your infrastructure,************************************** you are going to need to set up a work pool and a worker. 

Workers and work pools bridge the Prefect orchestration API with your execution environments in your cloud provider.

You can configure work pools on Prefect’s side. They describe the infrastructure configuration for deployed flow runs that get sent to that pool. organize the flows for your worker to pick up and execute. They prioritize the flows and respond to polling from its worker.

Workers are light-weight long-running polling processes polling that you host in your execution environment. They pick up work from their work pool and spin up ephemeral infrastructure each flow run according to metadata passed to them in the form of deployments.

```mermaid
graph BT
    subgraph your_infra["-- Your Execution Environment --"]
        worker["Worker"]
				subgraph flow_run_infra["Flow Run Infra"]
					flow_run(("Flow Run"))
				end
        
    end

    subgraph api["-- Prefect API --"]
				deployment --> work_pool
        work_pool(["Work Pool"])
    end

    worker --> |polls| work_pool
    worker --> |creates| flow_run_infra

```

<aside>
🔒 Security Note:
Prefect provides execution through the hybrid model which allows you to deploy workflows that run in the environments best suited to their execution while allowing you to keep your code and data completely private. There is no ingress required. For more information see here.

</aside>

Now that we’ve reviewed the concepts of a Work Pool and Worker, let’s create them so that you can deploy your tutorial flow, and execute it later using the Prefect Orchestration API.

For this tutorial you will create a *process type* work pool via the CLI. 

The process work pool type specifies that all work sent to this work pool will run as a subprocess inside the same infrastructure from which the worker is started.  

<aside>
⚙️ Tip:
Aside from process, there are a variety of different work pool types you might consider in a production setting to containerize your flow runs that leverage managed execution platforms, like Kubernetes services or serverless computing environments such as AWS ECS, Azure Container Instances, or GCP Cloud Run which are expanded upon in the guides section.

</aside>

In your terminal set to your Prefect workspace run the following command to set up a work pool. 

```bash
prefect work-pool create --type process tutorial-process-pool
```

Now that you have created the work pool, let’s confirm that the work pool was successfully created by running the following command in the same terminal.  You should see your new `tutorial-process-pool` in the output list.

```bash
prefect work-pool ls
```

Finally, let’s double check in the Prefect Cloud UI that you can see this work pool. Navigate to the Work Pool tab and verify that you see `tutorial-process-pool` listed.

When you click into the `tutorial-process-pool` you can click into the tab for work queues.  You should see a red status icon next listed for the default work queue signifying that this queue is not ready to submit work. Work queues are an advanced topic to help determine flow priority. You can learn more about work queues in the [work queue documentation.](https://docs.prefect.io/2.10.13/concepts/work-pools/#work-queues) 

To get the work queue healthy and ready to submit flow runs, you need to start a worker in your execution environment. For this tutorial, your execution environment is on your laptop or dev machine.

As mentioned above, workers are a lightweight polling system that kick-off flow runs submitted to them by their work pool. To start your worker you will open a new terminal, make sure the same virtual environment is enabled as your python script.  Run the following command in this new terminal to start the worker:

```bash
prefect worker start --pool tutorial-process-pool
```

You should see the worker start, its now polling the Prefect API to see if there are any scheduled flow runs to kick off. You’ll see your new worker listed in the UI under the worker tab of the Work Pool page with a recent Last Polled date. You should also be able to see a healthy status indicator in the default work queue under the work queue tab.

You will need to keep this terminal running in order to have the worker continue to pick up jobs.  Since you are running this worker locally, the worker will terminate if you close the terminal.  When running in a production environment, this worker should be running as a damonized or managed process.

Now that we’ve set up your work pool and worker, they are ready to kick off deployed flow runs. Lets build a deployment that sends work to your `tutorial-process-pool` on a schedule.

! Notes - need to have same file path as python code you were running earlier (double check)