---
description: Prefect will run your deployment on our infrastructure.
tags:
    - managed infrastructure
    - infrastructure
search:
  boost: 2
---

# Managed Execution <span class="badge cloud"></span> <span class="badge-api beta"/>

Prefect Cloud can run your flows on your behalf with **prefect:managed** work pools. Flows run with this work pool do not require a worker or cloud provider account. Prefect handles the infrastructure and code execution for you.

Managed execution is a great option for users who want to get started quickly, with no infrastructure setup.

!!! warning "Managed Execution is in beta"
    Managed Execution is currently in beta.
    Features are likely to change without warning.

## Usage guide

Run a flow with managed infrastructure in three steps.

### Step 1

Create a new work pool of type **prefect:managed**. you can do this via the UI wizard, or via the CLI

```
prefect work-pool create my-managed-pool --type prefect:managed
```



### Step 2

Create a deployment using the flow `deploy` method or `prefect.yaml`.

Specify the name of your managed work pool, as shown in this example that uses the `deploy` method:

```python hl_lines="9" title="managed-execution.py"
from prefect import flow

if __name__ == "__main__":
    flow.from_source(
    source="https://github.com/desertaxle/demo.git",
    entrypoint="flow.py:my_flow",
    ).deploy(
        name="test-managed-flow",
        work_pool_name="my-managed-pool",
    )
```

With your CLI authenticated to your Prefect Cloud workspace, run the script to create your deployment:

<div class="terminal">
```bash
python managed-execution.py
```
</div>

Note that this deployment uses flow code stored in a GitHub repository.

### Step 3

Run the deployment from the UI or from the CLI.

That's it! You ran a flow on remote infrastructure without any infrastructure setup, worker, or cloud provider account.

### Adding dependencies

You can install Python package dependencies at runtime by configuring `job_variables={"pip_packages": ["pandas", "prefect-aws"]}` like this:

```python hl_lines="10"
from prefect import flow

if __name__ == "__main__":
    flow.from_source(
    source="https://github.com/desertaxle/demo.git",
    entrypoint="flow.py:my_flow",
    ).deploy(
        name="test-managed-flow",
        work_pool_name="my-managed-pool",
        job_variables={"pip_packages": ["pandas", "prefect-aws"]}
    )
```

Alternatively, you can specify a `requirements.txt` file and reference it in your `prefect.yaml` `pull_step`.

## Limitations

Managed execution requires Prefect 2.14.4 or newer.

All limitations listed below may change without warning during the beta period.
We will update this page as we make changes.

### Concurrency & work pools
Free tier accounts are limited to:
- Maximum of 1 concurrent flow run per workspace across all `prefect:managed` pools.
- Maximum of 1 managed execution work pool per workspace.

Pro tier and above accounts are limited to:
- Maximum of 10 concurrent flow runs per workspace across all `prefect:managed` pools.
- Maximum of 5 managed execution work pools per workspace.

### Images

At this time, managed execution requires that you run the official Prefect Docker image: `prefecthq/prefect:2-latest`. However, as noted above, you can install Python package dependencies at runtime. If you need to use your own image, we recommend using another type of work pool.

### Code storage

Flow code must be stored in an accessible remote location.
This means git-based cloud providers such as GitHub, Bitbucket, or GitLab are supported.
Remote block-based storage is also supported, so S3, GCS, and Azure Blob are additional code storage options.

### Resources

Memory is limited to 2GB of RAM, which includes all operations such as dependency installation. Maximum job run time is 24 hours.

## Usage limits
Free tier accounts are limited to ten compute hours per workspace per month. Pro tier and above accounts are limited to 250 hours per workspace per month. you can view your compute hours quota usage on the work pools page.


## Next steps

Read more about creating deployments in the [deployment guide](/guides/prefect-deploy/).

If you find that you need more control over your infrastructure, such as the ability to run custom Docker images, serverless push work pools might be a good option.
Read more [here](/guides/deployment/push-work-pools/).
