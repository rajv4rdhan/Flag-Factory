# Zoo Keeper AI — Infrastructure Plan (suggestion for a human)

Goal: run the AI jailbreak challenge on Kubernetes with a clean, portable,
production-style setup. Start **local (k3d)**, then move to **Azure or AWS**
with **Terraform** later. Deploy everything with **ArgoCD (GitOps)**.

Model: SmolLM2-135M-Instruct served by `llama.cpp` (CPU only, ~100 MB GGUF).
Keep the existing `web/zoo` (Render) untouched. This is a second, separate app.

---

## Golden rules

- Build the image **once**, promote the **same digest** (never `latest`).
- Git is the source of truth: no `kubectl apply` for app changes — ArgoCD does it.
- Secrets never in Git (use External Secrets).
- One chart + one set of manifests, reused locally and in the cloud.
- Only the small Terraform cluster/registry/secrets part changes per cloud.

---

## Target layout

```
ai/jailbreak/
  app/                      # your FastAPI challenge (you build this)
  deploy/helm/jailbreak/    # Helm chart (deployment, service, ingress, keda, servicemonitor)
  deploy/argocd/            # ArgoCD Application
infra/terraform/
  modules/{network,cluster,registry,secrets,k8s-bootstrap}
  envs/{local,azure,aws}
gitops/
  bootstrap/root-app.yaml
  platform/
  observability/
  apps/jailbreak/{application.yaml,values-dev.yaml,values-prod.yaml}
.github/workflows/{jailbreak-ci.yml,terraform.yml}
```

Namespaces: `platform` (ingress, cert-manager, ESO, Kyverno, KEDA),
`observability` (prometheus/grafana/loki), `gitops` (argocd), `jailbreak` (app).

---

## Phase 0 — Local cluster (day 1)

- [ ] Install k3d, kubectl, helm, terraform, argocd CLI.
- [ ] Create cluster: `k3d cluster create jailbreak --agents 2`
- [ ] Verify: `kubectl get nodes`

Done when: cluster is up and `kubectl` talks to it.

## Phase 1 — Platform add-ons (day 1–2)

Install in this order (Helm, namespace `platform`):
- [ ] ingress-nginx
- [ ] cert-manager + a local self-signed `ClusterIssuer`
- [ ] external-secrets operator
- [ ] kyverno
- [ ] keda

Done when: `kubectl get pods -n platform` all Running.

## Phase 2 — Helm chart for the app (day 2–3)

- [ ] Write `deploy/helm/jailbreak` with:
  - Deployment with **2 containers**: `llama-server` + your `api` (localhost)
  - `startupProbe` (slow, model load), `readinessProbe`, `livenessProbe`
  - non-root, read-only rootfs, resource requests/limits
  - Service, Ingress (nginx), ConfigMap (level prompts), Secret refs
  - `ScaledObject` (KEDA) and `ServiceMonitor` (optional at this stage)
- [ ] Model weights: bake into the model-server image (simplest) **or** initContainer → emptyDir.

Done when: `helm template` renders and `helm install` gives a working pod.

## Phase 3 — ArgoCD GitOps (day 3–4)

- [ ] Install ArgoCD in namespace `gitops`.
- [ ] Create `gitops/bootstrap/root-app.yaml` (app-of-apps) → watches `platform/`, `observability/`, `apps/`.
- [ ] Add `gitops/apps/jailbreak/application.yaml` pointing at the Helm chart.
- [ ] Use **sync waves** so CRDs/controllers install before the app.

Done when: ArgoCD shows the app Healthy and Synced; a Git change auto-deploys.

## Phase 4 — CI pipeline (day 4)

`.github/workflows/jailbreak-ci.yml` on PR and `main`:
- [ ] lint (ruff, hadolint), build with buildx
- [ ] Trivy scan + Syft SBOM + Cosign sign
- [ ] push to registry (local: k3d registry; later ACR/ECR) **by digest**
- [ ] update `values-dev.yaml` (ArgoCD Image Updater or a small script)

Done when: merging to `main` builds an image and ArgoCD rolls it out.

## Phase 5 — Observability + autoscaling (day 5)

- [ ] Install `kube-prometheus-stack` in `observability`.
- [ ] ServiceMonitors for `api` and `llama-server` `/metrics`.
- [ ] Grafana dashboard as code: request rate, p95 latency, TTFT, tokens/sec, queue depth.
- [ ] KEDA `ScaledObject` (concurrency metric) + scale-to-zero; load-test to confirm.

Done when: dashboard shows live metrics and replicas scale under load.

## Phase 6 — Terraform (day 6)

- [ ] `modules/k8s-bootstrap`: same Helm releases via Helm provider (any cluster).
- [ ] `envs/local`: create k3d (or document the bootstrap script).
- [ ] `envs/azure`: AKS + ACR + Key Vault + Log Analytics, remote state in Blob.
- [ ] `envs/aws` (stub): EKS + ECR + Secrets Manager + CloudWatch, state in S3.
- [ ] Keep module outputs identical so only `envs/*` differs.
- [ ] `.github/workflows/terraform.yml`: `fmt -check`, `validate`, `tflint`, `checkov`, `plan`.

Done when: `terraform apply` in `envs/local` reproduces the whole stack.

## Phase 7 — Hardening + supply chain (day 7)

- [ ] Kyverno policies: non-root, limits, no `:latest`, verify Cosign signature.
- [ ] Cilium NetworkPolicy: default-deny; app egress only to needed services.
- [ ] External Secrets ← Key Vault / Secrets Manager (no secrets in Git).
- [ ] Ingress rate limiting + WAF (public LLM endpoint = abuse risk).
- [ ] Velero backup (prod); CloudNativePG if you add a scoring DB.

Done when: a policy violation is blocked at admission and secrets come from Key Vault.

## Phase 8 — Cloud (later)

- [ ] Run `terraform apply` in `envs/azure` (or `envs/aws`).
- [ ] Point ArgoCD at the cloud cluster; promote digests dev → staging → prod.
- [ ] Add prod approval gate via GitHub Environments.

Done when: the same chart runs in the cloud with no changes.

---

## What each piece proves (for the resume/README)

- Terraform modules → repeatable, cloud-portable IaC
- ArgoCD app-of-apps → GitOps delivery
- KEDA on inference metrics → AI-workload autoscaling
- Prometheus/Grafana TTFT + tokens/sec → inference observability
- Kyverno + External Secrets + Cosign → secure supply chain
- k3d locally, AKS/EKS in cloud → real environment parity

## Cost note

Local k3d is free. Cloud: AKS free control plane + 1 spot node ~ $30–70/mo;
scale-to-zero and night shutdown cut this a lot. Don't leave it running.
