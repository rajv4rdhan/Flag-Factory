# Phase 3 — MLOps: Fine-Tuning, Evals & Model Registry (Kubeflow)

**Goal:** treat the model as a managed artifact: version it, fine-tune it, run
automated evaluations (including jailbreak/safety evals), register it, and feed
the deployed challenge from a registry — the way industry MLOps works.

**Depends on:** Phase 1 (model + prompts) and Phase 2 (deployed challenge).

---

## 1. Components

| Component | Role |
|---|---|
| **Kubeflow Pipelines (KFP)** | Orchestrates train → finetune → eval → quantize → publish |
| **MLflow** | Experiment tracking + **Model Registry** (versions, stages, lineage) |
| **MinIO** | S3-compatible artifact store for datasets, checkpoints, GGUF, eval reports |
| **Katib** (optional) | Hyperparameter search for the finetune |
| **Notebooks** (optional) | Exploration; keep out of the critical path |

Namespaces: `kubeflow` (KFP/MLflow/MinIO), keep the challenge in `maze`.

---

## 2. The pipeline

`llm/maze/ml/pipelines/` — a KFP pipeline:

1. **ingest** — pull the base model (`Qwen2.5-0.5B-Instruct`) + the small
   "Zoo Keeper" persona dataset.
2. **finetune** — short **LoRA** finetune for persona/behavior; log params +
   metrics to MLflow. (Optional if time-boxed, but it is the point of this
   phase.)
3. **eval (release gate)** — automated evaluation, run on the finetuned model:
   - **jailbreak red-team suite**: known attack prompts; assert the challenge is
     still **solvable** (flag can be leaked with the intended bypass).
   - **refusal/safety suite**: assert normal prompts are **refused**.
   - **regression suite**: fixed prompts + expected properties.
   - Pipeline **fails** if either the solvability or refusal assertions fail.
4. **quantize** — convert to GGUF `Q4_K_M` for CPU serving.
5. **register** — create a **model version** in MLflow Model Registry with
   metrics, eval report, and lineage.
6. **publish** — push artifacts to MinIO (`s3://models/maze/<version>/`)
   and update the deployment's model pointer (Git values file → phase 4 ArgoCD
   rolls it).

---

## 3. Model management

- Every model change is a **versioned registry entry**, never a loose file.
- Promotion stages: `staging` → `production` gated by the eval suite.
- The deployed inference pod pulls the registered artifact by version/URI.
- Rollback = point to the previous registry version.
- Keep the **system prompt + guardrail** versioned alongside the model, since the
  challenge behavior depends on both.

---

## 4. Evals as code

- `llm/maze/ml/evals/redteam/` — attack prompts + expected outcomes.
- `llm/maze/ml/evals/safety/` — benign prompts that must be refused.
- Share the intended-exploit test with `llm/maze/tests/` from phase 1 so
  local, CI, and pipeline agree.
- Store eval reports as pipeline artifacts; surface key metrics in MLflow and
  (phase 4) Grafana.

---

## 5. Fine-tuning details

- Method: **LoRA** (PEFT) on the 0.5B base — small, CPU-friendly, or one GPU.
- Dataset: a few hundred persona examples ("Zoo Keeper" voice) + the secret-
  protection framing.
- Output: merged adapter → base for GGUF quantize.
- Time-box this; if the base model already behaves well, the pipeline still
  proves the lifecycle (ingest → eval → register).

---

## 6. Automation

- `ml/scripts/pipeline-run.sh` — compile + submit a run.
- A GitHub Actions workflow triggers the pipeline when `ml/**` or
  `model/**` changes and waits for the **eval gate**.
- On success, open a PR bumping the model version in the deploy values.

---

## Deliverables

- `llm/maze/ml/pipelines/` (KFP components + `pipeline.py` + compiled yaml)
- `llm/maze/ml/evals/` (red-team, safety, regression suites)
- Kubeflow + MLflow + MinIO install manifests
- `ml/scripts/pipeline-run.sh`
- Model card / eval report template in `model/`

## Done when

- A pipeline run completes: artifact in MinIO, **version in MLflow registry**.
- A deliberately broken prompt or model **fails the eval gate and blocks publish**.
- Promoting a new model version rolls the deployed challenge (via values + ArgoCD
  in phase 4) and the served behavior changes.
- Rollback to a previous model version works.

## Notes

- This phase is what turns "a model file" into "a managed model."
- Keep resource requests modest; scale KFP down when idle.
- If Notebooks/Katib are out of scope, note it — do not block the pipeline on them.
